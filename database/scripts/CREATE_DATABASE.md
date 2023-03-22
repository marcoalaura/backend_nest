# Crear base de datos

Ejemplo si la base de datos es `database_db`.

## Prerequisitos:

- Para entornos de desarrollo (con docker)

  ```bash
  # Crea una instancia de postgres
  docker run --name pg14 -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres:14.2
  ```

- Para entornos de producción

  Se recomienda instalar PostgreSQL sin docker. Ver [PostgreSQL Downloads](https://www.postgresql.org/download/)

## Creando base de datos (de forma automática con docker)

- `host: localhost`
- `port: 5432`
- `user: postgres`
- `pass: postgres`

Desde la carpeta: `~/backend/database/scripts` ejecuta el siguiente comando:

```bash
# Ejemplo: bash create-database.sh <dockerContainer> <dbname>
bash create-database.sh pg14 database_db
```

## Creando base de datos (manualmente)

```bash
# nos conectamos a la consola de postgres
psql -U postgres
```

```sql
-- eliminamos la base actual (si existe)
DROP DATABASE IF EXISTS database_db;

-- creamos la nueva base
CREATE DATABASE database_db ENCODING 'UTF-8';
```

```sql
-- nos conectamos a la nueva base
\c database_db
```

```sql
-- creamos los esquemas correspondientes
CREATE SCHEMA proyecto AUTHORIZATION postgres;
CREATE SCHEMA usuarios AUTHORIZATION postgres;
CREATE SCHEMA parametricas AUTHORIZATION postgres;
```

```sql
-- salimos del editor psql
\q
```
