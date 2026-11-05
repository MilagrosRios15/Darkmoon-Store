import { isCategory } from '../types';
import type { AuthResult, Order, OrderItemInput, Product, User } from '../types';

// ---------- Configuración ----------

// Dirección del backend. Se puede cambiar con la variable VITE_API_URL
// (archivo .env); si no existe, se usa la dirección local de FastAPI.
const envApiUrl: string | undefined = import.meta.env.VITE_API_URL;
export const API_URL = (envApiUrl ?? 'http://127.0.0.1:8000').replace(/\/+$/, '');

// ---------- Errores ----------

// Error de la API con un mensaje para mostrar al usuario.
// status es el código HTTP (401, 404, 409...) o null si no hubo respuesta
// (servidor apagado, sin conexión, CORS).
export class ApiError extends Error {
  status: number | null;

  constructor(message: string, status: number | null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Devuelve un mensaje entendible para cualquier error.
export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

// Lee el mensaje "detail" que manda FastAPI cuando responde con error.
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (
      typeof data === 'object' &&
      data !== null &&
      'detail' in data &&
      typeof data.detail === 'string'
    ) {
      return data.detail;
    }
  } catch {
    // La respuesta no era JSON: se usa el mensaje genérico de abajo.
  }
  return `El servidor respondió con un error (${response.status}). Intentá de nuevo.`;
}

// Arma los encabezados; si hay token, agrega "Authorization: Bearer <token>".
function buildHeaders(token?: string, withBody = false): HeadersInit {
  const headers: Record<string, string> = {};
  if (withBody) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// Función base: hace el fetch y trata los dos tipos de error.
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch (error) {
    // Si la petición se canceló a propósito (AbortController), se respeta.
    if (options?.signal?.aborted) throw error;
    // Error de red: el servidor no respondió.
    throw new ApiError(
      'No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.',
      null,
    );
  }

  // Error HTTP: el servidor respondió, pero con un código de error.
  // fetch NO lanza un error en estos casos, por eso se revisa response.ok.
  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  // 204 = respuesta correcta sin contenido (por ejemplo, cerrar sesión).
  if (response.status === 204) {
    return undefined as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('El servidor envió una respuesta inválida.', response.status);
  }
}

// ---------- Formato de los datos del backend ----------

interface ApiProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string | null;
  image: string | null;
}

interface ApiOrderLine {
  product_id: number;
  name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

interface ApiOrder {
  id: number;
  created_at: string;
  total: number;
  items: ApiOrderLine[];
}

// Convierte un producto del backend al tipo Product del frontend.
function toProduct(data: ApiProduct): Product {
  if (!isCategory(data.category)) {
    throw new ApiError('El servidor devolvió un producto con una categoría desconocida.', 500);
  }
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    price: data.price,
    stock: data.stock,
    description: data.description ?? '',
    image: data.image ?? undefined,
  };
}

function toOrder(data: ApiOrder): Order {
  return {
    id: data.id,
    createdAt: data.created_at,
    total: data.total,
    items: data.items.map((item) => ({
      productId: item.product_id,
      name: item.name,
      unitPrice: item.unit_price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    })),
  };
}

// ---------- Productos y pedidos ----------

// GET /api/products o /api/products?category=...
export async function getProducts(
  category?: string,
  signal?: AbortSignal,
): Promise<Product[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const data = await request<ApiProduct[]>(`/api/products${query}`, { signal });
  return data.map(toProduct);
}

// GET /api/products/{id}
export async function getProductById(
  id: number,
  signal?: AbortSignal,
): Promise<Product> {
  const data = await request<ApiProduct>(`/api/products/${id}`, { signal });
  return toProduct(data);
}

// POST /api/orders: se envían solo ids y cantidades, más el token de la sesión.
// El precio y el total los calcula el backend.
export async function createOrder(
  items: OrderItemInput[],
  token: string,
): Promise<Order> {
  const body = {
    items: items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
  };

  const data = await request<ApiOrder>('/api/orders', {
    method: 'POST',
    headers: buildHeaders(token, true),
    body: JSON.stringify(body),
  });

  return toOrder(data);
}

// ---------- Cuentas ----------

// POST /api/auth/register
export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  return request<AuthResult>('/api/auth/register', {
    method: 'POST',
    headers: buildHeaders(undefined, true),
    body: JSON.stringify({ name, email, password }),
  });
}

// POST /api/auth/login
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResult> {
  return request<AuthResult>('/api/auth/login', {
    method: 'POST',
    headers: buildHeaders(undefined, true),
    body: JSON.stringify({ email, password }),
  });
}

// GET /api/auth/me: comprueba que el token siga siendo válido.
export async function getCurrentUser(
  token: string,
  signal?: AbortSignal,
): Promise<User> {
  return request<User>('/api/auth/me', {
    headers: buildHeaders(token),
    signal,
  });
}

// POST /api/auth/logout
export async function logoutUser(token: string): Promise<void> {
  await request<void>('/api/auth/logout', {
    method: 'POST',
    headers: buildHeaders(token),
  });
}