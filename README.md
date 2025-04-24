# sis257_FASHION

## Descripción del proyecto

**FASHION** es una tienda moderna online de moda que ofrece ropa tanto para hombres como para mujeres con estilo. Nuestra plataforma combina un diseño atractivo y fácil de usar con tecnología avanzada, permitiendo a los clientes descubrir las últimas tendencias, filtrar productos por categorías y tallas, y realizar compras seguras con solo unos clics. 

Detrás de escena, contamos con un sistema robusto que gestiona inventarios, procesa pedidos y protege los datos de los usuarios mediante autenticación segura.

## Entidades y campos

### 1. Cliente
- `id`: identificador único del usuario
- `nombre`: nombres del usuario
- `apellido`: apellidos del usuario
- `email`: correo electrónico
- `telefono`: número de contacto
- `activo`: estado del cliente

### 2. Producto
- `id`: identificador del producto
- `nombre`: nombre del producto
- `descripcion`: descripción del producto
- `precio`: precio en Bs
- `stock`: cantidad disponible
- `activo`: estado del producto

### 3. Venta
- `id`: identificador de la venta
- `cliente_id`: identificador del cliente
- `producto_id`: identificador del producto
- `cantidad`: cantidad de producto
- `total`: monto total
- `fecha`: fecha de la venta

## Configuración del proyecto

```bash
# Instalación de dependencias
$ npm install

# Desarrollo
$ npm run start

# Modo observador
$ npm run start:dev

# Producción
$ npm run start:prod
```

## Pruebas

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Licencia

Este proyecto está bajo la licencia MIT.
