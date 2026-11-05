# DarkMoon Store

Tienda online de Halloween (disfraces, decoración, accesorios y maquillaje) desarrollada como trabajo académico. Es una adaptación de la consigna "Mini-App de un kiosco de barrio" a una temática de Halloween.

> **Estado actual: Parte 2 (frontend + backend).** El frontend (React + TypeScript) obtiene los productos desde una API hecha con FastAPI, que guarda los datos en SQLite. Los pedidos se registran en la base de datos y descuentan el stock.
>
> La versión de la **Parte 1** (solo frontend con datos mock) quedó guardada en la etiqueta [`parte-1`](https://github.com/MilagrosRios15/Darkmoon-Store/tree/parte-1).

## Tecnologías

**Frontend**

- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/) (`react-router-dom`)
- CSS global (sin librerías de estilos)
- `fetch` para comunicarse con la API

**Backend**

- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLite](https://www.sqlite.org/) como base de datos
- [SQLAlchemy](https://www.sqlalchemy.org/) para los modelos y las consultas
- [Pydantic](https://docs.pydantic.dev/) para las validaciones
- [Uvicorn](https://www.uvicorn.org/) como servidor

## Requisitos

- Node.js (versión LTS reciente) y npm
- Python 3.11 o superior

## Estructura general

```text
darkmoon-store/        ← raíz del proyecto (acá está el frontend)
├── backend/           ← API con FastAPI
├── public/
├── src/
├── package.json
└── README.md
```

El **frontend** está en la raíz del proyecto y el **backend** en la carpeta `backend/`. Para usar la aplicación hay que tener **los dos servidores funcionando al mismo tiempo**, cada uno en su propia terminal.

## 1. Backend (FastAPI)

Todos los comandos de esta sección se ejecutan **dentro de la carpeta `backend`**:

```bash
cd backend
```

### Crear y activar el entorno virtual (solo la primera vez se crea)

```bash
python -m venv .venv
```

Activarlo en Windows (cada vez que se abre una terminal nueva):

| Terminal | Comando |
|---|---|
| Git Bash | `source .venv/Scripts/activate` |
| Símbolo del sistema (cmd) | `.venv\Scripts\activate` |
| PowerShell | `.venv\Scripts\Activate.ps1` |

Cuando está activo, la terminal muestra `(.venv)` al principio de la línea.

### Instalar las dependencias

```bash
pip install -r requirements.txt
```

### Iniciar el servidor

```bash
uvicorn main:app --reload
```

La API queda disponible en `http://127.0.0.1:8000` y su documentación interactiva en **`http://127.0.0.1:8000/docs`**.

Al iniciar por primera vez se crea automáticamente la base de datos `backend/darkmoon.db` con los 35 productos de demostración. Si la base ya tiene productos, no se vuelven a cargar (no se duplican).

Para volver al stock original: detener el servidor, borrar `backend/darkmoon.db` e iniciarlo de nuevo.

## 2. Frontend (React)

En **otra terminal**, desde la **carpeta raíz** del proyecto:

```bash
npm install
npm run dev
```

Luego abrí en el navegador `http://localhost:5173`.

> El frontend debe correr en el puerto **5173**: el backend solo acepta peticiones desde ese origen (configuración de CORS en `backend/main.py`).

Otros comandos útiles:

```bash
npm run build   # revisa los tipos de TypeScript y genera la versión de producción
npm run lint    # revisa el código con ESLint
```

### Dirección de la API

Por defecto, el frontend se conecta a `http://127.0.0.1:8000`. La dirección está definida en un solo lugar: `src/services/api.ts`.

Para usar otra dirección, crear un archivo `.env` en la raíz del proyecto con:

```text
VITE_API_URL=http://127.0.0.1:8000
```

y volver a ejecutar `npm run dev`. Este archivo no contiene datos secretos.

### Comprobar la conexión

1. Con los dos servidores funcionando, abrí la página **Productos**: tienen que aparecer los 35 productos que vienen de la base de datos.
2. Si el backend está apagado, la página muestra el mensaje "No se pudieron cargar los productos." con un botón **Reintentar** (no se muestran datos de respaldo).

## Endpoints de la API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/products` | Lista los productos. Acepta `?category=` (`disfraces`, `decoracion`, `accesorios`, `maquillaje`); el filtro se hace en el backend |
| GET | `/api/products/{id}` | Detalle de un producto. Si no existe, responde **404** |
| POST | `/api/orders` | Crea un pedido |
| GET | `/api/orders` | Lista los pedidos registrados |
| POST | `/api/products` | Crea un producto (se usa para probar las validaciones de Pydantic desde `/docs`) |

Ejemplo de cuerpo para crear un pedido:

```json
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 10, "quantity": 1 }
  ]
}
```

## Cómo se registra un pedido

Cuando el usuario toca **Finalizar pedido**, el frontend envía a `POST /api/orders` solo los ids de los productos y sus cantidades. El backend:

1. Valida los datos con Pydantic (al menos un producto, ids válidos, cantidades mayores que cero).
2. Verifica que todos los productos existan (si no, responde **404**).
3. Verifica que haya stock suficiente de **todos** los productos (si no, responde **409** y rechaza el pedido completo).
4. Calcula el total con los **precios guardados en la base de datos** (no confía en precios enviados por el frontend).
5. Descuenta el stock y registra el pedido en la tabla `orders` (fecha automática, total y productos en formato JSON).

Los pasos 4 y 5 ocurren en una **transacción**: si algo falla, se deshace todo, así no queda un pedido a medias ni stock descontado de más.

En el frontend, mientras se envía el pedido el botón muestra "Enviando pedido..." y se deshabilita. Si el pedido se confirma, se muestra el número de pedido y el carrito se vacía. Si falla (stock insuficiente, servidor apagado, etc.), se muestra el error y **el carrito se conserva**.

## Validaciones del backend

- `name` no puede estar vacío.
- `price` debe ser mayor que 0.
- `stock` no puede ser negativo.
- `category` debe ser una de las cuatro categorías de la tienda.
- En los pedidos: al menos un producto, ids y cantidades mayores que 0, productos existentes y stock suficiente.

Los datos inválidos se rechazan con el código **422**.

## Rutas del frontend

| Ruta | Página | Descripción |
|---|---|---|
| `/` | Home | Bienvenida, categorías y productos destacados |
| `/products` | Products | Listado de productos con filtro por categoría |
| `/products?category=disfraces` | Products | Filtro por categoría mediante query params |
| `/products?search=calavera` | Products | Búsqueda por texto desde el buscador del Header |
| `/products/:id` | ProductDetail | Detalle de un producto y selección de cantidad |
| `/cart` | Cart | Carrito de compras |
| `*` | NotFound | Página 404 |

Todas las rutas comparten el mismo `Layout` (Header + contenido + Footer).

Si la URL tiene una categoría inexistente, se muestra un aviso y se listan todos los productos.

## Cómo funciona el carrito

El carrito es un **estado global** implementado con React Context (`src/context/CartContext.tsx`), usando `useState` y `useContext`. El Header muestra siempre el total de unidades.

Reglas:

- Si el producto ya está en el carrito, se suma la cantidad (no se duplica la línea).
- La cantidad mínima es 1.
- La cantidad no puede superar el stock del producto.
- No se pueden agregar productos sin stock.
- Se puede modificar la cantidad, eliminar un producto y vaciar el carrito.
- El total de unidades y el importe total se calculan en un solo lugar (el contexto).
- No se puede finalizar un pedido con el carrito vacío.

La validación definitiva del stock la hace el backend al registrar el pedido.

## Datos de demostración

Los 35 productos de demostración se cargan en la base de datos desde `backend/seed.py`. Las fotos están en `public/images`.

Los datos mock de la Parte 1 (`src/data/products.ts`) quedaron **comentados**: la aplicación ya no los usa.

## Estructura del proyecto

```text
backend/
├── main.py               # inicio de FastAPI, CORS y creación de tablas
├── database.py           # configuración de SQLite
├── models.py             # tablas products y orders (SQLAlchemy)
├── schemas.py            # validaciones y respuestas (Pydantic)
├── seed.py               # productos iniciales
├── routers/
│   ├── products.py       # endpoints de productos
│   └── orders.py         # endpoints de pedidos
└── requirements.txt
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
│   └── products.ts       # datos mock de la Parte 1 (comentados)
├── pages/
│   ├── Cart.tsx
│   ├── Home.tsx
│   ├── NotFound.tsx
│   ├── ProductDetail.tsx
│   └── Products.tsx
├── services/
│   └── api.ts            # funciones para llamar a la API con fetch
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