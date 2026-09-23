# ShiftLink

ShiftLink es una plataforma SaaS B2B diseñada para mejorar la comunicación y el relevo de información entre turnos de trabajo.

El objetivo es sencillo: **que la información importante no se pierda cuando un empleado termina su turno**.

Los empleados podrán dejar relevos estructurados, registrar incidencias y tareas pendientes, mientras que el siguiente turno podrá consultar esa información y confirmar que se hace cargo de ella.

##  Problema que resuelve

En muchos pequeños y medianos negocios, los cambios de turno todavía se gestionan mediante:

- Mensajes de WhatsApp
- Notas en papel
- Comunicación verbal
- Grupos informales de trabajo

Esto puede provocar que incidencias, tareas o información importante se pierdan entre un turno y otro.

ShiftLink busca convertir esa información en un sistema **estructurado, trazable y accesible**.

##  Flujo principal

```text
Empleado inicia turno
        ↓
Trabaja durante el día
        ↓
Registra incidencias y tareas
        ↓
Finaliza turno
        ↓
Crea un relevo
        ↓
El siguiente empleado lo recibe
        ↓
Confirma lectura y asume pendientes
        ↓
Los asuntos no resueltos continúan abiertos
```

##  Arquitectura actual

```text
Cliente
   │
   │ REST API
   ▼
Spring Boot
   │
   ├── Controllers
   ├── Services
   ├── Spring Security
   ├── JWT
   └── Spring Data JPA
           │
           ▼
       PostgreSQL
```

##  Tecnologías

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

### Infraestructura

- Docker
- Docker Compose
- Git
- GitHub

### Frontend previsto

- React
- TypeScript
- Vite
- Diseño responsive
- PWA

##  Funcionalidades implementadas

Actualmente ShiftLink dispone de:

- API REST con Spring Boot
- PostgreSQL mediante Docker
- Migraciones versionadas con Flyway
- Registro de usuarios
- Contraseñas protegidas con BCrypt
- Login de usuarios
- Generación de JWT
- Validación de JWT
- Autenticación stateless
- Endpoints protegidos
- Creación de empresas
- Sistema de membresías
- Roles `OWNER`, `MANAGER` y `EMPLOYEE`
- Asignación automática del creador de una empresa como `OWNER`
- Validación de peticiones
- Gestión global de errores de API

##  Modelo multiempresa

ShiftLink utiliza un sistema de membresías:

```text
Usuario
   │
   ▼
Membresía
   │
   ├── OWNER
   ├── MANAGER
   └── EMPLOYEE
   │
   ▼
Empresa
```

Esto permite que un usuario pueda pertenecer a varias empresas y tener diferentes permisos en cada una.

## 🔐 Autenticación

ShiftLink utiliza autenticación mediante **JWT Bearer Token**.

Endpoints públicos:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/health
```

El resto de endpoints protegidos requieren:

```http
Authorization: Bearer <JWT>
```

Por ejemplo:

```text
GET  /api/companies
POST /api/companies
```

Sin un JWT válido, la API devuelve:

```text
401 Unauthorized
```

## 🗄️ Base de datos

Los cambios de esquema se gestionan mediante Flyway.

Migraciones actuales:

```text
V1__create_companies_table.sql
V2__create_users_table.sql
V3__create_memberships_table.sql
```

Modelo actual:

```text
users
   │
   │
   ▼
memberships
   │
   ▼
companies
```

##  Ejecutar el proyecto en local

### Requisitos

- Java 21
- Docker
- Docker Compose
- Git

Clonar el repositorio:

```bash
git clone https://github.com/Geremias93/shiftlink.git
cd shiftlink
```

Crear el archivo local de variables de entorno:

```bash
cp .env.example .env
```

Generar un secreto JWT seguro:

```bash
openssl rand -hex 32
```

Añadir el valor generado a `.env`:

```text
JWT_SECRET=tu_clave_generada
```

Levantar PostgreSQL:

```bash
docker compose up -d postgres
```

Arrancar el backend:

```bash
cd backend

set -a
source ../.env
set +a

./mvnw spring-boot:run
```

La API estará disponible en:

```text
http://localhost:8080
```

Comprobación de estado:

```text
GET http://localhost:8080/api/health
```

##  Próximos pasos

El proyecto continúa en desarrollo. Las siguientes funcionalidades previstas son:

- Autorización limitada a las empresas del usuario
- Invitaciones de empleados
- Gestión de locales o sucursales
- Gestión de turnos
- Relevos entre empleados
- Incidencias
- Tareas
- Confirmaciones de lectura
- Fotografías y archivos adjuntos
- Dashboard para responsables
- Frontend con React + TypeScript
- PWA
- Acceso mediante códigos QR
- Tests con JUnit y Mockito
- Swagger / OpenAPI
- CI/CD con GitHub Actions
- Despliegue en producción

##  Objetivo del proyecto

ShiftLink está siendo desarrollado como un producto SaaS real y, al mismo tiempo, como un proyecto Full Stack para aplicar buenas prácticas de desarrollo de software:

- Arquitectura por capas
- API REST
- Seguridad
- Autenticación JWT
- Persistencia SQL
- Migraciones
- Docker
- Control de versiones
- Testing
- CI/CD

##  Autor

**Geremias93**

Software Developer

Java · Spring Boot · PostgreSQL · React · React Native
