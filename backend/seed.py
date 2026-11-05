"""Datos iniciales: carga los 35 productos de DarkMoon Store en SQLite."""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models import Product
from schemas import ProductCreate

# Mismos productos que el frontend de la Parte 1, en el mismo orden
# (los ids se generan solos: 1 a 35).
INITIAL_PRODUCTS: list[dict] = [
    # ---------- Disfraces ----------
    {"name": "Disfraz de Vampiro Victoriano", "category": "disfraces", "price": 45900, "stock": 8,
     "description": "Capa larga con cuello alto, chaleco bordó y camisa con volados. Incluye colmillos. Talles: 12, 14 y 16 (adolescente); S, M, L y XL (adulto).",
     "image": "/images/vampiro.jpg"},
    {"name": "Disfraz de Bruja Nocturna", "category": "disfraces", "price": 38500, "stock": 12,
     "description": "Vestido negro con detalles en violeta, capa y sombrero puntiagudo. Talles: 12, 14 y 16 (adolescente); S, M, L y XL (adulto).",
     "image": "/images/bruja.jpg"},
    {"name": "Disfraz de Esqueleto Luminoso", "category": "disfraces", "price": 41200, "stock": 0,
     "description": "Mono negro con huesos que brillan en la oscuridad. Talle único adulto.",
     "image": "/images/esqueleto.jpg"},
    {"name": "Disfraz de Payaso Siniestro", "category": "disfraces", "price": 43500, "stock": 7,
     "description": "Traje de estilo victoriano negro y rojo oscuro, con cuello de volados, mangas a rayas y máscara teatral. Talles: 12, 14 y 16 (adolescente); S, M, L y XL (adulto).",
     "image": "/images/payaso.jpg"},
    {"name": "Disfraz de Novia Cadáver", "category": "disfraces", "price": 47800, "stock": 5,
     "description": "Vestido de novia marfil envejecido con encaje negro, rosas bordó, velo delicado y tela rasgada. Talles: 12, 14 y 16 (adolescente); S, M, L y XL (adulto).",
     "image": "/images/novia-cadaver.jpg"},
    {"name": "Disfraz de Demonio Oscuro", "category": "disfraces", "price": 44900, "stock": 9,
     "description": "Capa larga negra con detalles carmesí y tocado con cuernos, de estilo gótico. Talle único adulto.",
     "image": "/images/demonio.jpg"},
    {"name": "Disfraz de Hada Oscura", "category": "disfraces", "price": 39900, "stock": 6,
     "description": "Vestido negro con falda de tul y alas plegables con brillo violeta. Talles: 12, 14 y 16 (adolescente); S, M, L y XL (adulto).",
     "image": "/images/hada-oscura.jpg"},
    {"name": "Disfraz de Momia Ancestral", "category": "disfraces", "price": 36700, "stock": 11,
     "description": "Mono con vendas envejecidas superpuestas y capucha. Talle único adulto.",
     "image": "/images/momia-ancestral.jpg"},
    {"name": "Disfraz de Pirata Fantasma", "category": "disfraces", "price": 42600, "stock": 4,
     "description": "Saco largo desgastado, camisa con volados y sombrero de pirata. Talles: 12, 14 y 16 (adolescente); S, M, L y XL (adulto).",
     "image": "/images/pirata-fantasma.jpg"},

    # ---------- Decoración ----------
    {"name": "Calabaza Tallada con Luz LED", "category": "decoracion", "price": 12800, "stock": 25,
     "description": "Calabaza decorativa de 30 cm con luz LED cálida a pilas. Ideal para entradas y ventanas.",
     "image": "/images/calabaza.jpg"},
    {"name": "Guirnalda de Murciélagos", "category": "decoracion", "price": 9600, "stock": 30,
     "description": "Guirnalda de 3 metros con murciélagos negros de cartón rígido para colgar.",
     "image": "/images/guirnalda.jpg"},
    {"name": "Telaraña Gigante con Arañas", "category": "decoracion", "price": 7400, "stock": 40,
     "description": "Telaraña elástica blanca de 2 metros con 4 arañas incluidas.",
     "image": "/images/telarana.jpg"},
    {"name": "Candelabros LED Góticos", "category": "decoracion", "price": 18900, "stock": 14,
     "description": "Candelabros negros de estilo gótico con velas LED de luz parpadeante.",
     "image": "/images/candelabros.jpg"},
    {"name": "Lápidas Decorativas para Jardín", "category": "decoracion", "price": 15600, "stock": 20,
     "description": "Set de 3 lápidas en miniatura con textura de piedra envejecida y calaveras talladas. Para jardín o interiores.",
     "image": "/images/lapidas.jpg"},
    {"name": "Luces LED de Calabazas", "category": "decoracion", "price": 10800, "stock": 22,
     "description": "Guirnalda de luces de 2 metros con calabacitas LED de luz cálida a pilas.",
     "image": "/images/luces-calabazas.jpg"},
    {"name": "Centro de Mesa con Calavera", "category": "decoracion", "price": 13400, "stock": 12,
     "description": "Calavera decorativa de resina para mesas, aparadores y estantes.",
     "image": "/images/centro-mesa-calavera.jpg"},
    {"name": "Espejo Embrujado", "category": "decoracion", "price": 21500, "stock": 5,
     "description": "Espejo decorativo con marco envejecido de estilo antiguo para colgar.",
     "image": "/images/espejo-embrujado.jpg"},
    {"name": "Faroles con Fantasmas", "category": "decoracion", "price": 16200, "stock": 18,
     "description": "Faroles decorativos con figuras de fantasmas y luz LED a pilas.",
     "image": "/images/faroles-fantasma.jpg"},
    {"name": "Ramo de Rosas Negras", "category": "decoracion", "price": 8900, "stock": 9,
     "description": "Ramo de rosas artificiales oscuras para jarrones, centros de mesa y rincones góticos.",
     "image": "/images/ramo-rosas.jpg"},

    # ---------- Accesorios ----------
    {"name": "Máscara de Calavera de Resina", "category": "accesorios", "price": 22300, "stock": 6,
     "description": "Máscara de calavera con acabado envejecido y elástico ajustable.",
     "image": "/images/mascara.jpg"},
    {"name": "Sombrero de Bruja con Velo", "category": "accesorios", "price": 11500, "stock": 15,
     "description": "Sombrero de fieltro negro con velo violeta y hebilla naranja.",
     "image": "/images/sombrero.jpg"},
    {"name": "Máscara de Baile Veneciano", "category": "accesorios", "price": 17800, "stock": 10,
     "description": "Antifaz veneciano negro y violeta con encaje calado y detalles dorados envejecidos.",
     "image": "/images/mascara-veneciana.jpg"},
    {"name": "Colmillos de Vampiro", "category": "accesorios", "price": 3900, "stock": 35,
     "description": "Par de colmillos blancos de aspecto realista, con estuche negro para guardarlos.",
     "image": "/images/colmillos.jpg"},
    {"name": "Guantes Negros de Encaje", "category": "accesorios", "price": 6800, "stock": 16,
     "description": "Par de guantes góticos de encaje negro con diseño floral y estilo vintage.",
     "image": "/images/guantes-encaje.jpg"},
    {"name": "Vincha de Murciélagos", "category": "accesorios", "price": 5400, "stock": 2,
     "description": "Vincha negra de terciopelo con pequeñas alas de murciélago y detalles violetas.",
     "image": "/images/vincha-murcielagos.jpg"},
    {"name": "Abanico Gótico de Plumas", "category": "accesorios", "price": 9400, "stock": 8,
     "description": "Abanico de plumas negras con mango plateado de estilo antiguo y detalles ornamentales.",
     "image": "/images/abanico-plumas.jpg"},
    {"name": "Set de Hebillas con Calaveras", "category": "accesorios", "price": 4800, "stock": 20,
     "description": "Set de 4 hebillas negras para el pelo con calaveras plateadas y cristales violetas.",
     "image": "/images/hebillas-calavera.jpg"},

    # ---------- Maquillaje ----------
    {"name": "Kit de Maquillaje Artístico Zombie", "category": "maquillaje", "price": 14900, "stock": 10,
     "description": "Paleta de 6 colores al agua, pincel, esponja y cicatrices de látex.",
     "image": "/images/kit-zombie.jpg"},
    {"name": "Sangre Falsa Lavable 120 ml", "category": "maquillaje", "price": 4200, "stock": 3,
     "description": "Sangre artificial a base de agua, segura para la piel y fácil de lavar.",
     "image": "/images/sangre.jpg"},
    {"name": "Paleta de Sombras Halloween", "category": "maquillaje", "price": 12600, "stock": 13,
     "description": "Paleta de sombras en negro intenso, violeta profundo, bordó y gris ahumado, en un estuche oscuro.",
     "image": "/images/paleta-sombras.jpg"},
    {"name": "Kit de Pinturas Faciales", "category": "maquillaje", "price": 9800, "stock": 17,
     "description": "Set de pinturas faciales al agua con pinceles y esponja aplicadora.",
     "image": "/images/pinturas-faciales.jpg"},
    {"name": "Glitter Violeta y Negro", "category": "maquillaje", "price": 3500, "stock": 28,
     "description": "Gel con glitter para rostro, cuerpo y cabello. Se retira con agua y jabón.",
     "image": "/images/glitter.jpg"},
    {"name": "Set de Maquillaje de Calavera", "category": "maquillaje", "price": 11900, "stock": 8,
     "description": "Pintura facial blanca y negra, pinceles de precisión, esponja para difuminar y tarjeta de referencia.",
     "image": "/images/maquillaje-calavera.jpg"},
    {"name": "Kit de Maquillaje Fluorescente", "category": "maquillaje", "price": 10500, "stock": 12,
     "description": "Pinturas para rostro y cuerpo que brillan bajo la luz negra.",
     "image": "/images/kit-fluorescente.jpg"},
    {"name": "Tatuajes Temporales de Halloween", "category": "maquillaje", "price": 2900, "stock": 40,
     "description": "Plancha de tatuajes temporales con diseños de Halloween. Se aplican con agua.",
     "image": "/images/tatuajes-temporales.jpg"},
]


def seed_products(db: Session) -> None:
    """Carga los productos iniciales solo si la tabla está vacía.

    Así, al reiniciar el servidor, los productos NO se duplican.
    """
    existing = db.scalar(select(func.count()).select_from(Product))
    if existing:
        return

    for data in INITIAL_PRODUCTS:
        # Cada producto pasa por Pydantic antes de guardarse.
        validated = ProductCreate(**data)
        db.add(Product(**validated.model_dump()))

    db.commit()