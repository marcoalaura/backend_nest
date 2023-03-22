import { BaseService } from '../../../common/base/base-service'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { UsuarioService } from '../../usuario/service/usuario.service'
import { JwtService } from '@nestjs/jwt'
import { TextService } from '../../../common/lib/text.service'
import { RefreshTokensService } from './refreshTokens.service'
import {
  Status,
  USUARIO_NORMAL,
  USUARIO_SISTEMA,
} from '../../../common/constants'
import { Configurations } from '../../../common/params'
import { Messages } from '../../../common/constants/response-messages'
import dayjs from 'dayjs'
import { MensajeriaService } from '../../external-services/mensajeria/mensajeria.service'
import { PersonaDto } from '../../usuario/dto/persona.dto'
import { ConfigService } from '@nestjs/config'
import { UsuarioRolRepository } from '../../authorization/repository/usuario-rol.repository'
import { PersonaService } from '../../usuario/service/persona.service'
import { RolRepository } from '../../authorization/repository/rol.repository'
import { TemplateEmailService } from '../../../common/templates/templates-email.service'

@Injectable()
export class AuthenticationService extends BaseService {
  // eslint-disable-next-line max-params
  constructor(
    private readonly personaService: PersonaService,
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly mensajeriaService: MensajeriaService,
    @Inject(UsuarioRolRepository)
    private usuarioRolRepositorio: UsuarioRolRepository,
    @Inject(RolRepository)
    private rolRepositorio: RolRepository,
    @Inject(ConfigService) private readonly configService: ConfigService
  ) {
    super(AuthenticationService.name)
  }

  private async verificarBloqueo(usuario) {
    if (usuario.intentos < Configurations.WRONG_LOGIN_LIMIT) {
      return false
    }

    if (usuario.fechaBloqueo) {
      return !(usuario.fechaBloqueo && dayjs().isAfter(usuario.fechaBloqueo))
    }

    // generar código y fecha de desbloqueo
    const codigo = TextService.generateUuid()
    const fechaBloqueo = dayjs().add(
      Configurations.MINUTES_LOGIN_LOCK,
      'minute'
    )
    await this.usuarioService.actualizarDatosBloqueo(
      usuario.id,
      codigo,
      fechaBloqueo
    )
    // enviar código por email
    const urlDesbloqueo = `${this.configService.get(
      'URL_FRONTEND'
    )}/desbloqueo?q=${codigo}`

    const template =
      TemplateEmailService.armarPlantillaBloqueoCuenta(urlDesbloqueo)

    await this.mensajeriaService.sendEmail(
      usuario.correoElectronico,
      Messages.SUBJECT_EMAIL_ACCOUNT_LOCKED,
      template
    )
    return true
  }

  async generarIntentoBloqueo(usuario) {
    if (dayjs().isAfter(usuario.fechaBloqueo)) {
      // restaurar datos bloqueo
      await this.usuarioService.actualizarDatosBloqueo(usuario.id, null, null)
      await this.usuarioService.actualizarContadorBloqueos(usuario.id, 1)
    } else {
      const intento = usuario.intentos + 1
      await this.usuarioService.actualizarContadorBloqueos(usuario.id, intento)
    }
  }

  async validarUsuario(usuario: string, contrasena: string): Promise<any> {
    const respuesta = await this.usuarioService.buscarUsuario(usuario)

    if (!respuesta) {
      return null
    }

    if (respuesta?.usuarioRol.length === 0) {
      throw new UnauthorizedException(Messages.NO_PERMISSION_USER)
    }

    if (respuesta?.estado === Status.PENDING) {
      throw new UnauthorizedException(Messages.PENDING_USER)
    }

    if (respuesta?.estado === Status.INACTIVE) {
      throw new UnauthorizedException(Messages.INACTIVE_USER)
    }

    // verificar si la cuenta esta bloqueada
    const verificacionBloqueo = await this.verificarBloqueo(respuesta)

    if (verificacionBloqueo) {
      throw new UnauthorizedException(Messages.USER_BLOCKED)
    }

    const pass = TextService.decodeBase64(contrasena)

    if (!(await TextService.compare(pass, respuesta.contrasena))) {
      await this.generarIntentoBloqueo(respuesta)
      throw new UnauthorizedException(Messages.INVALID_USER_CREDENTIALS)
    }
    // si se logra autenticar con exito => reiniciar contador de intentos a 0
    if (respuesta.intentos > 0) {
      await this.usuarioService.actualizarContadorBloqueos(respuesta.id, 0)
    }
    let roles: Array<string | null> = []
    if (respuesta.usuarioRol.length) {
      roles = respuesta.usuarioRol
        .filter((usuarioRol) => usuarioRol.estado === Status.ACTIVE)
        .map((usuarioRol) => usuarioRol.rol.rol)
    }

    return { id: respuesta.id, roles }
  }

