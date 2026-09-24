# ShiftLink

ShiftLink es una plataforma SaaS B2B para gestionar la comunicación y el traspaso de información entre turnos de trabajo.

El objetivo del proyecto es evitar que incidencias, tareas pendientes y otra información importante se pierdan cuando un equipo termina su turno y comienza el siguiente.

La aplicación permite organizar empresas y locales, gestionar turnos y empleados, crear relevos estructurados, confirmar su recepción y mantener la continuidad de los asuntos que siguen pendientes.

## Problema que resuelve

En muchos negocios, los cambios de turno todavía dependen de herramientas poco estructuradas:

- Mensajes de WhatsApp
- Notas en papel
- Comunicación verbal
- Grupos informales
- Mensajes dispersos entre empleados

Esto puede provocar pérdida de información, tareas olvidadas y falta de trazabilidad.

ShiftLink centraliza ese proceso en una aplicación donde cada relevo queda asociado a un turno, un local y una empresa.

## Funcionalidades principales

Actualmente ShiftLink incluye:

- Registro e inicio de sesión de usuarios
- Autenticación stateless mediante JWT
- Contraseñas protegidas con BCrypt
- Gestión de empresas
- Arquitectura multiempresa mediante membresías
- Roles `OWNER`, `MANAGER` y `EMPLOYEE`
- Gestión de locales o centros de trabajo
- Creación y edición de turnos
- Ciclo de vida de turnos
- Asignación de empleados a turnos
- Creación de relevos entre turnos
- Edición de relevos mientras están en borrador
- Envío y confirmación de recepción de relevos
- Registro de incidencias y tareas pendientes
- Prioridades y estados para los pendientes
- Resolución de pendientes
- Continuidad de asuntos no resueltos entre turnos
- Dashboard de actividad
- Interfaz web responsive
- API REST protegida
- Migraciones de base de datos con Flyway
- Documentación interactiva con Swagger / OpenAPI
- Tests automatizados
- Integración continua con GitHub Actions

## Flujo principal

```text
Empleado asignado a un turno
          |
          v
Trabaja durante el turno
          |
          v
Registra incidencias o tareas
          |
          v
Crea el relevo
          |
          v
Selecciona el turno de destino
          |
          v
Envía el relevo
          |
          v
El siguiente turno lo recibe
          |
          v
Confirma la recepción
          |
          v
Resuelve los asuntos pendientes
          |
          v
Los asuntos no resueltos pueden
continuar en el siguiente relevo
```

## Stack tecnológico

### Frontend

- React
- TypeScript
- Vite
- CSS
- Fetch API
- Diseño responsive

### Backend

- Java 21
- Spring Boot
- Spring Web MVC
- Spring Security
- OAuth2 Resource Server
- JWT
- Spring Data JPA
- Hibernate
- Bean Validation
- Maven

### Base de datos

- PostgreSQL
- Flyway

### Infraestructura y herramientas

- Docker
- Docker Compose
- Git
- GitHub
- GitHub Actions
- Swagger
- OpenAPI

## Arquitectura

ShiftLink utiliza una arquitectura cliente-servidor.

```text
React + TypeScript
        |
        | HTTP / JSON
        v
Spring Boot REST API
        |
        +-- Controllers
        |
        +-- Services
        |
        +-- Repositories
        |
        +-- Spring Security
        |
        +-- JWT
        |
        v
PostgreSQL
```

El frontend no accede directamente a la base de datos. Toda la lógica de negocio y las reglas de autorización se gestionan desde el backend.

## Modelo multiempresa

ShiftLink permite que un usuario pueda pertenecer a diferentes empresas mediante membresías.

```text
User
 |
 v
Membership
 |
 +-- OWNER
 |
 +-- MANAGER
 |
 +-- EMPLOYEE
 |
 v
Company
 |
 v
Location
 |
 v
Shift
```

Los permisos dependen de la relación del usuario con cada empresa.

## Gestión de turnos

Los turnos disponen de un ciclo de vida controlado por el backend.

