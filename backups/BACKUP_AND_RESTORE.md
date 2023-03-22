# Copias de seguridad y restauración de bases de datos

Ejemplo si la base de datos es `database_db`.

## Creando backup (de forma automática con docker)

```bash
# Ejemplo: bash create-backup.sh <dockerContainer> <dbname> <dbfile>
bash create-backup.sh pg14 database_db database_db.gz
```

## Restaurando backup (de forma automática con docker)

```bash
# Ejemplo: bash restore-backup.sh <dockerContainer> <dbname> <dbfile>
bash restore-backup.sh pg14 database_db database_db.gz
```

## Creando backup (manualmente)

```bash
# Backup
pg_dump -h localhost -p 5432 -U postgres database_db | gzip > database_db.gz
```

## Restaurando backup (manualmente)

Antes que nada debemos crear la nueva base de datos:

```sql
-- eliminamos la base actual (si existe)
DROP DATABASE IF EXISTS database_db;

-- creamos la nueva base
CREATE DATABASE database_db ENCODING 'UTF-8';
```

Ahora si procedemos a restaurar la base

```bash
# Restore
zcat database_db.gz | psql -h localhost -U postgres -W database_db
```
