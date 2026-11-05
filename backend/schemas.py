"""Esquemas Pydantic: validan los datos que entran y definen los que salen."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

# Categorías válidas de la tienda (equivalentes a bebidas/snacks/... del kiosco).
CATEGORIES = ("disfraces", "decoracion", "accesorios", "maquillaje")
Category = Literal["disfraces", "decoracion", "accesorios", "maquillaje"]

# Formato básico de email: algo@algo.algo (sin espacios).
EMAIL_PATTERN = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


# ---------- Productos ----------

class ProductCreate(BaseModel):
    """Datos para crear un producto. Acá están las validaciones obligatorias."""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "name": "Disfraz de Fantasma",
                    "category": "disfraces",
                    "price": 35000,
                    "stock": 5,
                    "description": "Túnica blanca con capucha.",
                }
            ]
        }
    )

    name: str = Field(min_length=1, max_length=120)  # no puede estar vacío
    category: Category                               # solo las 4 categorías
    price: float = Field(gt=0)                       # mayor que cero
    stock: int = Field(ge=0)                         # cero o más (no negativo)
    description: str | None = Field(default=None, max_length=500)  # opcional
    image: str | None = Field(default=None, max_length=200)        # opcional

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, value: str) -> str:
        """Rechaza nombres formados solo por espacios."""
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("El nombre no puede estar vacío.")
        return cleaned


class ProductOut(BaseModel):
    """Forma en que la API devuelve un producto."""

    # Permite construir este esquema directamente desde un modelo de SQLAlchemy.
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: str
    price: float
    stock: int
    description: str | None
    image: str | None


# ---------- Pedidos ----------

class OrderItemCreate(BaseModel):
    """Un renglón del pedido: qué producto y cuántas unidades."""

    product_id: int = Field(gt=0)  # id válido (mayor que cero)
    quantity: int = Field(gt=0)    # al menos 1 unidad


class OrderCreate(BaseModel):
    """Cuerpo de POST /api/orders. El frontend solo manda ids y cantidades."""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "items": [
                        {"product_id": 1, "quantity": 2},
                        {"product_id": 10, "quantity": 1},
                    ]
                }
            ]
        }
    )

    items: list[OrderItemCreate] = Field(min_length=1)  # no se acepta vacío


class OrderItemOut(BaseModel):
    """Renglón del pedido ya calculado por el backend."""

    product_id: int
    name: str
    unit_price: float
    quantity: int
    subtotal: float


class OrderOut(BaseModel):
    """Forma en que la API devuelve un pedido registrado."""

    id: int
    created_at: datetime
    total: float
    items: list[OrderItemOut]


# ---------- Cuentas ----------

class UserCreate(BaseModel):
    """Datos para crear una cuenta."""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "name": "Milagros",
                    "email": "mili@ejemplo.com",
                    "password": "halloween2026",
                }
            ]
        }
    )

    name: str = Field(min_length=2, max_length=80)
    email: str = Field(max_length=120, pattern=EMAIL_PATTERN)
    password: str = Field(min_length=8, max_length=128)  # mínimo 8 caracteres

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        """Quita espacios de más y exige al menos 2 caracteres reales."""
        cleaned = " ".join(value.split())
        if len(cleaned) < 2:
            raise ValueError("El nombre debe tener al menos 2 caracteres.")
        return cleaned

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value: object) -> object:
        """Guarda el email sin espacios y en minúsculas."""
        return value.strip().lower() if isinstance(value, str) else value


class UserLogin(BaseModel):
    """Datos para iniciar sesión."""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [{"email": "mili@ejemplo.com", "password": "halloween2026"}]
        }
    )

    email: str = Field(min_length=1, max_length=120)
    password: str = Field(min_length=1, max_length=128)


class UserOut(BaseModel):
    """Datos públicos de un usuario (nunca incluye la contraseña)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str


class AuthResponse(BaseModel):
    """Respuesta al crear cuenta o iniciar sesión."""

    token: str
    user: UserOut