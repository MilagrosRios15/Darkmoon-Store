// Formato básico de email: algo@algo.algo (el mismo que valida el backend).
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Lee a dónde volver después de iniciar sesión (por ejemplo, al carrito).
// Solo se aceptan rutas internas de la tienda.
export function getRedirectPath(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'from' in state) {
    const from = (state as { from: unknown }).from;
    if (typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')) {
      return from;
    }
  }
  return '/';
}