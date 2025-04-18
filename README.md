# sis257_FASHION

## Descripción del proyecto

**FASHION** es una tienda moderna online de moda que ofrece ropa tanto para hombres como para mujeres con estilo. Nuestra plataforma combina un diseño atractivo y fácil de usar con tecnología avanzada, permitiendo a los clientes descubrir las últimas tendencias, filtrar productos por categorías y tallas, y realizar compras seguras con solo unos clics. 

Detrás de escena, contamos con un sistema robusto que gestiona inventarios, procesa pedidos y protege los datos de los usuarios mediante autenticación segura.

## Entidades y campos tentativos

### 1. Cliente
- `id`: identificador único del usuario
- `nombre`: nombres del usuario
- `apellido`: apellidos del usuario
- `email`: correo electrónico
- `celular`: número de contacto
- `dirección`: domicilio del usuario

### 2. Producto
- `id`: identificador del producto
- `nombre`: nombre del producto
- `categoría`: tipo de prenda (lencería, deportiva, casual, etc.)
- `descripcion`: descriopcion del producto
- `talla`: S, M, L, XL...
- `precio`: precio en Bs

### 3. venta
- `cantidad`: cantidad de producto
- `fecha venta`: fecha de venta del producto
- `fecha`: fecha del pedido
- `total`: monto total

  