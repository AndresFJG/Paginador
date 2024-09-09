This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


Creación base de datos:
# Employee Management System

Este proyecto es un sistema de gestión de empleados utilizando Node.js, Sequelize y PostgreSQL. A continuación, se detallan los comandos SQL necesarios para crear la base de datos y las tablas requeridas.

## Requisitos

- PostgreSQL instalado en tu máquina.
- Un usuario y contraseña para la base de datos.
- Configuración correcta de las variables de entorno para conectar tu aplicación con PostgreSQL.

## Comandos SQL para crear la base de datos

### Crear la base de datos

Primero, necesitas crear la base de datos. Puedes hacerlo ejecutando el siguiente comando en la consola de PostgreSQL o cualquier cliente de base de datos (pgAdmin, DBeaver, etc.).

```sql
CREATE DATABASE gestion_empleados;

Conexión a la base de datos:
\c gestion_empleados;

Tablas necesarias:
CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    documento VARCHAR(50) NOT NULL,
    centro_trabajo VARCHAR(100) NOT NULL,
    registro BOOLEAN NOT NULL DEFAULT FALSE,
    estado VARCHAR(50) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    fecha_retiro DATE,
    cargo VARCHAR(50) NOT NULL,
    novedades TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_empleado VARCHAR(50)
);

CREATE TABLE departamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE estados_empleado (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE cargos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE centros_trabajo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE tipo_documento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

Agregar indices:
CREATE INDEX idx_empleado_documento ON employees(documento);
CREATE INDEX idx_empleado_nombre ON employees(nombre);
CREATE INDEX idx_empleado_centro_trabajo ON employees(centro_trabajo);