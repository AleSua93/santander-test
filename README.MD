# Birras - Challenge Santander Tecnología

Este proyecto consiste en una aplicación que permite:
- Como usuario:
  - Visualizar un listado de próximas meetups, con fecha y temperatura en C° estimada
- Como administrador:
  - Loguearse como administrador y visualizar, además de lo anterior, un pronóstico de temperatura para los próximos
    16 días
  - Crear meetups, especificando nombre, fecha, y cantidad estimada de personas.
  - Obtener, si es posible, una cantidad estimada de cajas de birra necesarias para aprovisionar la meetup.

# Detalles técnicos del proyecto

- El mismo consta de un frontend web y un backend.
- El frontend está desarrollado con React + Typescript, y la UI es apta para dispositivos mobiles (responsive)
- El backend está hecho en Express + Typescript
- La permanencia se logró a través de una base de datos de SQLite
- La autenticación y autorización se lograron utilizando JWT

# Instrucciones para correr el frontend

Todo esto debe realizarse dentro del directorio `frontend/`.

- Copiar el archivo `.env-example`, renombrar la copia a `.env`, y completar con las variables de entorno.correspondientes. Por ejemplo, para correr el proyecto localmente con los valores por default, utilizar `http://localhost:5000/api` como URL base de la API.
- Correr el comando `yarn install` en consola para instalar las dependencias del frontend.
- Correr el comando `yarn start` en consola para correr el proyecto localmente. Por defecto, el server local de frontend esta en `http://localhost:3000`.

# Instrucciones para correr el backend

Todo esto debe realizarse dentro del directorio `backend/`.

- Copiar el archivo `.env-example`, renombrar la copia a `.env`, y completar con las variables de entorno .correspondientes.
- Correr el comando `yarn install` en consola para instalar las dependencias del backend.
- Correr el comando `yarn start` en consola para correr el proyecto localmente. Por defecto, el server local de backend esta en `http://localhost:5000`.
- Para correr las migraciones de la base de datos utilizar el comando `npx sequelize db:migrate`.
- Para seedear la db utilizar el comando `npx sequelize db:seed:all`.