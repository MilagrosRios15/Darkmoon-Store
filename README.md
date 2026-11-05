# DarkMoon Store

Tienda online de Halloween (disfraces, decoración, accesorios y maquillaje) desarrollada como trabajo académico. Es una adaptación de la consigna "Mini-App de un kiosco de barrio" a una temática de Halloween.

> **Estado actual: Parte 1 (frontend).** La aplicación usa datos de demostración locales y **no tiene backend**. La finalización del pedido es una **simulación local**: no se envía a ningún servidor ni se guarda en una base de datos.

## Tecnologías

- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/) (`react-router-dom`)
- CSS global (sin librerías de estilos)

## Requisitos

- Node.js (versión LTS reciente)
- npm

## Instalación y ejecución

Desde la carpeta raíz del proyecto:

```bash
npm install
npm run dev
```

Luego abrí en el navegador la dirección que muestra la terminal (por defecto `http://localhost:5173`).

Otros comandos útiles:

```bash
npm run build   # revisa los tipos de TypeScript y genera la versión de producción
npm run lint    # revisa el código con ESLint
```

## Rutas

| Ruta | Página | Descripción |
|---|---|---|
| `/` | Home | Bienvenida y acceso al catálogo |
| `/products` | Products | Listado de productos con filtro por categoría |
| `/products?category=disfraces` | Products | Filtro por categoría mediante query params |
| `/products?search=calavera` | Products | Búsqueda por texto desde el buscador del Header |
| `/products/:id` | ProductDetail | Detalle de un producto y selección de cantidad |
| `/cart` | Cart | Carrito de compras |
| `*` | NotFound | Página 404 |

Todas las rutas comparten el mismo `Layout` (Header + contenido + Footer).

Categorías disponibles: `disfraces`, `decoracion`, `accesorios` y `maquillaje`. Si la URL tiene una categoría inexistente, se muestra un aviso y se listan todos los productos.

## Datos de demostración

El catálogo tiene 35 productos de demostración definidos en `src/data/products.ts`. Las fotos de los productos están en `public/images`.

## Cómo funciona el carrito

El carrito es un **estado global** implementado con React Context (`src/context/CartContext.tsx`), usando `useState` y `useContext`. El Header muestra siempre el total de unidades.

Reglas:

- Si el producto ya está en el carrito, se suma la cantidad (no se duplica la línea).
- La cantidad mínima es 1.
- La cantidad no puede superar el stock del producto.
- No se pueden agregar productos sin stock.
- Se puede modificar la cantidad, eliminar un producto y vaciar el carrito.
- El total de unidades y el importe total se calculan en un solo lugar (el contexto).
- **Finalizar pedido** (simulado): muestra una confirmación, vacía el carrito y no realiza ninguna solicitud HTTP. No se puede finalizar con el carrito vacío.

## Estructura del proyecto

```text
public/
└── images/               # fotos de productos, categorías, fondo y logo
src/
├── components/
│   ├── CartItem.tsx
│   ├── Footer.tsx
│   ├── FooterIcons.tsx
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── ProductCard.tsx
│   ├── ProductImage.tsx
│   └── ScrollManager.tsx
├── context/
│   └── CartContext.tsx
├── data/
│   └── products.ts
├── pages/
│   ├── Cart.tsx
│   ├── Home.tsx
│   ├── NotFound.tsx
│   ├── ProductDetail.tsx
│   └── Products.tsx
├── types/
│   └── index.ts
├── utils/
│   ├── cart.ts
│   ├── format.ts
│   └── stock.ts
├── App.tsx
├── index.css
└── main.tsx
```

Los precios de demostración están expresados en pesos argentinos y son ficticios.