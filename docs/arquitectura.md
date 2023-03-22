# Proyecto base Backend

## Estructura de directorios

```
.
├─docs                          # directorio con la documentacion del proyecto
├─scripts                       # directorio con scripts
├─src
|  ├── application              # directorio con logica de negocio de la aplicacion
|  |    ├── modulo1
|  |    |   ├── controller      # directorio con controladores
|  |    |   ├── entity          # directorio con entidades
|  |    |   ├── repository      # directorio con repositorios
|  |    |   └── service         # directorio con servicios
|  |    ├── ...
|  |    └── moduloN
|  ├── common                   # directorio con modulos comunes (utilitarios, contantes, etc)
|  |    ├── constants
|  |    ├── dto
|  |    ├── exceptions
|  |    ├── filters
|  |    ├── interceptors
|  |    ├── helpers
|  |    ├── lib
|  |    ├── middlewares
|  |    ├── params
|  |    ├── templates
|  |    ├── validation
|  |    └── serializers
|  ├── core                     # directorio con modulos del nucleo del proyecto base
|  |    ├── authentication      # Modulo de autenticacion
|  |    ├── authorization       # Modulo de autorizacion
|  |    ├── usuario             # Modulo de usuarios
|  |    ├── logs                # Logs
|  |    ├── config              # Modulo de configuraciones base
|  |    |    ├── authorization
|  |    |    └── database
|  |    └── external-services   # Modulo de servicios externos
|  |    |    ├── iop
|  |    |    └── mensajeria
|  ├── templates
|  ├── app.controller.ts
|  ├── app.module.ts        # Modulo principal de composicion de otros modulos
|  └── main.ts              # Archivo principal de aplicacion
├──test                     # Directorio con test de integracion
├──.Dockerignore
├──.env.example             # Archivo con variables de entorno
├──.eslintrc.js
├──.gitignore
├──.gitlab-ci.yml
├──.prettierc
├──Dockerfile
├──LICENSE
├──nest-cli.json
├──ormconfig-default.ts
├──package-lock.json
├──package.json
├──INSTALL.md               # Archivo con instrucciones de instalación
├──README.md                # Archivo con informacion del proyecto
├──UPDATE.md                # Archivo para instrucciones de actualización
├──tsconfig.build.json
└──tsconfig.json

```

## Diagrama ERD

![Diagrama ERD](ERD.png 'Diagrama')

## Estructura Modular

El proyecto base contiene una estructura modular, a continuación se puede ver la composición de los más importantes:

### Módulo Nucleo

![Modulo Nucleo](imagenes/modulo-nucleo.png 'Diagrama')

### Módulo Autenticación

![Modulo Autenticacion](imagenes/modulo-autenticacion.png 'Diagrama')

### Módulo Autorización

![Modulo Autorizacion](imagenes/modulo-autorizacion.png 'Diagrama')

### Módulo Usuario

![Modulo Usuario](imagenes/modulo-usuario.png 'Diagrama')

### Módulo Servicios Externos

![Modulo Servicios Externos](imagenes/modulo-external.png 'Diagrama')
