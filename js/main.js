/* ═══════════════════════════════════════════════════════════════
   NiPutaNiSanta — JavaScript principal

   Para modificar comportamientos:
   - Horóscopo API: busca "fetchHoroscope" y cambia la URL o el parsing
   - Moda/Fashion: busca "fetchFashion" y conecta tu fuente de datos real
   - Colores de tema: edita las variables en css/style.css
   - Sonidos: edita las funciones createTone() y playTone()
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── CONSTANTES ──────────────────────────────────────────── */
  const ZODIAC_SIGNS = [
    { name: 'Aries',       en: 'Aries',       emoji: '♈', dates: '21 Mar – 19 Abr' },
    { name: 'Tauro',       en: 'Taurus',       emoji: '♉', dates: '20 Abr – 20 May' },
    { name: 'Géminis',     en: 'Gemini',       emoji: '♊', dates: '21 May – 20 Jun' },
    { name: 'Cáncer',      en: 'Cancer',       emoji: '♋', dates: '21 Jun – 22 Jul' },
    { name: 'Leo',         en: 'Leo',          emoji: '♌', dates: '23 Jul – 22 Ago' },
    { name: 'Virgo',       en: 'Virgo',        emoji: '♍', dates: '23 Ago – 22 Sep' },
    { name: 'Libra',       en: 'Libra',        emoji: '♎', dates: '23 Sep – 22 Oct' },
    { name: 'Escorpio',    en: 'Scorpio',      emoji: '♏', dates: '23 Oct – 21 Nov' },
    { name: 'Sagitario',   en: 'Sagittarius',  emoji: '♐', dates: '22 Nov – 21 Dic' },
    { name: 'Capricornio', en: 'Capricorn',    emoji: '♑', dates: '22 Dic – 19 Ene' },
    { name: 'Acuario',     en: 'Aquarius',     emoji: '♒', dates: '20 Ene – 18 Feb' },
    { name: 'Piscis',      en: 'Pisces',       emoji: '♓', dates: '19 Feb – 20 Mar' },
  ];

  /* Contenido editorial de moda curado — para conectar a una API real,
     reemplaza este array con el resultado de tu fetchFashion() */
  const FASHION_CONTENT = [
    {
      emoji: '👗',
      category: 'Moda de Temporada',
      title: 'El regreso del vestido midi: elegancia sin esfuerzo para todas',
      text: 'El vestido midi vuelve a dominar las pasarelas con propuestas en tonos tierra, florales delicados y telas fluyentes que se adaptan tanto al día como a la noche.',
      gradient: 'linear-gradient(135deg, rgba(196,84,122,0.25), rgba(240,196,168,0.3))',
    },
    {
      emoji: '👟',
      category: 'Tendencias Calzado',
      title: 'Sneakers de plataforma: comodidad con actitud y mucha personalidad',
      text: 'Las zapatillas de plataforma se reinventan con colores atrevidos, materiales reciclados y colaboraciones con artistas latinoamericanas. El estilo urbano elevado.',
      gradient: 'linear-gradient(135deg, rgba(196,168,212,0.25), rgba(196,84,122,0.2))',
    },
    {
      emoji: '✨',
      category: 'Accesorios Must',
      title: 'Bolsos mini y maxi: los dos extremos que lo arrasan todo esta temporada',
      text: 'Las tendencias este año no piden punto medio: o vas con el micro bag de lujo o con el XXL tote de lona. Las NPNSLovers lo llevan con todo el estilo del mundo.',
      gradient: 'linear-gradient(135deg, rgba(240,196,168,0.3), rgba(232,213,200,0.25))',
    },
    {
      emoji: '🌸',
      category: 'Paleta de Colores',
      title: 'Colores del año: terracota, rosa polvo y verde salvia reinan esta temporada',
      text: 'La moda apuesta por tonos que evocan naturaleza y calidez. Terracota, nude, rosa pálido y verdes herbales definen el guardarropa de la mujer contemporánea.',
      gradient: 'linear-gradient(135deg, rgba(196,84,122,0.2), rgba(196,168,212,0.25))',
    },
    {
      emoji: '💎',
      category: 'Joyería & Bisutería',
      title: 'Layering de joyas: más es más cuando sabes cómo combinar piezas',
      text: 'Collares a distintas alturas, anillos apilados y aretes XXL son el secreto para transformar cualquier look básico en un statement de personalidad y estilo propio.',
      gradient: 'linear-gradient(135deg, rgba(240,196,168,0.25), rgba(196,84,122,0.2))',
    },
    {
      emoji: '🧥',
      category: 'Street Style',
      title: 'Blazer oversized: la prenda que no falla nunca, en ningún armario',
      text: 'El blazer de corte holgado sigue siendo la pieza comodín definitiva. Esta temporada llega en cuadros, terciopelo y tejidos texturizados que piden toda la atención.',
      gradient: 'linear-gradient(135deg, rgba(196,168,212,0.2), rgba(240,196,168,0.3))',
    },
  ];

  /* ─── WEB AUDIO API — Efectos de sonido ──────────────────── */
  let audioCtx = null;
  let sfxEnabled = false;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  /** Tono suave para hover / click */
  function playTone(freq = 440, duration = 0.12, type = 'sine', gainVal = 0.06) {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, ctx.currentTime + duration);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (_) { /* Silenciar errores de audio */ }
  }

  function playHover() { playTone(660, 0.08, 'sine', 0.04); }
  function playClick() { playTone(520, 0.15, 'sine', 0.07); }

  /* ─── CURSOR PERSONALIZADO ────────────────────────────────── */
  function initCursor() {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    /* Solo en dispositivos con mouse real */
    if (window.matchMedia('(hover: none)').matches) return;

    document.body.style.cursor = 'none';

    let mouse = { x: 0, y: 0 };
    let ring_pos = { x: 0, y: 0 };
    let raf;

    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.left = mouse.x + 'px';
      dot.style.top  = mouse.y + 'px';
    });

    function animateRing() {
      ring_pos.x += (mouse.x - ring_pos.x) * 0.14;
      ring_pos.y += (mouse.y - ring_pos.y) * 0.14;
      ring.style.left = ring_pos.x + 'px';
      ring.style.top  = ring_pos.y + 'px';
      raf = requestAnimationFrame(animateRing);
    }
    animateRing();

    /* Agrandar cursor sobre elementos interactivos */
    const hoverTargets = 'a, button, .topic-card, .social-card, .zodiac-sign-btn, .purpose-card, .lover-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        dot.classList.add('hovering');
        ring.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        dot.classList.remove('hovering');
        ring.classList.remove('hovering');
      }
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  /* ─── HEADER STICKY ───────────────────────────────────────── */
  function initHeader() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      /* Resaltar enlace activo según sección visible */
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) {
          current = sec.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  /* ─── MENÚ HAMBURGUESA ─────────────────────────────────────── */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    if (!hamburger || !mobileMenu) return;

    function toggleMenu() {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (isOpen) playClick();
    }

    hamburger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* Cerrar menú con Escape */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        toggleMenu();
      }
    });
  }

  /* ─── TEMA CLARO / OSCURO ─────────────────────────────────── */
  function initTheme() {
    const html = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (!toggleBtn) return;

    /* Respetar preferencia del sistema al inicio */
    const savedTheme = localStorage.getItem('npns-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    html.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('npns-theme', next);
      updateThemeIcon(next);
      playClick();
    });

    function updateThemeIcon(theme) {
      if (!icon) return;
      icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  /* ─── CONTROLES DE AUDIO ──────────────────────────────────── */
  function initAudio() {
    const sfxBtn  = document.getElementById('sfx-toggle');
    const sfxIcon = document.getElementById('sfx-icon');
    const musicBtn  = document.getElementById('music-toggle');
    const bgMusic   = document.getElementById('bg-music');

    if (sfxBtn) {
      sfxBtn.addEventListener('click', () => {
        sfxEnabled = !sfxEnabled;
        sfxBtn.classList.toggle('active', sfxEnabled);
        if (sfxIcon) {
          sfxIcon.className = sfxEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        }
        if (sfxEnabled) {
          /* Inicializar contexto de audio tras interacción del usuario */
          getAudioCtx();
          playClick();
        }
      });
    }

    if (musicBtn && bgMusic) {
      let musicPlaying = false;
      musicBtn.addEventListener('click', () => {
        if (!bgMusic.src || bgMusic.src === window.location.href) {
          /* No hay fuente de música configurada — notificar al usuario */
          showMusicNote();
          return;
        }
        if (musicPlaying) {
          bgMusic.pause();
          musicBtn.classList.remove('active');
        } else {
          bgMusic.play().catch(() => {});
          musicBtn.classList.add('active');
        }
        musicPlaying = !musicPlaying;
        playClick();
      });
    }

    /* Agregar sonidos de hover a botones importantes */
    document.addEventListener('mouseover', (e) => {
      const btn = e.target.closest('.btn-primary, .btn-secondary, .zodiac-sign-btn');
      if (btn) playHover();
    }, { passive: true });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-primary, .btn-secondary, .zodiac-sign-btn, .social-card');
      if (btn) playClick();
    }, { passive: true });
  }

  function showMusicNote() {
    const note = document.createElement('div');
    note.style.cssText = `
      position:fixed; bottom:5rem; right:1.5rem; z-index:999;
      background:var(--bg-card); border:1px solid var(--border-color);
      border-radius:12px; padding:0.75rem 1rem; font-size:0.8rem;
      color:var(--text-muted); box-shadow:var(--shadow-md);
      max-width:220px; line-height:1.5;
    `;
    note.textContent = 'Para agregar música, coloca tu archivo .mp3 en /assets/music.mp3 y actualiza el src en index.html';
    document.body.appendChild(note);
    setTimeout(() => note.remove(), 4000);
  }

  /* ─── ANIMACIONES AL HACER SCROLL ────────────────────────── */
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          /* Una vez visible, dejar de observar para performance */
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-section, .reveal-item').forEach(el => {
      observer.observe(el);
    });
  }

  /* ─── PARTÍCULAS DEL HERO ─────────────────────────────────── */
  function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    /* Respetar preferencia de movimiento reducido */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const count = window.innerWidth < 768 ? 10 : 22;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: ${-5 + Math.random() * 10}%;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        animation-duration: ${8 + Math.random() * 14}s;
        animation-delay: ${-Math.random() * 12}s;
        opacity: ${0.2 + Math.random() * 0.4};
      `;
      container.appendChild(p);
    }
  }

  /* ─── FECHA ACTUAL ────────────────────────────────────────── */
  function setDates() {
    const today = new Date();
    const optsLong = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const optsShort = { day: 'numeric', month: 'long', year: 'numeric' };
    const locale = 'es-ES';

    const horoscopeDate = document.getElementById('horoscope-date');
    if (horoscopeDate) {
      horoscopeDate.textContent = today.toLocaleDateString(locale, optsLong);
    }

    const fashionDate = document.getElementById('fashion-date');
    if (fashionDate) {
      fashionDate.textContent = today.toLocaleDateString(locale, optsShort);
    }

    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
      footerYear.textContent = today.getFullYear();
    }
  }

  /* ─── GRID DE SIGNOS DEL ZODIACO ─────────────────────────── */
  function initZodiacGrid() {
    const grid = document.getElementById('zodiac-grid');
    if (!grid) return;

    ZODIAC_SIGNS.forEach((sign) => {
      const btn = document.createElement('button');
      btn.className = 'zodiac-sign-btn';
      btn.setAttribute('aria-label', `Ver horóscopo de ${sign.name}`);
      btn.innerHTML = `
        <span class="zodiac-emoji" aria-hidden="true">${sign.emoji}</span>
        <span class="zodiac-name">${sign.name}</span>
      `;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.zodiac-sign-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        fetchHoroscope(sign);
        playClick();
      });
      grid.appendChild(btn);
    });
  }

  /* ─── HORÓSCOPO — Fetch desde API pública ───────────────────
     API: https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily
     Para cambiar la fuente: modifica la URL y el parseado del response abajo
  ─────────────────────────────────────────────────────────────── */
  async function fetchHoroscope(sign) {
    const panel = document.getElementById('horoscope-panel');
    if (!panel) return;

    /* Mostrar skeleton de carga */
    panel.innerHTML = `
      <div class="horoscope-skeleton" aria-label="Cargando horóscopo de ${sign.name}...">
        <div class="sk-line short" style="margin-bottom:1rem"></div>
        <div class="sk-line medium"></div>
        <div class="sk-line long"></div>
        <div class="sk-line medium" style="margin-top:0.4rem"></div>
        <div class="sk-line long"></div>
        <div class="sk-line short" style="margin-top:0.4rem"></div>
      </div>
    `;

    try {
      /* La API soporta: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces */
      const url = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign.en}&day=today`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });

      if (!res.ok) throw new Error('API no disponible');
      const json = await res.json();

      const data = json.data;
      if (!data || !data.horoscope_data) throw new Error('Sin datos');

      /* Traducir el texto al español con un mensaje introductorio */
      const horoscopeText = data.horoscope_data;
      const dateStr = data.date || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

      panel.innerHTML = `
        <div class="horoscope-result" role="article" aria-label="Horóscopo de ${sign.name}">
          <div class="horoscope-sign-big">
            <span class="horoscope-emoji-big" aria-hidden="true">${sign.emoji}</span>
            <span class="horoscope-sign-name">${sign.name}</span>
            <small style="font-size:0.7rem;color:var(--text-muted)">${sign.dates}</small>
          </div>
          <div class="horoscope-text-area">
            <div class="horoscope-date-tag">
              <i class="fa-solid fa-calendar" aria-hidden="true"></i>
              ${dateStr}
            </div>
            <h4>Tu mensaje del universo</h4>
            <p>${horoscopeText}</p>
            <p style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted);font-style:italic">
              * Contenido en inglés desde fuente astrológica internacional. Próximamente en español.
            </p>
          </div>
        </div>
      `;
    } catch (_) {
      /* Fallback elegante si la API no responde */
      panel.innerHTML = renderHoroscopeFallback(sign);
    }
  }

  /** Contenido de respaldo cuando la API no está disponible */
  function renderHoroscopeFallback(sign) {
    const fallbacks = {
      'Aries':       'El fuego que te caracteriza se aviva hoy. Es momento de actuar con valentía y confiar en tu instinto. La energía del día te invita a dar ese primer paso que llevas tiempo posponiendo.',
      'Tauro':       'La paciencia siempre ha sido tu mejor aliada. Hoy el universo te recompensa por tu constancia. Algo que construiste con cariño empieza a dar sus frutos. Disfruta de la estabilidad que has ganado.',
      'Géminis':     'Tu mente brillante encuentra soluciones donde otros solo ven problemas. Hoy es un día perfecto para las conversaciones importantes y para compartir tus ideas. El mundo necesita tu perspectiva única.',
      'Cáncer':      'Tus emociones son tu superpoder, no tu debilidad. Hoy te invitan a confiar en lo que sientes y a cuidarte con la misma energía con la que cuidas a los demás. Mereces ese amor también.',
      'Leo':         'Tu luz no compite con la de nadie. Hoy brillas con propósito y las personas a tu alrededor lo notan. Es un buen día para liderar con el corazón y recordar que ser tú misma es tu mayor fortaleza.',
      'Virgo':       'Tu atención al detalle hoy marca la diferencia. Un pequeño ajuste puede transformar algo ordinario en algo extraordinario. Confía en tu criterio y en ese instinto perfeccionista que tanto te define.',
      'Libra':       'El equilibrio que buscas empieza por dentro. Hoy el universo te recuerda que tu bienestar importa tanto como el de los demás. Date el permiso de elegirte a ti misma sin culpa.',
      'Escorpio':    'Tu profundidad emocional te permite ver lo que otros no ven. Hoy una verdad importante sale a la luz y tú estás lista para manejarla con la fortaleza que te caracteriza. Confía en tu intuición.',
      'Sagitario':   'La aventura no siempre está en los lugares, a veces está en las ideas. Hoy tu mente explora nuevos horizontes y encuentras inspiración en lo cotidiano. Abre los ojos: la vida está llena de señales.',
      'Capricornio': 'Tu determinación es admirable y el universo lo reconoce. Hoy un esfuerzo que hiciste con convicción empieza a mostrar resultados. No pares: estás más cerca de lo que crees.',
      'Acuario':     'Tu visión del mundo es un regalo para quienes te rodean. Hoy comparte tus ideas, aunque suenen diferentes: la originalidad es lo que mueve al mundo hacia adelante. Tú eres parte del cambio.',
      'Piscis':      'Tu sensibilidad es una forma de sabiduría. Hoy el universo te habla a través de los pequeños detalles: una conversación, una canción, una mirada. Escucha. Las respuestas ya están dentro de ti.',
    };

    const text = fallbacks[sign.en] || 'El universo tiene un mensaje especial para ti hoy. Confía en tu intuición, cuídate con amor y recuerda que cada día es una nueva oportunidad para ser tu mejor versión.';

    return `
      <div class="horoscope-result" role="article" aria-label="Horóscopo de ${sign.name}">
        <div class="horoscope-sign-big">
          <span class="horoscope-emoji-big" aria-hidden="true">${sign.emoji}</span>
          <span class="horoscope-sign-name">${sign.name}</span>
          <small style="font-size:0.7rem;color:var(--text-muted)">${sign.dates}</small>
        </div>
        <div class="horoscope-text-area">
          <div class="horoscope-date-tag">
            <i class="fa-solid fa-stars" aria-hidden="true"></i>
            Mensaje del día
          </div>
          <h4>Tu mensaje del universo</h4>
          <p>${text}</p>
          <p style="margin-top:1rem;font-size:0.78rem;color:var(--text-muted)">
            <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
            Contenido editorial inspiracional. Para datos en tiempo real, conecta una API astrológica en js/main.js → fetchHoroscope()
          </p>
        </div>
      </div>
    `;
  }

  /* ─── SECCIÓN DE MODA ───────────────────────────────────────
     Para conectar una fuente de datos real:
     1. Crea una Netlify Function en netlify/functions/fashion.js
     2. En la función, consume tu API o RSS de moda (ej: NewsAPI, GNews, RSS)
     3. Devuelve un JSON con el formato { articles: [{emoji, category, title, text, gradient}] }
     4. Cambia la URL del fetch abajo a '/.netlify/functions/fashion'
  ─────────────────────────────────────────────────────────────── */
  function renderFashion() {
    const grid = document.getElementById('fashion-grid');
    if (!grid) return;

    const html = FASHION_CONTENT.map((item, i) => `
      <article class="fashion-card" style="animation-delay:${i * 0.1}s">
        <div class="fashion-card-img" style="background:${item.gradient}" aria-hidden="true">
          <span style="font-size:3.5rem;z-index:1;position:relative">${item.emoji}</span>
        </div>
        <div class="fashion-card-body">
          <p class="fashion-card-cat">${item.category}</p>
          <h3 class="fashion-card-title">${item.title}</h3>
          <p class="fashion-card-text">${item.text}</p>
          <p class="fashion-card-date">NPNSLovers · Temporada actual</p>
        </div>
      </article>
    `).join('');

    grid.innerHTML = html;
  }

  /* ─── SMOOTH SCROLL PARA NAVEGACIÓN ──────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        playClick();
      });
    });
  }

  /* ─── EFECTO DE PARALLAX LIGERO EN HERO ──────────────────── */
  function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const orbs = document.querySelectorAll('.hero-orb');

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = 0.05 + i * 0.03;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, { passive: true });
  }

  /* ─── HIGHLIGHT DE FRASES DEL HERO AL CARGAR ─────────────── */
  function initHeroHighlight() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    /* La animación ya está en CSS con animation-delay por cada línea */
  }

  /* ─── INICIALIZACIÓN ──────────────────────────────────────── */
  function init() {
    initCursor();
    initHeader();
    initMobileMenu();
    initTheme();
    initAudio();
    initScrollReveal();
    initParticles();
    setDates();
    initZodiacGrid();
    renderFashion();
    initSmoothScroll();
    initParallax();
    initHeroHighlight();
  }

  /* Esperar a que el DOM esté listo */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
