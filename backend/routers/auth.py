"""Endpoints de cuentas: /api/auth."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import get_db
from models import AuthSession, User
from schemas import AuthResponse, UserCreate, UserLogin, UserOut
from security import (
    SESSION_DURATION,
    bearer_scheme,
    get_current_user,
    hash_password,
    new_session_token,
    verify_password,
)

router = APIRouter(prefix="/api/auth", tags=["Cuentas"])


def start_session(db: Session, user: User) -> AuthResponse:
    """Crea una sesión nueva para el usuario y devuelve el token."""
    token = new_session_token()
    db.add(
        AuthSession(
            token=token,
            user_id=user.id,
            expires_at=datetime.now() + SESSION_DURATION,
        )
    )
    db.commit()
    return AuthResponse(token=token, user=UserOut.model_validate(user))


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear una cuenta",
)
def register(data: UserCreate, db: Session = Depends(get_db)):
    """Crea la cuenta y deja la sesión iniciada."""
    existing = db.scalar(select(User).where(User.email == data.email))
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con ese email.",
        )

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con ese email.",
        ) from exc
    db.refresh(user)

    return start_session(db, user)


@router.post("/login", response_model=AuthResponse, summary="Iniciar sesión")
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Verifica email y contraseña, y crea una sesión."""
    email = data.email.strip().lower()
    user = db.scalar(select(User).where(User.email == email))

    # Mismo mensaje en los dos casos: no se revela si el email existe.
    if user is None or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos.",
        )

    return start_session(db, user)


@router.get("/me", response_model=UserOut, summary="Ver mi usuario")
def me(user: User = Depends(get_current_user)):
    """Devuelve el usuario de la sesión actual."""
    return user


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Cerrar sesión",
)
def logout(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Response:
    """Borra la sesión de la base de datos."""
    if credentials is not None:
        session = db.get(AuthSession, credentials.credentials)
        if session is not None:
            db.delete(session)
            db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)