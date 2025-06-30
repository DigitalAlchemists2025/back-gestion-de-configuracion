# Gestión de la Configuración de Componentes – Backend

## Descripción
Backend para la Gestión de la Configuración de Componentes.
Permite crear, editar, asociar y visualizar componentes, subcomponentes y sus características.
Incluye control de acceso por roles (Administrador y Usuario), manejo jerárquico de componentes y registro completo de historial de acciones.

## Funcionalidades principales
- Gestión de componentes: Crear, editar, asociar, desasociar, retirar y eliminar componentes (ej: Edificios, Salas, Equipos, etc.).

- Asociación jerárquica: Permite asociar subcomponentes a componentes padres, validando restricciones de la jerarquía.

- Edición de características: Modificar datos como nombre, tipo, estado y descripciones.

- Control de acceso: Basado en roles (Administrador puede modificar, Usuario solo consulta).

- Historial de acciones: Registro cronológico y detallado de todas las modificaciones y asociaciones realizadas.

- Documentación Swagger: Interfaz de prueba y exploración en /api/docs.

## Instalación Mongo DB local

Descargar MongoDB Community Edition:
https://www.mongodb.com/try/download/community

Seleccionar sistema operativo (Windows, macOS o Linux).

Descargar el instalador y seguir las instrucciones, recomendado marcar la opción para instalar Mongo DB como servicio.

Configurar la conexión en backend
En el archivo .env usar:
DB_URI=mongodb://localhost:27017/nombre-base-de-datos

## Instalación Repositorio

```bash
# clonar repositorio
git clone https://github.com/DigitalAlchemists2025/back-gestion-de-configuracion

# instalar dependencias
npm install

# configurar variables de entorno .env (Modificar los valores según configuración local o del servidor.)
DB_URI=
JWT_SECRET=
EXPIRES_IN=
APP_URL=
FRONT_URL=
FRONT_MOVIL_URL=
PORT=

# iniciar el servidor
$ npm run start:dev
```

## Uso y documentación de la API

Se accede a la documentación Swagger en:
http://localhost:3000/api/docs

Se pueden probar los endpoints, ver los modelos y cargar tokens Bearer para autenticación.

## Control de acceso por roles
### Administrador:
Puede visualizar, crear, editar, asociar, desasociar, retirar y eliminar componentes.
Ver historial de componentes.
Gestionar usuarios.

### Usuario:
Solo puede visualizar componentes y jerarquía.

## Estructura principal
src/auth/: Módulo de login, control de acceso y manejo de roles.
src/components/: Módulo para crear, editar y asociar componentes y subcomponentes.
src/histories/: Registra todos los cambios en el sistema.
src/users/: Gestión de usuarios del sistema.
src/descriptions/: Manejo de los atributos genéricos de los componentes.
src/common/: Recursos.

## Tecnologías utilizadas
- NestJS.
- MongoDB (Mongoose).
- TypeScript.
- JWT para autenticación.
- Swagger para documentación interactiva.
