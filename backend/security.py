"""Seguridad: cifrado de contraseñas, tokens de sesión y usuario actual."""

import hashlib
import hmac
import secrets
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from database import get_db
from models import AuthSession, User

# Cantidad de repeticiones del cifrado: cuantas más, más difícil de adivinar.
PASSWORD_ITERATIONS = 200_000

# Cuánto dura una sesión iniciada.
SESSION_DURATION = timedelta(days=7)

# Lee el encabezado "Authorization: Bearer <token>" de cada petición.
# auto_error=False: si falta, se devuelve nuestro propio mensaje en español.
bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """Cifra la contraseña con PBKDF2-SHA256 y una "sal" aleatoria."""
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), bytes.fromhex(salt), PASSWORD_ITERATIONS
    ).hex()
    # Se guardan el método, las repeticiones, la sal y el resultado.
    return f"pbkdf2_sha256${PASSWORD_ITERATIONS}${salt}${digest}"


def verify_password(password: str, stored_hash: str) -> bool:
    """Comprueba si la contraseña escrita coincide con la guardada."""
    try:
        method, iterations, salt, digest = stored_hash.split("$")
    except ValueError:
        return False
    if method != "pbkdf2_sha256":
        return False

    candidate = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), bytes.fromhex(salt), int(iterations)
    ).hex()
    # compare_digest compara de forma segura (sin dar pistas por el tiempo).
    return hmac.compare_digest(candidate, digest)


def new_session_token() -> str:
    """Genera un token aleatorio e imposible de adivinar."""
    return secrets.token_urlsafe(32)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Devuelve el usuario de la sesión, o un error 401 si no hay sesión válida."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Iniciá sesión para continuar.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    session = db.get(AuthSession, credentials.credentials)
    if session is None or session.expires_at < datetime.now():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tu sesión no es válida o venció. Iniciá sesión de nuevo.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.get(User, session.user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tu sesión no es válida o venció. Iniciá sesión de nuevo.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user