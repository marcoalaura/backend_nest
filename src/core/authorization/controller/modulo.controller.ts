import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { BaseController } from '../../../common/base/base-controller'
import { ModuloService } from '../service/modulo.service'
import { CrearModuloDto, FiltroModuloDto } from '../dto/crear-modulo.dto'
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '../guards/casbin.guard'
import { ParamIdDto } from '../../../common/dto/params-id.dto'

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('autorizacion/modulos')
export class ModuloController extends BaseController {
  constructor(private moduloService: ModuloService) {
    super(ModuloController.name)
  }

  @Get()
  async listar(@Query() paginacionQueryDto: FiltroModuloDto) {
    const result = await this.moduloService.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @Post()
  async crear(@Req() req, @Body() moduloDto: CrearModuloDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.moduloService.crear(moduloDto, usuarioAuditoria)
    return this.successCreate(result)
  }

  @Patch()
  async updateModulo(@Req() req, @Body() moduloDto: CrearModuloDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.moduloService.actualizar(
      moduloDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Delete()
  async deleteModulo(@Body() moduloDto: CrearModuloDto) {
    const result = await this.moduloService.eliminar(moduloDto)
    return this.successDelete(result)
  }

  // activar modulo
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/activacion')
  async activar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idUsuario } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.moduloService.activar(idUsuario, usuarioAuditoria)
    return this.successUpdate(result)
  }

  // inactivar modulo
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idUsuario } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.moduloService.inactivar(
      idUsuario,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
