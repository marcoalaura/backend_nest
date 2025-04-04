import { BaseService } from '../../../common/base/base-service'
import {
  ForbiddenException,
  Inject,
  Injectable,
  PreconditionFailedException,
  Query,
} from '@nestjs/common'
import { UsuarioRepository } from '../repository/usuario.repository'
import {
  Status,
  TipoDocumento,
  USUARIO_NORMAL,
} from '../../../common/constants'
import { CrearUsuarioDto } from '../dto/crear-usuario.dto'
import { TextService } from '../../../common/lib/text.service'
import { MensajeriaService } from '../../external-services/mensajeria/mensajeria.service'
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception'
import { Messages } from '../../../common/constants/response-messages'
import { AuthorizationService } from '../../authorization/controller/authorization.service'
import { PersonaDto } from '../dto/persona.dto'
import { UsuarioRolRepository } from '../../authorization/repository/usuario-rol.repository'
import { ActualizarUsuarioRolDto } from '../dto/actualizar-usuario-rol.dto'
import { CrearUsuarioCiudadaniaDto } from '../dto/crear-usuario-ciudadania.dto'
import { SegipService } from '../../external-services/iop/segip/segip.service'
import { ConfigService } from '@nestjs/config'
import { TemplateEmailService } from '../../../common/templates/templates-email.service'
import { FiltrosUsuarioDto } from '../dto/filtros-usuario.dto'
import { RolRepository } from '../../authorization/repository/rol.repository'
import { EntityManager } from 'typeorm'
import { CrearUsuarioCuentaDto } from '../dto/crear-usuario-cuenta.dto'
import {
  NuevaContrasenaDto,
  RecuperarCuentaDto,
  ValidarRecuperarCuentaDto,
} from '../dto/recuperar-cuenta.dto'

