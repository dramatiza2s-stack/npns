# NiPutaNiSanta — Sitio oficial de la comunidad NPNSLovers

Landing page informativa de una sola página para la comunidad digital femenina **NiPutaNiSanta**, diseñada para publicarse en Netlify.

## Qué es este proyecto

Sitio web editorial y moderno para presentar la comunidad NPNSLovers: sus valores, contenido, redes sociales y documentos legales. Preparado para monetización futura con Google AdSense.

## Tecnologías

- **HTML5 semántico** — estructura accesible con roles ARIA
- **CSS3 puro** — variables, animaciones, glassmorphism, responsive sin frameworks
- **JavaScript vanilla** — sin dependencias externas
- **Fuentes:** Cormorant Garamond (títulos) + DM Sans (cuerpo) via Google Fonts
- **Iconos:** Font Awesome 6 CDN
- **Hosting:** Netlify (CDN estático)

## Estructura

```
/
├── index.html              # Página principal (one-page)
├── netlify.toml            # Configuración de Netlify
├── css/
│   └── style.css           # Todos los estilos
├── js/
│   └── main.js             # JavaScript funcional
└── legal/
    ├── privacidad.html         # Política de privacidad
    └── propiedad-intelectual.html  # Derechos de autoría
```

## Correr localmente

```bash
# Con la CLI de Netlify (recomendado — emula todas las funciones de Netlify)
netlify dev --port 8889

# O simplemente abre index.html en tu navegador
open index.html
```

## Personalización

### Cambiar redes sociales
Busca en `index.html` los enlaces de TikTok (`@niputa_nisantaes`) y Facebook para actualizarlos.

### Agregar música de fondo
Coloca tu archivo `.mp3` en `/assets/music.mp3` y actualiza el `<audio>` en `index.html`:
```html
<source src="/assets/music.mp3" type="audio/mpeg">
```

### Conectar horóscopo real
La función `fetchHoroscope()` en `js/main.js` ya consume la API pública `horoscope-app-api.vercel.app`. Si quieres cambiarla, edita esa función.

### Conectar moda/fashion con API real
Ver comentarios en `js/main.js` en la función `renderFashion()` y en la sección de moda en `index.html`. Pasos para usar NewsAPI o GNews con una Netlify Function están documentados allí.

### Activar Google AdSense
Busca los tres bloques `.ad-zone` en `index.html` y reemplaza el contenido de `.ad-placeholder` con el código de script que provee Google AdSense tras la aprobación.

### Actualizar documentos legales
Edita `/legal/privacidad.html` y `/legal/propiedad-intelectual.html` directamente. Los documentos están marcados con una nota recordando adaptarlos con un profesional legal.
