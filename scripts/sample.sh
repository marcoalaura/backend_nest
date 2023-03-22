#!/usr/bin/bash

# En caso de que algún comando falle (exit = 1) finalizará la ejecución del script y mostrará el siguiente mensaje:
set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

# Definición de variables
arg1=${1:-pg14}

dockerContainer="${arg1}"

# TODO - Aquí definimos las tareas
echo "Reiniciando instancia de docker [$dockerContainer]"
docker restart $dockerContainer

# esperando contenedor
echo "Esperando a que la instancia de docker [$dockerContainer] se inicie correctamente";
sleep 3;

# Mensaje final
echo -e "\n - Tarea completada exitosamente :)\n"
