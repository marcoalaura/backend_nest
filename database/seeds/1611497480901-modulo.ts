import {
  Modulo,
  Propiedades,
} from '../../src/core/authorization/entity/modulo.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class modulo1611497480901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      // MENU SESSION PRINCIPAL
      {
        // id: '1',
        nombre: 'Principal',
        url: '/principal',
        label: 'Principal',
        propiedades: {
          icono: 'home',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
        },
      },
      {
        // id: '2',
        nombre: 'inicio',
        url: '/admin/home',
        label: 'Inicio',
        propiedades: {
          icono: 'home',
          descripcion: 'Vista de bienvenida con características del sistema',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
        },
        fidModulo: '1',
      },
      {
        // id: '3',
        nombre: 'perfil',
        url: '/admin/perfil',
        label: 'Perfil',
        propiedades: {
          icono: 'person',
          descripcion: 'Información del perfil de usuario que inicio sesión',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
        },
        fidModulo: '1',
      },

      // MENU SECCION CONFIGURACIONES
      {
        // id: '4',
        nombre: 'configuraciones',
        url: '/configuraciones',
        label: 'Configuración',
        propiedades: {
          icono: 'settings',
          color_light: '#3F1929',
          color_dark: '#AE6DAB',
        },
      },
      {
        // id: '5',
        nombre: 'usuarios',
        url: '/admin/usuarios',
        label: 'Usuarios',
        propiedades: {
          icono: 'manage_accounts',
          descripcion: 'Control de usuarios del sistema',
          color_light: '#3F1929',
          color_dark: '#AE6DAB',
        },
        fidModulo: '4',
      },
      {
        // id: '6',
        nombre: 'parametros',
        url: '/admin/parametros',
        label: 'Parámetros',
        propiedades: {
          icono: 'tune',
          descripcion: 'Parámetros generales del sistema',
          color_light: '#312403',
          color_dark: '#B77346',
        },
        fidModulo: '4',
      },
      {
        // id: '7',
        nombre: 'modulos',
        url: '/admin/modulos',
        label: 'Módulos',
        propiedades: {
          icono: 'list',
          descripcion: 'Gestión de módulos',
          color_light: '#312403',
          color_dark: '#B77346',
        },
        fidModulo: '4',
      },
      {
        // id: '8',
        nombre: 'politicas',
        url: '/admin/politicas',
        label: 'Políticas',
        propiedades: {
          icono: 'verified_user',
          descripcion: 'Control de permisos para los usuarios',
          color_light: '#B4AA99',
          color_dark: '#B4AA99',
        },
        fidModulo: '4',
      },
    ]
    const modulos = items.map((item) => {
      const propiedades: Propiedades = {
        color_dark: item.propiedades.color_dark,
        color_light: item.propiedades.color_light,
        icono: item.propiedades.icono,
        descripcion: item.propiedades.descripcion,
      }
      return new Modulo({
        nombre: item.nombre,
        url: item.url,
        label: item.label,
        idModulo: item.fidModulo,
        propiedades: propiedades,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: '1',
        fechaCreacion: new Date(),
      })
    })
    await queryRunner.manager.save(modulos)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
