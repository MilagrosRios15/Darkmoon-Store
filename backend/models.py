"""Modelos de la base de datos: cada clase es una tabla de SQLite."""

from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Product(Base):
    """Tabla products: el catálogo de la tienda."""

    __tablename__ = "products"

    # Reglas que la propia base de datos hace cumplir, además de Pydantic.
    __table_args__ = (
        CheckConstraint("length(trim(name)) > 0", name="ck_products_name_not_empty"),
        CheckConstraint("price > 0", name="ck_products_price_positive"),
        CheckConstraint("stock >= 0", name="ck_products_stock_non_negative"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    category: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    stock: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    # Columna opcional agregada para mostrar la foto (no es obligatoria).
    image: Mapped[str | None] = mapped_column(String(200), nullable=True)


class Order(Base):
    """Tabla orders: los pedidos registrados."""

    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    # Fecha y hora automática: se completa sola al crear el pedido.
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.now
    )
    total: Mapped[float] = mapped_column(Float, nullable=False)
    # Texto JSON con los productos, cantidades y precios del pedido.
    items_json: Mapped[str] = mapped_column(Text, nullable=False)