Estados disponibles:

```text
SCHEDULED
ACTIVE
COMPLETED
CANCELLED
```

Entre las reglas implementadas se encuentran:

- Solo los turnos programados pueden modificarse.
- Un turno debe tener una hora de finalización posterior a la de inicio.
- Los responsables pueden iniciar, completar o cancelar turnos.
- Los empleados pueden ser asignados a turnos concretos.
- Las asignaciones duplicadas están bloqueadas.

## Relevos

Un relevo conecta un turno de origen con un turno de destino.

Estados:

```text
DRAFT
SUBMITTED
ACKNOWLEDGED
```

El flujo permite:

```text
Turno origen
    |
    v
Borrador de relevo
    |
    v
Añadir incidencias y tareas
    |
    v
Enviar relevo
    |
    v
Turno destino
    |
    v
Confirmar recepción
```

Las reglas de negocio impiden, entre otras situaciones:

- Crear varios relevos para el mismo turno de origen.
- Utilizar el mismo turno como origen y destino.
- Modificar un relevo después de enviarlo.
- Enviar un relevo por parte de un usuario no autorizado.
- Confirmar un relevo sin estar asignado al turno receptor.
- Confirmar el propio relevo como receptor.

## Incidencias y tareas

Los elementos de un relevo pueden clasificarse como:

```text
INCIDENT
TASK
```

Prioridades:

```text
LOW
MEDIUM
HIGH
```

Estados:

```text
OPEN
RESOLVED
```

Los asuntos que continúan abiertos pueden trasladarse al siguiente relevo.

ShiftLink mantiene la relación entre el elemento original y su continuación para evitar duplicados y conservar la trazabilidad.

## Autenticación y seguridad

La aplicación utiliza autenticación mediante JWT Bearer Token.

Endpoints públicos principales:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/health
```

El resto de la API requiere autenticación.

```http
Authorization: Bearer <JWT>
```

La aplicación utiliza:

- BCrypt para almacenar contraseñas.
- JWT firmado mediante HMAC SHA-256.
- Spring Security.
- Sesiones stateless.
- Control de acceso por empresa y membresía.
- Comprobaciones adicionales de permisos en la capa de servicios.

## Base de datos y migraciones

El esquema de PostgreSQL se gestiona exclusivamente mediante Flyway.

Actualmente existen migraciones desde `V1` hasta `V10`.

Entre las principales entidades se encuentran:

```text
users
companies
memberships
locations
shifts
shift_assignments
handovers
handover_items
```

Flyway permite que una instalación nueva pueda construir automáticamente el esquema completo de la aplicación siguiendo el historial de migraciones.

## API REST

El backend expone una API REST para las principales áreas de la aplicación:

```text
Authentication
Companies
Memberships
Locations
Shifts
Shift Assignments
Handovers
Handover Items
```

La lógica está separada en controladores, servicios y repositorios para mantener las responsabilidades desacopladas.

## Swagger y OpenAPI

La API dispone de documentación interactiva mediante Springdoc OpenAPI.

Con el backend en ejecución:

```text
http://localhost:8080/swagger-ui/index.html
```

Especificación OpenAPI:

```text
http://localhost:8080/v3/api-docs
```

Swagger permite inspeccionar los endpoints disponibles, sus parámetros y respuestas, además de realizar peticiones autenticadas mediante JWT.

## Testing

El backend dispone de tests automatizados con JUnit y Mockito.

Actualmente la suite comprueba, entre otras reglas:

- Validaciones del ciclo de vida de los turnos.
- Restricciones al modificar turnos.
- Asignaciones duplicadas.
- Membresías inactivas.
- Permisos para asignar empleados.
- Creación de relevos.
- Envío de relevos.
- Confirmación de recepción.
- Restricciones de edición.
- Continuidad de pendientes.
- Prevención de duplicados al trasladar pendientes.

La suite actual ejecuta 24 tests correctamente.

Ejecutar los tests:

```bash
cd backend
./mvnw test
```

## Integración continua

El repositorio utiliza GitHub Actions.

Cada `push` o `pull request` sobre `main` ejecuta automáticamente dos procesos.

Backend:

```text
PostgreSQL 17
Java 21
Flyway
Maven
Tests
```

Frontend:

```text
Node.js 20
npm ci
ESLint
Vite build
```

De esta forma, cada cambio se comprueba automáticamente antes de considerarse válido.

Workflow:

```text
.github/workflows/ci.yml
```

## Ejecutar el proyecto en local

### Requisitos

- Java 21
- Node.js 20
- npm
- Docker
- Docker Compose
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/Geremias93/shiftlink.git
cd shiftlink
```

