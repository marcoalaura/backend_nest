import { BaseService } from '../../../common/base/base-service'
import { Inject, Injectable } from '@nestjs/common'
import { RolRepository } from '../repository/rol.repository'

@Injectable()
export class RolService extends BaseService {
  constructor(
    @Inject(RolRepository)
    private rolRepositorio: RolRepository
  ) {
    super(RolService.name)
  }

  async listar() {
    return await this.rolRepositorio.listar()
  }
}
