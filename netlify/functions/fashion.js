/* ============================================================
   netlify/functions/fashion.js
   Netlify Function — proxy seguro para GNews API (moda)

   SETUP (solo una vez):
   1. Ve a https://gnews.io y crea una cuenta gratuita.
   2. Copia tu API key.
   3. En Netlify → Site configuration → Environment variables
      añade:  GNEWS_API_KEY = <tu_api_key>
   4. Haz deploy. La función estará en /.netlify/functions/fashion
   ============================================================ */

exports.handler = async function (event, context) {
  const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  const API_KEY = process.env.GNEWS_API_KEY;

  // Si aún no hay API key configurada, devolvemos el contenido estático
  // para que el sitio no quede roto mientras se configura.
  if (!API_KEY) {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ articles: getFallbackArticles(), source: 'fallback' }),
    };
  }

  // Categorías de moda que rotamos en cada request
  const QUERIES = [
    'moda mujer 2025',
    'tendencias ropa',
    'fashion week',
    'estilo outfit',
    'accesorios moda',
  ];
  const query = QUERIES[Math.floor(Math.random() * QUERIES.length)];

  const url =
    `https://gnews.io/api/v4/search` +
    `?q=${encodeURIComponent(query)}` +
    `&lang=es` +
    `&country=mx` +
    `&max=6` +
    `&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GNews error: ${res.status}`);

    const data = await res.json();
    const articles = (data.articles || []).map(mapArticle);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ articles, source: 'gnews' }),
    };
  } catch (err) {
    console.error('fashion function error:', err.message);
    // Fallback con contenido curado si la API falla
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ articles: getFallbackArticles(), source: 'fallback' }),
    };
  }
};

// ── Mapea un artículo de GNews al formato que espera el frontend ──
function mapArticle(a, i) {
  const EMOJIS = ['👗', '👟', '✨', '🌸', '💎', '🧥', '👜', '💄', '🎀', '🪞'];
  const GRADIENTS = [
    'linear-gradient(135deg, rgba(196,84,122,0.25), rgba(240,196,168,0.3))',
    'linear-gradient(135deg, rgba(100,149,237,0.2), rgba(135,206,235,0.3))',
    'linear-gradient(135deg, rgba(144,238,144,0.2), rgba(0,128,128,0.25))',
    'linear-gradient(135deg, rgba(255,182,193,0.3), rgba(255,20,147,0.15))',
    'linear-gradient(135deg, rgba(218,165,32,0.2), rgba(255,215,0,0.25))',
    'linear-gradient(135deg, rgba(147,112,219,0.25), rgba(216,191,216,0.3))',
  ];

  const publishedAt = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString('es-MX', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  return {
    emoji: EMOJIS[i % EMOJIS.length],
    category: a.source?.name || 'Tendencias',
    title: a.title || 'Tendencia del momento',
    text: a.description || a.content || 'Lee más sobre esta tendencia.',
    gradient: GRADIENTS[i % GRADIENTS.length],
    url: a.url || null,
    image: a.image || null,
    date: publishedAt,
  };
}

// ── Contenido curado de respaldo (mismo que FASHION_CONTENT del frontend) ──
function getFallbackArticles() {
  return [
    {
      emoji: '👗',
      category: 'Moda de Temporada',
      title: 'El regreso del vestido midi: elegancia sin esfuerzo para todas',
      text: 'El vestido midi vuelve a dominar las pasarelas con propuestas en tonos tierra, florales delicados y telas fluyentes que se adaptan tanto al día como a la noche.',
      gradient: 'linear-gradient(135deg, rgba(196,84,122,0.25), rgba(240,196,168,0.3))',
      url: null,
      image: null,
      date: '',
    },
    {
      emoji: '👟',
      category: 'Tendencias Calzado',
      title: 'Sneakers de plataforma: comodidad y altura en un solo look',
      text: 'Las plataformas de suela gruesa conquistaron Instagram y no piensan irse. Te mostramos los mejores modelos que combinan con todo.',
      gradient: 'linear-gradient(135deg, rgba(100,149,237,0.2), rgba(135,206,235,0.3))',
      url: null,
      image: null,
      date: '',
    },
    {
      emoji: '✨',
      category: 'Accesorios Must',
      title: 'Bolsos mini y maxi: los dos extremos que arrasan esta temporada',
      text: 'Del micro bag al tote XL, la moda no entiende de términos medios. Descubre cuál se adapta mejor a tu estilo diario.',
      gradient: 'linear-gradient(135deg, rgba(144,238,144,0.2), rgba(0,128,128,0.25))',
      url: null,
      image: null,
      date: '',
    },
    {
      emoji: '🌸',
      category: 'Paleta de Colores',
      title: 'Colores del año: del rosa polvo al verde menta, ¿cuál te va mejor?',
      text: 'Los tonos pastel volvieron con fuerza y los terrosos nunca se fueron. Te ayudamos a descubrir la paleta que mejor complementa tu tono de piel.',
      gradient: 'linear-gradient(135deg, rgba(255,182,193,0.3), rgba(255,20,147,0.15))',
      url: null,
      image: null,
      date: '',
    },
    {
      emoji: '💎',
      category: 'Joyería & Bisutería',
      title: 'Layering de joyas: el arte de acumular sin exceso',
      text: 'Mezclar metales, piezas vintage con modernas y collares de diferentes largos es la tendencia que domina en todas las plataformas.',
      gradient: 'linear-gradient(135deg, rgba(218,165,32,0.2), rgba(255,215,0,0.25))',
      url: null,
      image: null,
      date: '',
    },
    {
      emoji: '🧥',
      category: 'Street Style',
      title: 'Blazer oversized: la prenda que transforma cualquier outfit',
      text: 'Un blazer XL en color neutro es la inversión del año. Lo llevamos encima de vestidos, con jeans rotos o sobre un básico de algodón.',
      gradient: 'linear-gradient(135deg, rgba(147,112,219,0.25), rgba(216,191,216,0.3))',
      url: null,
      image: null,
      date: '',
    },
  ];
}