### 2. Crear las variables de entorno

```bash
cp .env.example .env
```

Generar un secreto JWT:

```bash
openssl rand -hex 32
```

Añadirlo al archivo `.env`:

```text
JWT_SECRET=valor_generado
```

### 3. Levantar PostgreSQL

Desde la raíz del proyecto:

```bash
docker compose up -d postgres
```

### 4. Arrancar el backend

```bash
cd backend

set -a
source ../.env
set +a

./mvnw spring-boot:run
```

El backend estará disponible en:

```text
http://localhost:8080
```

Comprobación:

```text
http://localhost:8080/api/health
```

### 5. Arrancar el frontend

En otra terminal:

```bash
cd frontend
npm ci
npm run dev
```

La aplicación web estará disponible en:

```text
http://localhost:5173
```

## Estructura del proyecto

```text
shiftlink/
|
+-- backend/
|   |
|   +-- src/main/java/
|   +-- src/main/resources/
|   |   +-- db/migration/
|   |
|   +-- src/test/
|
+-- frontend/
|   |
|   +-- src/components/
|   +-- src/services/
|   +-- src/types/
|   +-- src/utils/
|
+-- .github/
|   +-- workflows/
|       +-- ci.yml
|
+-- docker-compose.yml
+-- .env.example
+-- README.md
```

## Estado actual

ShiftLink dispone actualmente de un MVP Full Stack funcional con:

```text
Frontend React + TypeScript
        +
API REST Spring Boot
        +
Autenticación JWT
        +
PostgreSQL
        +
Flyway
        +
Roles y permisos
        +
Gestión de turnos
        +
Asignaciones
        +
Relevos
        +
Continuidad de pendientes
        +
Tests automatizados
        +
Swagger / OpenAPI
        +
GitHub Actions
```

El proyecto continúa evolucionando hacia una versión pública desplegada y preparada para demostraciones.

## Próximos pasos

Las siguientes mejoras previstas son:

- Despliegue público del frontend, backend y PostgreSQL.
- Identidad visual y logotipo definitivo de ShiftLink.
- Configuración completa como PWA.
- Navegación mediante rutas persistentes.
- Mejoras finales de experiencia de usuario y responsive.
- Capturas y material de presentación del producto.
- Archivos adjuntos y fotografías.
- Sistema de invitaciones.
- Funcionalidades adicionales para responsables.
- Evaluación futura de entrada de relevos mediante voz e inteligencia artificial.

Las funcionalidades relacionadas con inteligencia artificial se plantean como una ampliación futura y no forman parte del núcleo actual del MVP.

## Objetivo del proyecto

ShiftLink se desarrolla como un producto SaaS real y como proyecto Full Stack de portfolio.

El proyecto busca demostrar experiencia práctica en:

- Diseño de APIs REST.
- Arquitectura backend por capas.
- Desarrollo frontend con React y TypeScript.
- Seguridad con Spring Security y JWT.
- Modelado de bases de datos relacionales.
- Migraciones versionadas.
- Implementación de reglas de negocio.
- Testing automatizado.
- Docker.
- Integración continua.
- Git y GitHub.

## Autor

**Geremias93**

Software Developer

Java · Spring Boot · PostgreSQL · React · TypeScript · React Native

GitHub: https://github.com/Geremias93
