# Backend Base - NestJS

<p>
  <a href="./">
    <img src="https://img.shields.io/badge/version-v1.5.0-blue" alt="Versión">
  </a>
  <a href="./LICENSE">
      <img src="https://img.shields.io/static/v1?label=license&message=LPG%20-%20Bolivia&color=green" alt="Licencia: LPG - Bolivia" />
  </a>
</p>

## Recomendaciones

Para usar este proyecto como base de un nuevo proyecto, debe seguir los siguientes pasos:

- Crear nuevo proyecto en [Gitlab](https://<SITIO>/projects/new) y clonarlo en local
- Añadir este proyecto como otro origen, ejecutar dentro del nuevo proyecto:

```
git remote add origin2 git@<SITIO>/backend.git
```

- Descargar los commits desde el 2.º origen, ejecutar

```
git pull origin2 master --allow-unrelated-histories
```

## Tecnologías

- [NestJS](https://nestjs.com/)
- [Jest](https://jestjs.io/)
- [Passport.js](http://www.passportjs.org/)
- [OpenApi](https://www.openapis.org/)
- [TypeORM](https://typeorm.io/)
- [PinoJs](https://getpino.io/#/)
- [Casbin](https://casbin.org/)
- [Postgresql](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

## Funcionalidades

- Autenticación JWT
- Autenticación con Ciudadanía Digital
- Refresh Token
- Autorización (Roles, Módulos, Usuarios, Permisos)
- Paramétricas
- Clientes para Interoperabilidad (SEGIP, SIN)
- Cliente para Mensajería Electrónica
- Proveedores de:
    - Logger
    - Reportes
    - Manejo de errores

## Documentación

Documentación relacionada con el proyecto:

1. [Instalación y Configuración](INSTALL.md)
2. [Arquitectura](/docs/arquitectura.md)
3. [Documentacion de APIS](/docs/openapi.yaml)
4. [Documentacion de Permisos](/docs/permisos.md)

## Comandos útiles

1. Ejecución de contenedor con instancia postgres
   Para ejecutar este comando se debe tener instalado docker y configurar en el archivo `scripts/database.sh` los datos
   de conexión a la base de datos de la cual se quiere generar el diagrama:

   > Para instalar docker: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

   ```bash
   $ npm run start:database
   ```

2. Generación del diagrama ERD (deshabilitado hasta tener soporte para TypeOrm 0.3)

   [//]: # 'TODO: Actualizar soporte TypeOrm 0.3 para generar diagramas'

   ```bash
   $ npm run db:diagram
   ```

3. Generación de documentación

   ```bash
   $ npm run compodoc
   ```

## Changelog

1. Generar tag de la versión

   > Cambiar el número de versión en archivo `package.json`

2. Generar tag y archivo CHANGELOG

    ```bash
    npm run release
    ```

3. Guardar los tags generados

    ```bash
    git push --follow-tags origin master
    ```

## Colaboradores

- mlaura

## Licencia

[LGP-Bolivia](LICENSE).

## Información de contacto

- mlaura
