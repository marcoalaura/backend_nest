import { Controller, Get, UseGuards } from '@nestjs/common'
import { RolService } from '../service/rol.service'
import { BaseController } from '../../../common/base/base-controller'
import { CasbinGuard } from '../guards/casbin.guard'
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('autorizacion/roles')
export class RolController extends BaseController {
  constructor(private rolService: RolService) {
    super(RolController.name)
  }

  @Get()
  async listar() {
    const result = await this.rolService.listar()
    return this.successList(result)
  }
}
