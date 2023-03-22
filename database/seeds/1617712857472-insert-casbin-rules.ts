import { CasbinRule } from 'src/core/authorization/entity/casbin.entity'
import { RolEnum } from 'src/core/authorization/rol.enum'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class insertCasbinRules1617712857472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      // FRONTEND
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/admin/usuarios',
        v2: 'read|update|create|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/admin/parametros',
        v2: 'read|update|create',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/admin/modulos',
        v2: 'read|update|create',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/admin/politicas',
        v2: 'create|read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/admin/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/admin/home',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/admin/usuarios',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/admin/parametros',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/admin/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/admin/home',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.USUARIO,
        v1: '/admin/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.USUARIO,
        v1: '/admin/home',
        v2: 'read',
        v3: 'frontend',
      },
      // BACKEND
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/autorizacion/politicas',
        v2: 'GET|POST|DELETE|PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/autorizacion/modulos',
        v2: 'GET|POST|DELETE|PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/autorizacion/modulos/:id/activacion',
        v2: 'GET|POST|DELETE|PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/autorizacion/modulos/:id/inactivacion',
        v2: 'GET|POST|DELETE|PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/autorizacion/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/:id',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/cuenta/ciudadania',
        v2: 'POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/:id/activacion',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/:id/inactivacion',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/:id/restauracion',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/:id/reenviar',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/parametros',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/parametros/:id',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/parametros/:id/activacion',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/parametros/:id/inactivacion',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/autorizacion/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/autorizacion/modulos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/usuarios',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/parametros',
        v2: 'GET|POST',
        v3: 'backend',
      },
      // TODOS
      {
        v0: RolEnum.TODOS,
        v1: '/api/parametros/:grupo/listado',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TODOS,
        v1: '/api/autorizacion/permisos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TODOS,
        v1: '/api/usuarios/cuenta/perfil',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TODOS,
        v1: '/api/usuarios/cuenta/contrasena',
        v2: 'PATCH',
        v3: 'backend',
      },
    ]
    const casbinList = items.map((item) => {
      return new CasbinRule({
        ptype: 'p',
        v0: item.v0,
        v1: item.v1,
        v2: item.v2,
        v3: item.v3,
      })
    })
    await queryRunner.manager.save(casbinList)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