@Injectable()
export class UsuarioService extends BaseService {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(UsuarioRepository)
    private usuarioRepositorio: UsuarioRepository,
    @Inject(UsuarioRolRepository)
    private usuarioRolRepositorio: UsuarioRolRepository,
    @Inject(RolRepository)
    private rolRepositorio: RolRepository,
    private readonly mensajeriaService: MensajeriaService,
    private readonly authorizationService: AuthorizationService,
    private readonly segipServices: SegipService,
    private configService: ConfigService
  ) {
    super(UsuarioService.name)
  }

  async listar(@Query() paginacionQueryDto: FiltrosUsuarioDto) {
    return await this.usuarioRepositorio.listar(paginacionQueryDto)
  }

  async buscarUsuario(usuario: string) {
    return await this.usuarioRepositorio.buscarUsuario(usuario)
  }

  async crear(usuarioDto: CrearUsuarioDto, usuarioAuditoria: string) {
    // verificar si el usuario ya fue registrado
    const usuario = await this.usuarioRepositorio.buscarUsuarioPorCI(
      usuarioDto.persona
    )

    if (usuario) {
      throw new PreconditionFailedException(Messages.EXISTING_USER)
    }

    // verificar si el correo no esta registrado
    const correo = await this.usuarioRepositorio.buscarUsuarioPorCorreo(
      usuarioDto.correoElectronico
    )

    if (correo) {
      throw new PreconditionFailedException(Messages.EXISTING_EMAIL)
    }

    // contrastacion segip
    const { persona } = usuarioDto
    const contrastaSegip = await this.segipServices.contrastar(persona)

    if (!contrastaSegip?.finalizado) {
      throw new PreconditionFailedException(contrastaSegip?.mensaje)
    }

    const contrasena = TextService.generateShortRandomText()
    const datosCorreo = {
      correo: usuarioDto.correoElectronico,
      asunto: Messages.SUBJECT_EMAIL_ACCOUNT_ACTIVE,
    }

    const op = async (transaction: EntityManager) => {
      usuarioDto.contrasena = await TextService.encrypt(contrasena)
      usuarioDto.estado = Status.ACTIVE
      return await this.usuarioRepositorio.crear(
        usuarioDto,
        usuarioAuditoria,
        transaction
      )
    }
    const crearResult = await this.usuarioRepositorio.runTransaction(op)

    await this.enviarCorreoContrasenia(
      datosCorreo,
      usuarioDto.persona.nroDocumento,
      contrasena
    ).catch((err) => this.logger.error(err))

    return crearResult
  }

  async crearCuenta(usuarioDto: CrearUsuarioCuentaDto) {
    // verificar si el usuario ya fue registrado con su correo
    const usuario = await this.usuarioRepositorio.buscarUsuario(
      usuarioDto.correoElectronico
    )

    if (usuario) {
      throw new PreconditionFailedException(Messages.EXISTING_USER)
    }

    // verificar si el correo no esta registrado
    const correo = await this.usuarioRepositorio.buscarUsuarioPorCorreo(
      usuarioDto.correoElectronico
    )

    if (correo) {
      throw new PreconditionFailedException(Messages.EXISTING_EMAIL)
    }

    const rol = await this.rolRepositorio.buscarPorNombreRol('USUARIO')

    if (!TextService.validateLevelPassword(usuarioDto.contrasenaNueva)) {
      throw new PreconditionFailedException(Messages.INVALID_PASSWORD_SCORE)
    }

    const op = async (transaction: EntityManager) => {
      const usuarioNuevo = await this.usuarioRepositorio.crear(
        {
          usuario: usuarioDto.correoElectronico,
          persona: {
            nombres: usuarioDto.nombres,
            primerApellido: '',
            segundoApellido: '',
            nroDocumento: TextService.textToUuid(usuarioDto.correoElectronico),
            fechaNacimiento: new Date(),
            tipoDocumento: TipoDocumento.OTRO,
          },
          correoElectronico: usuarioDto.correoElectronico,
          roles: rol?.id ? [rol?.id] : [],
          estado: Status.PENDING,
          contrasena: await TextService.encrypt(usuarioDto.contrasenaNueva),
        },
        USUARIO_NORMAL,
        transaction
      )

      if (usuarioNuevo?.id) {
        const codigo = TextService.generateUuid()
        const urlActivacion = `${this.configService.get(
          'URL_FRONTEND'
        )}/activacion?q=${codigo}`

        this.logger.info(`📩 urlActivacion: ${urlActivacion}`)

        await this.actualizarDatosActivacion(
          usuarioNuevo.id,
          codigo,
          USUARIO_NORMAL,
          transaction
        )

        const template =
          TemplateEmailService.armarPlantillaActivacionCuentaManual(
            urlActivacion
          )

        if (usuarioNuevo.correoElectronico) {
          await this.mensajeriaService
            .sendEmail(
              usuarioNuevo.correoElectronico,
              Messages.SUBJECT_EMAIL_ACCOUNT_LOCKED,
              template
            )
            .catch((err) => this.logger.error(err))
        }
      }

      return usuarioNuevo
    }
    return await this.usuarioRepositorio.runTransaction(op)
  }

  async activarCuenta(codigo) {
    const usuario = await this.usuarioRepositorio.buscarPorCodigoActivacion(
      codigo
    )

    if (!usuario) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    await this.usuarioRepositorio.actualizarUsuario(usuario?.id, {
      estado: Status.ACTIVE,
      codigoActivacion: null,
      usuarioModificacion: USUARIO_NORMAL,
    })

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    return { id: usuarioActualizado.id, estado: usuarioActualizado.estado }
  }

  async recuperarCuenta(recuperarCuentaDto: RecuperarCuentaDto) {
    const usuario = await this.usuarioRepositorio.buscarUsuarioPorCorreo(
      recuperarCuentaDto.correoElectronico
    )

    if (!usuario) {
      this.logger.info(`Usuario no encontrado`)
      return 'Búsqueda terminada'
    }

    const codigo = TextService.generateUuid()
    const urlRecuperacion = `${this.configService.get(
      'URL_FRONTEND'
    )}/recuperacion?q=${codigo}`

    this.logger.info(`📩 urlRecuperacion: ${urlRecuperacion}`)

    await this.actualizarDatosRecuperacion(usuario.id, codigo)

    const template =
      TemplateEmailService.armarPlantillaRecuperacionCuenta(urlRecuperacion)

    if (usuario.correoElectronico) {
      await this.mensajeriaService
        .sendEmail(
          usuario.correoElectronico,
          Messages.SUBJECT_EMAIL_ACCOUNT_LOCKED,
          template
        )
        .catch((err) => this.logger.error(err))
    }
    return 'Búsqueda terminada'
  }

  async validarRecuperar(validarRecuperarCuentaDto: ValidarRecuperarCuentaDto) {
    const usuario = await this.usuarioRepositorio.buscarPorCodigoRecuperacion(
      validarRecuperarCuentaDto.codigo
    )

    if (!usuario) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    const codigo = TextService.generateUuid()

    await this.actualizarDatosTransaccionRecuperacion(usuario.id, codigo)

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    return { code: usuarioActualizado.codigoTransaccion }
  }

  async nuevaContrasenaTransaccion(nuevaContrasenaDto: NuevaContrasenaDto) {
    const usuario = await this.usuarioRepositorio.buscarPorCodigoTransaccion(
      nuevaContrasenaDto.codigo
    )

    if (!usuario) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    if (
      !TextService.validateLevelPassword(nuevaContrasenaDto.contrasenaNueva)
    ) {
      throw new PreconditionFailedException(Messages.INVALID_PASSWORD_SCORE)
    }

    await this.usuarioRepositorio.actualizarUsuario(usuario.id, {
      fechaBloqueo: null,
      intentos: 0,
      codigoDesbloqueo: null,
      codigoTransaccion: null,
      codigoRecuperacion: null,
      contrasena: await TextService.encrypt(
        TextService.decodeBase64(nuevaContrasenaDto.contrasenaNueva)
      ),
      estado: Status.ACTIVE,
    })

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    return { id: usuarioActualizado.id }
  }

  async crearConCiudadania(
    usuarioDto: CrearUsuarioCiudadaniaDto,
    usuarioAuditoria: string
  ) {
    const persona = new PersonaDto()
    persona.nroDocumento = usuarioDto.usuario
    const usuario = await this.usuarioRepositorio.buscarUsuarioPorCI(persona)
    if (usuario) {
      throw new PreconditionFailedException(Messages.EXISTING_USER)
    }

    usuarioDto.estado = Status.ACTIVE

    const op = async (transaction: EntityManager) => {
      return await this.usuarioRepositorio.crear(
        usuarioDto as CrearUsuarioDto,
        usuarioAuditoria,
        transaction
      )
    }
    return await this.usuarioRepositorio.runTransaction(op)
  }

  async crearConPersonaExistente(
    persona,
    otrosDatos,
    usuarioAuditoria: string
  ) {
    // verificar si el usuario ya fue registrado
    const usuario = await this.usuarioRepositorio.verificarExisteUsuarioPorCI(
      persona.nroDocumento
    )

    if (usuario) {
      throw new PreconditionFailedException(Messages.EXISTING_USER)
    }

    const rol = await this.rolRepositorio.buscarPorNombreRol('USUARIO')

    const nuevoUsuario = {
      estado: Status.ACTIVE,
      correoElectronico: otrosDatos?.correoElectronico,
      persona,
      ciudadaniaDigital: true,
      roles: [rol],
    }
    const result = await this.usuarioRepositorio.crearConPersonaExistente(
      nuevoUsuario,
      usuarioAuditoria
    )
    return { id: result.id, estado: result.estado }
  }

  async crearConCiudadaniaV2(
    personaCiudadania,
    otrosDatos,
    usuarioAuditoria: string
  ) {
    const persona = new PersonaDto()
    // completar campos de Ciudadanía
    persona.tipoDocumento = personaCiudadania.tipoDocumento
    persona.nroDocumento = personaCiudadania.nroDocumento
    persona.fechaNacimiento = personaCiudadania.fechaNacimiento
    persona.nombres = personaCiudadania.nombres
    persona.primerApellido = personaCiudadania.primerApellido
    persona.segundoApellido = personaCiudadania.segundoApellido

    const usuario = await this.usuarioRepositorio.verificarExisteUsuarioPorCI(
      persona.nroDocumento
    )
    if (usuario) throw new PreconditionFailedException(Messages.EXISTING_USER)

    const rol = await this.rolRepositorio.buscarPorNombreRol('USUARIO')

    const nuevoUsuario: CrearUsuarioDto = {
      usuario: personaCiudadania.nroDocumento,
      estado: Status.ACTIVE,
      correoElectronico: otrosDatos?.correoElectronico,
      persona,
      ciudadaniaDigital: true,
      roles: rol?.id ? [rol?.id] : [],
    }

    const op = async (transaction: EntityManager) => {
      return await this.usuarioRepositorio.crear(
        nuevoUsuario,
        usuarioAuditoria,
        transaction
      )
    }
    const result = await this.usuarioRepositorio.runTransaction(op)

    return { id: result.id, estado: result.estado }
  }

  async activar(idUsuario, usuarioAuditoria: string) {
    this.verificarPermisos(idUsuario, usuarioAuditoria)
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)
    const statusValid = [Status.CREATE, Status.INACTIVE, Status.PENDING]

    if (!(usuario && statusValid.includes(usuario.estado as Status))) {
      throw new EntityNotFoundException(Messages.INVALID_USER)
    }

    // cambiar estado al usuario y generar una nueva contrasena
    const contrasena = TextService.generateShortRandomText()

    await this.usuarioRepositorio.actualizarUsuario(idUsuario, {
      contrasena: await TextService.encrypt(contrasena),
      estado: Status.PENDING,
      usuarioModificacion: usuarioAuditoria,
    })

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    // si está bien ≥ enviar el mail con la contraseña generada
    const datosCorreo = {
      correo: usuario.correoElectronico,
      asunto: Messages.SUBJECT_EMAIL_ACCOUNT_ACTIVE,
    }
    await this.enviarCorreoContrasenia(
      datosCorreo,
      usuario.usuario,
      contrasena
    ).catch((err) => this.logger.error(err))
    return { id: usuarioActualizado.id, estado: usuarioActualizado.estado }
  }

  async inactivar(idUsuario: string, usuarioAuditoria: string) {
    this.verificarPermisos(idUsuario, usuarioAuditoria)
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)

    if (!usuario) {
      throw new EntityNotFoundException(Messages.INVALID_USER)
    }

    await this.usuarioRepositorio.actualizarUsuario(idUsuario, {
      usuarioModificacion: usuarioAuditoria,
      estado: Status.INACTIVE,
    })

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    return {
      id: usuarioActualizado.id,
      estado: usuarioActualizado.estado,
    }
  }

  async enviarCorreoContrasenia(datosCorreo, usuario, contrasena) {
    const url = this.configService.get('URL_FRONTEND')
    const template = TemplateEmailService.armarPlantillaActivacionCuenta(
      url,
      usuario,
      contrasena
    )

    const result = await this.mensajeriaService.sendEmail(
      datosCorreo.correo,
      datosCorreo.asunto,
      template
    )
    return result.finalizado
  }

  verificarPermisos(usuarioAuditoria, id) {
    if (usuarioAuditoria === id) {
      throw new ForbiddenException(
        'No tienes permisos para realizar la acción porque se trata de tu propia cuenta'
      )
    }
  }

  async actualizarContrasena(idUsuario, contrasenaActual, contrasenaNueva) {
    const hash = TextService.decodeBase64(contrasenaActual)
    const usuario = await this.usuarioRepositorio.buscarUsuarioRolPorId(
      idUsuario
    )

    if (!(usuario && (await TextService.compare(hash, usuario.contrasena)))) {
      throw new PreconditionFailedException(Messages.INVALID_CREDENTIALS)
    }
    // validar que la contrasena nueva cumpla nivel de seguridad
    const contrasena = TextService.decodeBase64(contrasenaNueva)

    if (!TextService.validateLevelPassword(contrasena)) {
      throw new PreconditionFailedException(Messages.INVALID_PASSWORD_SCORE)
    }

    // guardar en bd
    await this.usuarioRepositorio.actualizarUsuario(idUsuario, {
      contrasena: await TextService.encrypt(contrasena),
      estado: Status.ACTIVE,
    })

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    return {
      id: usuarioActualizado.id,
      estado: usuarioActualizado.estado,
    }
  }

  async restaurarContrasena(idUsuario: string, usuarioAuditoria: string) {
    this.verificarPermisos(idUsuario, usuarioAuditoria)
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)
    const statusValid = [Status.ACTIVE, Status.PENDING]

    if (!(usuario && statusValid.includes(usuario.estado as Status))) {
      throw new EntityNotFoundException(Messages.INVALID_USER)
    }

    const op = async (transaccion: EntityManager) => {
      const contrasena = TextService.generateShortRandomText()
      await this.usuarioRepositorio.actualizar(
        idUsuario,
        {
          contrasena: await TextService.encrypt(contrasena),
          usuarioActualizacion: usuarioAuditoria,
        },
        transaccion
      )

      const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
        idUsuario,
        transaccion
      )

      if (!usuarioActualizado) {
        throw new EntityNotFoundException(Messages.INVALID_USER)
      }

      // si está bien ≥ enviar el mail con la contraseña generada
      const datosCorreo = {
        correo: usuario.correoElectronico,
        asunto: Messages.SUBJECT_EMAIL_ACCOUNT_RESET,
      }
      await this.enviarCorreoContrasenia(
        datosCorreo,
        usuarioActualizado.usuario,
        usuarioActualizado.contrasena
      ).catch((err) => this.logger.error(err))

      return usuarioActualizado
    }

    const usuarioResult = await this.usuarioRepositorio.runTransaction(op)

    return { id: idUsuario, estado: usuarioResult.estado }
  }

  async reenviarCorreoActivacion(idUsuario: string, usuarioAuditoria: string) {
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)
    const statusValid = [Status.PENDING]

    if (!(usuario && statusValid.includes(usuario.estado as Status))) {
      throw new EntityNotFoundException(Messages.INVALID_USER)
    }

    const op = async (transaction: EntityManager) => {
      const codigo = TextService.generateUuid()
      const urlActivacion = `${this.configService.get(
        'URL_FRONTEND'
      )}/activacion?q=${codigo}`

      this.logger.info(`📩 urlActivacion nuevo: ${urlActivacion}`)

      await this.actualizarDatosActivacion(
        usuario.id,
        codigo,
        usuarioAuditoria,
        transaction
      )

      const template =
        TemplateEmailService.armarPlantillaActivacionCuentaManual(urlActivacion)

      if (usuario.correoElectronico) {
        await this.mensajeriaService
          .sendEmail(
            usuario.correoElectronico,
            Messages.SUBJECT_EMAIL_ACCOUNT_LOCKED,
            template
          )
          .catch((err) => this.logger.error(err))
      }

      const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
        idUsuario,
        transaction
      )

      if (!usuarioActualizado) {
        throw new EntityNotFoundException(Messages.INVALID_USER)
      }

      return usuarioActualizado
    }

    const usuarioResult = await this.usuarioRepositorio.runTransaction(op)

    return { id: idUsuario, estado: usuarioResult.estado }
  }

  async actualizarDatos(
    id: string,
    usuarioDto: ActualizarUsuarioRolDto,
    usuarioAuditoria: string
  ) {
    this.verificarPermisos(id, usuarioAuditoria)
    // 1. verificar que exista el usuario
    const usuario = await this.usuarioRepositorio.buscarPorId(id)

    if (!usuario) {
      throw new EntityNotFoundException(Messages.INVALID_USER)
    }

    const { correoElectronico, roles } = usuarioDto
    // 2. verificar que el email no este registrado

    if (correoElectronico && correoElectronico !== usuario.correoElectronico) {
      const existe = await this.usuarioRepositorio.buscarUsuarioPorCorreo(
        correoElectronico
      )
      if (existe) {
        throw new PreconditionFailedException(Messages.EXISTING_EMAIL)
      }
      await this.usuarioRepositorio.actualizarUsuario(id, {
        correoElectronico: correoElectronico,
        usuarioModificacion: usuarioAuditoria,
      })
    }

    if (roles.length > 0) {
      // realizar reglas de roles
      await this.actualizarRoles(id, roles, usuarioAuditoria)
    }
    return { id: usuario.id }
  }

  async actualizarRoles(id, roles, usuarioAuditoria) {
    const usuarioRoles =
      await this.usuarioRolRepositorio.obtenerRolesPorUsuario(id)

    const { inactivos, activos, nuevos } = this.verificarUsuarioRoles(
      usuarioRoles,
      roles
    )

    // ACTIVAR roles inactivos
    if (inactivos.length > 0) {
      await this.usuarioRolRepositorio.activar(id, inactivos, usuarioAuditoria)
    }
    // INACTIVAR roles activos
    if (activos.length > 0) {
      await this.usuarioRolRepositorio.inactivar(id, activos, usuarioAuditoria)
    }
    // CREAR nuevos roles
    if (nuevos.length > 0) {
      await this.usuarioRolRepositorio.crear(id, nuevos, usuarioAuditoria)
    }
  }

  verificarUsuarioRoles(usuarioRoles, roles) {
    const inactivos = roles.filter((rol) =>
      usuarioRoles.some(
        (usuarioRol) =>
          usuarioRol.rol.id === rol && usuarioRol.estado === Status.INACTIVE
      )
    )

    const activos = usuarioRoles
      .map((usuarioRol) =>
        roles.every(
          (rol) =>
            rol !== usuarioRol.rol.id && usuarioRol.estado === Status.ACTIVE
        )
          ? usuarioRol.rol.id
          : null
      )
      .filter(Boolean)

    const nuevos = roles.filter((rol) =>
      usuarioRoles.every((usuarioRol) => usuarioRol.rol.id !== rol)
    )

    return {
      activos,
      inactivos,
      nuevos,
    }
  }

  async buscarUsuarioId(id: string) {
    const usuario = await this.usuarioRepositorio.buscarUsuarioRolPorId(id)

    if (!usuario) {
      throw new EntityNotFoundException(Messages.INVALID_USER)
    }

    return {
      id: usuario.id,
      usuario: usuario.usuario,
      ciudadania_digital: usuario.ciudadaniaDigital,
      estado: usuario.estado,
      roles: await Promise.all(
        usuario.usuarioRol
          .filter((value) => value.estado === Status.ACTIVE)
          .map(async (usuarioRol) => {
            const { id, rol, nombre } = usuarioRol.rol
            const modulos =
              await this.authorizationService.obtenerPermisosPorRol(rol)
            return {
              idRol: id,
              rol,
              nombre,
              modulos,
            }
          })
      ),
      persona: usuario.persona,
    }
  }

  async buscarUsuarioPorCI(persona: PersonaDto) {
    return await this.usuarioRepositorio.buscarUsuarioPorCI(persona)
  }

  async actualizarContadorBloqueos(idUsuario: string, intento: number) {
    return await this.usuarioRepositorio.actualizarContadorBloqueos(
      idUsuario,
      intento
    )
  }

  async actualizarDatosBloqueo(idUsuario, codigo, fechaBloqueo) {
    return await this.usuarioRepositorio.actualizarDatosBloqueo(
      idUsuario,
      codigo,
      fechaBloqueo
    )
  }

  async actualizarDatosRecuperacion(idUsuario, codigo) {
    return await this.usuarioRepositorio.actualizarDatosRecuperacion(
      idUsuario,
      codigo
    )
  }

  async actualizarDatosActivacion(
    idUsuario: string,
    codigo: string,
    usuarioAuditoria: string,
    transaction: EntityManager
  ) {
    return await this.usuarioRepositorio.actualizarDatosActivacion(
      idUsuario,
      codigo,
      usuarioAuditoria,
      transaction
    )
  }

  async actualizarDatosTransaccionRecuperacion(
    idUsuario: string,
    codigo: string
  ) {
    return await this.usuarioRepositorio.actualizarDatosTransaccion(
      idUsuario,
      codigo
    )
  }

  async desbloquearCuenta(codigo: string) {
    const usuario = await this.usuarioRepositorio.buscarPorCodigoDesbloqueo(
      codigo
    )
    if (usuario?.fechaBloqueo) {
      await this.usuarioRepositorio.actualizarUsuario(usuario.id, {
        fechaBloqueo: null,
        intentos: 0,
        codigoDesbloqueo: null,
      })
    }
    return { codigo }
  }

  async actualizarDatosPersona(datosPersona: PersonaDto) {
    return await this.usuarioRepositorio.actualizarDatosPersona(datosPersona)
    // eslint-disable-next-line max-lines
  }
}
