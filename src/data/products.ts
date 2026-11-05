import type { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Disfraz de Vampiro Victoriano',
    category: 'disfraces',
    price: 45900,
    stock: 8,
    description:
      'Capa larga con cuello alto, chaleco bordó y camisa con volados. Incluye colmillos.',
    image: '/images/vampiro.jpg',
  },
  {
    id: 2,
    name: 'Disfraz de Bruja Nocturna',
    category: 'disfraces',
    price: 38500,
    stock: 12,
    description:
      'Vestido negro con detalles en violeta, capa y sombrero puntiagudo.',
    image: '/images/bruja.jpg',
  },
  {
    id: 3,
    name: 'Disfraz de Esqueleto Luminoso',
    category: 'disfraces',
    price: 41200,
    stock: 0,
    description:
      'Mono negro con huesos que brillan en la oscuridad. Talle único adulto.',
    image: '/images/esqueleto.jpg',
  },
  {
    id: 4,
    name: 'Calabaza Tallada con Luz LED',
    category: 'decoracion',
    price: 12800,
    stock: 25,
    description:
      'Calabaza decorativa de 30 cm con luz LED cálida a pilas. Ideal para entradas y ventanas.',
    image: '/images/calabaza.jpg',
  },
  {
    id: 5,
    name: 'Guirnalda de Murciélagos',
    category: 'decoracion',
    price: 9600,
    stock: 30,
    description:
      'Guirnalda de 3 metros con murciélagos negros de cartón rígido para colgar.',
    image: '/images/guirnalda.jpg',
  },
  {
    id: 6,
    name: 'Telaraña Gigante con Arañas',
    category: 'decoracion',
    price: 7400,
    stock: 40,
    description:
      'Telaraña elástica blanca de 2 metros con 4 arañas incluidas.',
    image: '/images/telarana.jpg',
  },
  {
    id: 7,
    name: 'Máscara de Calavera de Resina',
    category: 'accesorios',
    price: 22300,
    stock: 6,
    description:
      'Máscara de calavera con acabado envejecido y elástico ajustable.',
    image: '/images/mascara.jpg',
  },
  {
    id: 8,
    name: 'Sombrero de Bruja con Velo',
    category: 'accesorios',
    price: 11500,
    stock: 15,
    description:
      'Sombrero de fieltro negro con velo violeta y hebilla naranja.',
    image: '/images/sombrero.jpg',
  },
  {
    id: 9,
    name: 'Kit de Maquillaje Artístico Zombie',
    category: 'maquillaje',
    price: 14900,
    stock: 10,
    description:
      'Paleta de 6 colores al agua, pincel, esponja y cicatrices de látex.',
    image: '/images/kit-zombie.jpg',
  },
  {
    id: 10,
    name: 'Sangre Falsa Lavable 120 ml',
    category: 'maquillaje',
    price: 4200,
    stock: 3,
    description:
      'Sangre artificial a base de agua, segura para la piel y fácil de lavar.',
    image: '/images/sangre.jpg',
  },

  // ---------- Disfraces ----------
  {
    id: 11,
    name: 'Disfraz de Payaso Siniestro',
    category: 'disfraces',
    price: 43500,
    stock: 7,
    description:
      'Traje de estilo victoriano negro y rojo oscuro, con cuello de volados, mangas a rayas y máscara teatral.',
    image: '/images/payaso.jpg',
  },
  {
    id: 12,
    name: 'Disfraz de Novia Cadáver',
    category: 'disfraces',
    price: 47800,
    stock: 5,
    description:
      'Vestido de novia marfil envejecido con encaje negro, rosas bordó, velo delicado y tela rasgada.',
    image: '/images/novia-cadaver.jpg',
  },
  {
    id: 13,
    name: 'Disfraz de Demonio Oscuro',
    category: 'disfraces',
    price: 44900,
    stock: 9,
    description:
      'Capa larga negra con detalles carmesí y tocado con cuernos, de estilo gótico.',
    image: '/images/demonio.jpg',
  },
  {
    id: 14,
    name: 'Disfraz de Hada Oscura',
    category: 'disfraces',
    price: 39900,
    stock: 6,
    description:
      'Vestido negro con falda de tul y alas plegables con brillo violeta.',
    image: '/images/hada-oscura.jpg',
  },
  {
    id: 15,
    name: 'Disfraz de Momia Ancestral',
    category: 'disfraces',
    price: 36700,
    stock: 11,
    description:
      'Mono con vendas envejecidas superpuestas y capucha. Talle único adulto.',
    image: '/images/momia-ancestral.jpg',
  },
  {
    id: 16,
    name: 'Disfraz de Pirata Fantasma',
    category: 'disfraces',
    price: 42600,
    stock: 4,
    description:
      'Saco largo desgastado, camisa con volados y sombrero de pirata.',
    image: '/images/pirata-fantasma.jpg',
  },

  // ---------- Decoración ----------
  {
    id: 17,
    name: 'Candelabros LED Góticos',
    category: 'decoracion',
    price: 18900,
    stock: 14,
    description:
      'Candelabros negros de estilo gótico con velas LED de luz parpadeante.',
    image: '/images/candelabros.jpg',
  },
  {
    id: 18,
    name: 'Lápidas Decorativas para Jardín',
    category: 'decoracion',
    price: 15600,
    stock: 20,
    description:
      'Set de 3 lápidas en miniatura con textura de piedra envejecida y calaveras talladas. Para jardín o interiores.',
    image: '/images/lapidas.jpg',
  },
  {
    id: 19,
    name: 'Luces LED de Calabazas',
    category: 'decoracion',
    price: 10800,
    stock: 22,
    description:
      'Guirnalda de luces de 2 metros con calabacitas LED de luz cálida a pilas.',
    image: '/images/luces-calabazas.jpg',
  },
  {
    id: 20,
    name: 'Centro de Mesa con Calavera',
    category: 'decoracion',
    price: 13400,
    stock: 12,
    description:
      'Calavera decorativa de resina para mesas, aparadores y estantes.',
    image: '/images/centro-mesa-calavera.jpg',
  },
  {
    id: 21,
    name: 'Espejo Embrujado',
    category: 'decoracion',
    price: 21500,
    stock: 5,
    description:
      'Espejo decorativo con marco envejecido de estilo antiguo para colgar.',
    image: '/images/espejo-embrujado.jpg',
  },
  {
    id: 22,
    name: 'Faroles con Fantasmas',
    category: 'decoracion',
    price: 16200,
    stock: 18,
    description:
      'Faroles decorativos con figuras de fantasmas y luz LED a pilas.',
    image: '/images/faroles-fantasma.jpg',
  },
  {
    id: 23,
    name: 'Ramo de Rosas Negras',
    category: 'decoracion',
    price: 8900,
    stock: 9,
    description:
      'Ramo de rosas artificiales oscuras para jarrones, centros de mesa y rincones góticos.',
    image: '/images/ramo-rosas.jpg',
  },

  // ---------- Accesorios ----------
  {
    id: 24,
    name: 'Máscara de Baile Veneciano',
    category: 'accesorios',
    price: 17800,
    stock: 10,
    description:
      'Antifaz veneciano negro y violeta con encaje calado y detalles dorados envejecidos.',
    image: '/images/mascara-veneciana.jpg',
  },
  {
    id: 25,
    name: 'Colmillos de Vampiro',
    category: 'accesorios',
    price: 3900,
    stock: 35,
    description:
      'Par de colmillos blancos de aspecto realista, con estuche negro para guardarlos.',
    image: '/images/colmillos.jpg',
  },
  {
    id: 26,
    name: 'Guantes Negros de Encaje',
    category: 'accesorios',
    price: 6800,
    stock: 16,
    description:
      'Par de guantes góticos de encaje negro con diseño floral y estilo vintage.',
    image: '/images/guantes-encaje.jpg',
  },
  {
    id: 27,
    name: 'Vincha de Murciélagos',
    category: 'accesorios',
    price: 5400,
    stock: 2,
    description:
      'Vincha negra de terciopelo con pequeñas alas de murciélago y detalles violetas.',
    image: '/images/vincha-murcielagos.jpg',
  },
  {
    id: 28,
    name: 'Abanico Gótico de Plumas',
    category: 'accesorios',
    price: 9400,
    stock: 8,
    description:
      'Abanico de plumas negras con mango plateado de estilo antiguo y detalles ornamentales.',
    image: '/images/abanico-plumas.jpg',
  },
  {
    id: 29,
    name: 'Set de Hebillas con Calaveras',
    category: 'accesorios',
    price: 4800,
    stock: 20,
    description:
      'Set de 4 hebillas negras para el pelo con calaveras plateadas y cristales violetas.',
    image: '/images/hebillas-calavera.jpg',
  },

  // ---------- Maquillaje ----------
  {
    id: 30,
    name: 'Paleta de Sombras Halloween',
    category: 'maquillaje',
    price: 12600,
    stock: 13,
    description:
      'Paleta de sombras en negro intenso, violeta profundo, bordó y gris ahumado, en un estuche oscuro.',
    image: '/images/paleta-sombras.jpg',
  },
  {
    id: 31,
    name: 'Kit de Pinturas Faciales',
    category: 'maquillaje',
    price: 9800,
    stock: 17,
    description:
      'Set de pinturas faciales al agua con pinceles y esponja aplicadora.',
    image: '/images/pinturas-faciales.jpg',
  },
  {
    id: 32,
    name: 'Glitter Violeta y Negro',
    category: 'maquillaje',
    price: 3500,
    stock: 28,
    description:
      'Gel con glitter para rostro, cuerpo y cabello. Se retira con agua y jabón.',
    image: '/images/glitter.jpg',
  },
  {
    id: 33,
    name: 'Set de Maquillaje de Calavera',
    category: 'maquillaje',
    price: 11900,
    stock: 8,
    description:
      'Pintura facial blanca y negra, pinceles de precisión, esponja para difuminar y tarjeta de referencia.',
    image: '/images/maquillaje-calavera.jpg',
  },
  {
    id: 34,
    name: 'Kit de Maquillaje Fluorescente',
    category: 'maquillaje',
    price: 10500,
    stock: 12,
    description:
      'Pinturas para rostro y cuerpo que brillan bajo la luz negra.',
    image: '/images/kit-fluorescente.jpg',
  },
  {
    id: 35,
    name: 'Tatuajes Temporales de Halloween',
    category: 'maquillaje',
    price: 2900,
    stock: 40,
    description:
      'Plancha de tatuajes temporales con diseños de Halloween. Se aplican con agua.',
    image: '/images/tatuajes-temporales.jpg',
  },
];