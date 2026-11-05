"""Configuración de la base de datos SQLite con SQLAlchemy."""

from collections.abc import Generator
from pathlib import Path

from sqlalchemy import URL, create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# El archivo de la base (darkmoon.db) se guarda dentro de la carpeta backend,
# sin importar desde qué carpeta se ejecute el servidor.
DB_PATH = Path(__file__).resolve().parent / "darkmoon.db"

# Dirección de la base de datos. URL.create evita problemas con los espacios
# que tiene la ruta de la carpeta de usuario en Windows.
DATABASE_URL = URL.create("sqlite", database=str(DB_PATH))

# El "engine" es la conexión con SQLite. Si el archivo no existe, se crea solo.
# check_same_thread=False permite que FastAPI use la base desde varios hilos.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Fábrica de sesiones: cada petición abre su propia sesión de trabajo.
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    """Clase base de la que heredan todos los modelos (tablas)."""


def get_db() -> Generator[Session, None, None]:
    """Abre una sesión para cada petición y la cierra siempre al terminar."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()