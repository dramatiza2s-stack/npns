# AGENTS.md — Guía de arquitectura para agentes de IA

## Tipo de proyecto

Sitio web estático de una sola página (SPA sin framework). Sin build step, sin bundler, sin React/Vue. HTML + CSS + JS vanilla servidos directamente por Netlify CDN.

## Estructura de archivos clave

| Archivo | Rol |
|---|---|
| `index.html` | Única página — contiene toda la estructura HTML con 10 secciones |
| `css/style.css` | Todos los estilos — variables CSS, componentes, responsivo, dark mode |
| `js/main.js` | Toda la lógica JS — cursor, tema, menú, audio, horóscopo, moda, animaciones |
| `netlify.toml` | Redirects y headers de seguridad |
| `legal/privacidad.html` | Documento legal standalone (no hereda CSS principal) |
| `legal/propiedad-intelectual.html` | Documento legal standalone |

## Convenciones de código

### CSS
- Variables de diseño en `:root` y `[data-theme="dark"]` al inicio del archivo
- Orden de secciones sigue el orden visual de la página
- Media queries agrupadas al final del archivo
- Clases BEM-ish: `.section-about`, `.topic-card`, `.topic-icon`, etc.
- Animaciones con `@keyframes` nombradas descriptivamente

### JavaScript
- Módulo IIFE `(function() { ... })()` — sin globals expuestos
- Una función por responsabilidad con nombres `initX()` o `fetchX()`
- Todos los `init*()` llamados desde `init()` al final
- Comentarios en castellano con bloques de `═══` para secciones
- Los comentarios con `Para cambiar X:` son instrucciones para editores futuros

### HTML
- Secciones identificadas con `id` para navegación y anclas
- Comentarios tipo `═══ SECCIÓN N — NOMBRE ═══` delimitan cada bloque
- `aria-label`, `role`, `aria-live` donde son necesarios para accesibilidad

## Funcionalidades dinámicas

### Horóscopo
- Función: `fetchHoroscope(sign)` en `js/main.js`
- API: `horoscope-app-api.vercel.app/api/v1/get-horoscope/daily`
- Fallback: objeto `ZODIAC_SIGNS` con textos editoriales en español
- Panel: `#horoscope-panel` con estados loading, result, fallback

### Moda / Fashion
- Función: `renderFashion()` en `js/main.js`
- Fuente: array `FASHION_CONTENT` hardcodeado (contenido curado)
- Para conectar API real: ver comentarios en la función y en el HTML de la sección

### Dark mode
- Toggle via atributo `data-theme` en `<html>`
- Persistido en `localStorage` bajo la clave `npns-theme`
- Variables CSS semánticas en `[data-theme="dark"]` sobreescriben las de `:root`

### Audio
- Sonidos SFX: Web Audio API, ningún archivo externo necesario
- Música: `<audio id="bg-music">` requiere un `src` configurado manualmente
- Activación requiere interacción del usuario (buenas prácticas de browser)

## Espacios AdSense

Hay 3 bloques `.ad-zone` en `index.html`:
1. Después del hero (horizontal)
2. Entre contenido y section-lovers (horizontal)  
3. Antes del footer (horizontal)

Para activar: reemplazar el contenido de `.ad-placeholder` con el snippet de Google AdSense.

## SEO

- `<title>`, `<meta description>`, Open Graph y Twitter Card en `<head>`
- `<link rel="canonical">` con URL de producción
- Schema.org `Organization` en JSON-LD al final del `<head>`
- Headings correctamente jerarquizados (h1 en hero, h2 en secciones, h3 en cards)
- Texto real, no lorem ipsum

## Decisiones de diseño no obvias

- **Cormorant Garamond** para títulos: evoca editorial de moda de lujo, muy diferente al genérico Inter/Roboto
- **Cursor personalizado** solo en `(hover: hover) and (pointer: fine)` — no afecta touch/mobile
- **Partículas del hero** respetan `prefers-reduced-motion`
- **Orbs parallax** usan `transform` (no `top/left`) para performance
- **Floating cards del hero** ocultas en mobile (<1024px) para no sobrecargar la lectura
- **`body { cursor: none }`** se aplica desde JS solo cuando el cursor custom está listo
- Las tarjetas `.float-card` usan `backdrop-filter` que puede no funcionar en Firefox antiguo — aceptado como progressive enhancement
