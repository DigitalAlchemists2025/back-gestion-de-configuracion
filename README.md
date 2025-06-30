# Gestión de la Configuración de Componentes – Backend

## Descripción
Backend para la Gestión de la Configuración de Componentes.
Permite crear, editar, asociar y visualizar componentes, subcomponentes y sus características.
Incluye control de acceso por roles (Administrador y Usuario), manejo jerárquico de componentes y registro completo de historial de acciones.

## Funcionalidades principales

Gestión de componentes: Crear, editar, asociar, desasociar, retirar y eliminar componentes (ej: Edificios, Salas, Equipos, etc.).

Asociación jerárquica: Permite asociar subcomponentes a componentes padres, validando restricciones de la jerarquía.

Edición de características: Modificar datos como nombre, tipo, estado y descripciones.

Control de acceso: Basado en roles (Administrador puede modificar, Usuario solo consulta).

Historial de acciones: Registro cronológico y detallado de todas las modificaciones y asociaciones realizadas.

Documentación Swagger: Interfaz de prueba y exploración en /api/docs.

## Instalación

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

# ejecutar base de datos e iniciar el servidor
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

## Tecnologías utilizadas
- NestJS
- MongoDB (Mongoose)
- TypeScript
- JWT para autenticación
- Swagger para documentación interactiva
