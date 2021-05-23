# Birras - Challenge Santander Tecnología

Este proyecto consiste en una aplicación que permite:
- Como usuario:
  - Visualizar un listado de próximas meetups, con fecha y temperatura en C° estimada
  - Suscribirse/desuscribirse a futuras meetups
  - Hacer check-in/check-out de meetups pasadas

- Como administrador:
  - Todo lo descrito anteriormente para usuarios normales
  - Visualizer un pronóstico de temperatura para los próximos 16 días
  - Crear meetups, especificando nombre, fecha, y cantidad estimada de personas.
  - Obtener, si es posible, una cantidad estimada de cajas de birra necesarias para aprovisionar la meetup.

# Detalles técnicos del proyecto

- La app consiste en un frontend web y un server de backend.
- El frontend está desarrollado con React + Typescript, con una UI apta para dispositivos mobiles (responsive).
- El server está hecho con Express + Typescript.
- Para los pronósticos del clima se utilizó la [API de Weatherbit](https://www.weatherbit.io/). Los mismos se cachean en un archivo _.json_ dentro del server mismo. El refresh de este cache se hace de forma manual en el panel de admin.
- La permanencia se logró a través de una base de datos de SQLite, a través del ORM [sequelize](https://sequelize.org/).
- La autenticación y autorización se lograron utilizando JWT (en el backend se implementaron los endpoints y la lógica para usar tokens de acceso y de refresh; por cuestiones de tiempo en el frontend solo se implementó el uso de tokens de acceso)
- La API se autodocumenta utilizando SwaggerUI. Corriendo el server localmente, se puede acceder a los docs en `http://localhost:5000/api/docs`.

# Instrucciones para correr el frontend

Todo esto debe realizarse dentro del directorio `frontend/`.

- Copiar el archivo `.env-example`, renombrar la copia a `.env`, y completar con las variables de entorno.correspondientes. Por ejemplo, para correr el proyecto localmente con los valores por default, utilizar `http://localhost:5000/api` como URL base de la API.
- Ejecutar el comando `yarn install` en consola para instalar las dependencias del frontend.
- Ejecutar el comando `yarn start` en consola para correr el proyecto localmente. Por defecto, el server local de frontend esta en `http://localhost:3000`.

# Instrucciones para correr el backend

Todo esto debe realizarse dentro del directorio `backend/`.

- Copiar el archivo `.env-example`, renombrar la copia a `.env`, y completar con las variables de entorno correspondientes.
- Ejecutar el comando `yarn install` en consola para instalar las dependencias del backend.
- Ejecutar el comando `yarn start` en consola para correr el proyecto localmente. Por defecto, el server local de backend esta en `http://localhost:5000`.
- Para correr las migraciones de la base de datos utilizar el comando `npx sequelize db:migrate`.
- Para seedear la db utilizar el comando `npx sequelize db:seed:all`. Es indispensable seedear la db, ya que de esta forma se generan los dos usuarios de la app.

# Utilizando la app

Dado que no hay un CRUD de usuarios implementado, los dos usuarios disponibles se crean al seedear la db. Las credenciales de cada uno son:
- Admin:
  - **email**: admin@admin.com
  - **password**: password
- User:
  - **email**: user@user.com
  - **password**: password

# Más detalles

## DB schema

![](./misc/santander-db-schema.png)

## API endpoints

![](./misc/api-endpoints.png)

## Cosas que quedaron pendientes/para mejorar