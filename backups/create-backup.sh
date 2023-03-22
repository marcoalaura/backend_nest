#!/usr/bin/bash

set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

arg1=${1:-pg14}
arg2=${2:-database_db}
arg3=${3:-database_db.gz}

arg4=${4:-localhost}
arg5=${5:-5432}
arg6=${6:-postgres}
arg7=${7:-postgres}

dockerContainer="${arg1}"

dbname="${arg2}"
dbhost="${arg4}"
dbport="${arg5}"
dbuser="${arg6}"
dbpass="${arg7}"
dbfile="${arg3}"

echo -e "\n >>> Creando SQL backup desde $dbname ($dbhost:$dbport) al archivo $dbfile.."

docker exec -it $dockerContainer pg_dump -h $dbhost -p $dbport -U $dbuser $dbname | gzip > $dbfile

echo -e "\n >>> ¡Backup creado con éxito! :)\n"
