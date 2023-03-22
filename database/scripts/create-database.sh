#!/usr/bin/bash

set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

arg1=${1:-pg14}
arg2=${2:-database_db}

arg3=${3:-localhost}
arg4=${4:-5432}
arg5=${5:-postgres}
arg6=${6:-postgres}

dockerContainer="${arg1}"

dbname="${arg2}"
dbhost="${arg3}"
dbport="${arg4}"
dbuser="${arg5}"
dbpass="${arg6}"

# [INI] SQL
echo -e "\n\n >>> Creando Base de datos $dbname ($dbhost:$dbport)...\n"

docker restart $dockerContainer

echo -e "\nReiniciando el contenedor $dockerContainer...\n";
sleep 2;

docker exec $dockerContainer psql -h $dbhost -p $dbport -U postgres -c "DROP DATABASE IF EXISTS $dbname"
docker exec $dockerContainer psql -h $dbhost -p $dbport -U postgres -c "CREATE DATABASE $dbname ENCODING 'UTF-8'"

docker exec $dockerContainer psql -h $dbhost -p $dbport -U postgres -d $dbname -c "CREATE SCHEMA proyecto AUTHORIZATION $dbuser"
docker exec $dockerContainer psql -h $dbhost -p $dbport -U postgres -d $dbname -c "CREATE SCHEMA usuarios AUTHORIZATION $dbuser"
docker exec $dockerContainer psql -h $dbhost -p $dbport -U postgres -d $dbname -c "CREATE SCHEMA parametricas AUTHORIZATION $dbuser"

echo -e "\n - [éxito] $dbname ($dbhost)"
# [END] SQL

echo -e "\n\n >>> ¡Base de datos creada con éxito! :)\n"