  async autenticar(user: PassportUser) {
    const usuario = await this.usuarioService.buscarUsuarioId(user.id)

    const payload = { id: user.id, roles: user.roles }
    // crear refresh_token
    const refreshToken = await this.refreshTokensService.create(user.id)
    // construir respuesta
    const data = {
      access_token: this.jwtService.sign(payload),
      ...usuario,
    }
    return {
      refresh_token: { id: refreshToken.id },
      data,
    }
  }

  async validarUsuarioOidc(persona: PersonaDto): Promise<any> {
    const respuesta = await this.usuarioService.buscarUsuarioPorCI(persona)
    if (!respuesta) {
      return null
    }

    const { estado, persona: datosPersona } = respuesta
    if (estado === Status.INACTIVE) {
      throw new UnauthorizedException(Messages.INACTIVE_USER)
    }
    // actualizar datos persona
    if (
      datosPersona.nombres !== persona.nombres &&
      datosPersona.primerApellido !== persona.primerApellido &&
      datosPersona.segundoApellido !== persona.segundoApellido &&
      datosPersona.fechaNacimiento !== persona.fechaNacimiento
    ) {
      await this.usuarioService.actualizarDatosPersona(persona)
    }

    if (!respuesta.usuarioRol.length) {
      return null
    }

    const roles = respuesta.usuarioRol.map((usuarioRol) => usuarioRol.rol.rol)
    return { id: respuesta.id, roles }
  }

  async validarOCrearUsuarioOidc(
    persona: PersonaDto,
    datosUsuario
  ): Promise<any> {
    const respuesta = await this.usuarioService.buscarUsuarioPorCI(persona)
    if (respuesta) {
      // Persona y usuario existen en BD
      // console.log('persona', respuesta);
      const { estado, persona: datosPersona } = respuesta
      if (estado === Status.INACTIVE) {
        throw new UnauthorizedException(Messages.INACTIVE_USER)
      }

      if (
        datosPersona.nombres !== persona.nombres &&
        datosPersona.primerApellido !== persona.primerApellido &&
        datosPersona.segundoApellido !== persona.segundoApellido &&
        datosPersona.fechaNacimiento !== persona.fechaNacimiento
      ) {
        // Actualizar datos de persona
        await this.usuarioService.actualizarDatosPersona(persona)
      }
      if (datosUsuario.correoElectronico !== respuesta.correoElectronico) {
        // Actualizar correo si es diferente en ciudadanía
        respuesta.correoElectronico = datosUsuario.correoElectronico
        await this.usuarioService.actualizarDatos(
          String(respuesta.id),
          {
            correoElectronico: respuesta.correoElectronico,
            roles: respuesta.usuarioRol.map((value) => value.id),
          },
          USUARIO_SISTEMA
        )
      }
      let roles: Array<string | null> = []

      if (respuesta.usuarioRol.length) {
        roles = respuesta.usuarioRol.map((usuarioRol) => usuarioRol.rol.rol)
      }
      return { id: respuesta.id, roles }
    } else {
      // No existe persona, o no cuenta con un usuario - registrar
      let nuevoUsuario: { estado: string | null; id: string | null } = {
        id: null,
        estado: null,
      }
      const respPersona = await this.personaService.buscarPersonaPorCI(persona)
      if (respPersona) {
        // Persona existe en base de datos, sólo crear usuario
        if (respPersona.estado === Status.INACTIVE) {
          throw new UnauthorizedException(Messages.INACTIVE_PERSON)
        }
        // Actualizar datos persona
        if (
          respPersona.nombres !== persona.nombres ||
          respPersona.primerApellido !== persona.primerApellido ||
          respPersona.segundoApellido !== persona.segundoApellido ||
          respPersona.fechaNacimiento !== persona.fechaNacimiento
        ) {
          await this.usuarioService.actualizarDatosPersona(persona)
        }
        // Crear usuario y rol
        nuevoUsuario = await this.usuarioService.crearConPersonaExistente(
          respPersona,
          datosUsuario,
          USUARIO_NORMAL
        )
      } else {
        // No existe la persona en base de datos, crear registro completo de persona
        nuevoUsuario = await this.usuarioService.crearConCiudadaniaV2(
          persona,
          datosUsuario,
          USUARIO_NORMAL
        )
      }

      if (!(nuevoUsuario && nuevoUsuario.id)) {
        return null
      }

      const respuesta = await this.usuarioService.buscarUsuarioPorCI(persona)

      if (!respuesta) {
        return null
      }

      return {
        id: respuesta.id,
        roles: respuesta.usuarioRol
          ? respuesta.usuarioRol.map((usuarioRol) => usuarioRol.rol.rol)
          : [],
      }
    }
  }

  async autenticarOidc(user: any) {
    const payload = { id: user.id, roles: user.roles }
    // crear refresh_token
    const refreshToken = await this.refreshTokensService.create(user.id)
    // construir respuesta
    const data = {
      access_token: this.jwtService.sign(payload),
    }
    return {
      refresh_token: { id: refreshToken.id },
      data,
    }
  }
}
