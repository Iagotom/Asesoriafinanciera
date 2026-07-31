/* =========================================================
   Núcleo Asesoría Financiera — JavaScript principal
   Sin dependencias externas.
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const eur = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  });

  /* ---------- 1. Tema claro / oscuro ---------- */
  const THEME_KEY = 'nucleo-theme';

  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (_) { return null; }
  }

  function applyTheme(theme) {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function currentTheme() {
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(storedTheme());

  const themeToggle = $('#theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (_) { /* modo privado */ }
    });
  }

  /* ---------- 2. Navegación móvil ---------- */
  const nav = $('#nav');
  const navToggle = $('#nav-toggle');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    });

    $$('a', nav).forEach(link => link.addEventListener('click', closeNav));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeNav();
    });
  }

  /* ---------- 3. Cabecera al hacer scroll ---------- */
  const header = $('#site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 4. Enlace activo según la sección visible ---------- */
  const sections = $$('main section[id]');
  const navLinks = new Map();
  $$('.nav-list a[href^="#"]').forEach(a => navLinks.set(a.getAttribute('href').slice(1), a));

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const link = navLinks.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(s => spy.observe(s));
  }

  /* ---------- 5. Animación de entrada ----------
     Se comprueba la posición en lugar de usar IntersectionObserver: los saltos
     por ancla (#faq, #contacto…) se saltan secciones enteras sin generar un
     evento de intersección, y esos elementos se quedarían invisibles. Aquí se
     revela todo lo que quede por encima del borde inferior del viewport,
     incluido lo que ya se ha dejado atrás. */
  const revealTargets = $$('.card, .step, .values li, .faq-item, .about-quote, .hero-card, .calc-controls, .calc-results');

  if (!reducedMotion && revealTargets.length) {
    let pending = revealTargets;

    pending.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 70}ms`;
    });

    const sweep = () => {
      const limit = window.innerHeight * 0.92;
      pending = pending.filter(el => {
        if (el.getBoundingClientRect().top >= limit) return true;
        el.classList.add('is-visible');
        return false;
      });
      if (!pending.length) {
        window.removeEventListener('scroll', onScrollReveal);
        window.removeEventListener('resize', onScrollReveal);
      }
    };

    let ticking = false;
    const onScrollReveal = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; sweep(); });
    };

    window.addEventListener('scroll', onScrollReveal, { passive: true });
    window.addEventListener('resize', onScrollReveal);
    sweep();
  }

  /* ---------- 6. Contadores animados ---------- */
  function animateCount(el) {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const fmt = n => prefix + Math.round(n).toLocaleString('es-ES') + suffix;

    if (reducedMotion || target === 0) {
      el.textContent = fmt(target);
      return;
    }

    const duration = 1400;
    const start = performance.now();

    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Mismo criterio de posición que la animación de entrada, por el mismo
  // motivo: un salto por ancla dejaría los contadores congelados en «0».
  let pendingCounters = $$('[data-count]');

  if (pendingCounters.length) {
    const sweepCounters = () => {
      const limit = window.innerHeight * 0.9;
      pendingCounters = pendingCounters.filter(el => {
        if (el.getBoundingClientRect().top >= limit) return true;
        animateCount(el);
        return false;
      });
      if (!pendingCounters.length) {
        window.removeEventListener('scroll', onScrollCount);
        window.removeEventListener('resize', onScrollCount);
      }
    };

    let countTicking = false;
    const onScrollCount = () => {
      if (countTicking) return;
      countTicking = true;
      requestAnimationFrame(() => { countTicking = false; sweepCounters(); });
    };

    window.addEventListener('scroll', onScrollCount, { passive: true });
    window.addEventListener('resize', onScrollCount);
    sweepCounters();
  }

  /* ---------- 7. Calculadora de interés compuesto ---------- */
  const calcForm = $('#calc-form');

  if (calcForm) {
    const els = {
      initial:  $('#calc-initial'),
      monthly:  $('#calc-monthly'),
      years:    $('#calc-years'),
      rate:     $('#calc-rate'),
      outYears: $('#out-years'),
      outRate:  $('#out-rate'),
      total:    $('#calc-total'),
      contrib:  $('#calc-contrib'),
      interest: $('#calc-interest'),
      barC:     $('#bar-contrib'),
      barI:     $('#bar-interest')
    };

    // Lee un input numérico acotándolo a su rango declarado.
    function num(input, fallback) {
      const value = parseFloat(input.value);
      if (!Number.isFinite(value)) return fallback;
      const min = parseFloat(input.min);
      const max = parseFloat(input.max);
      let out = value;
      if (Number.isFinite(min)) out = Math.max(min, out);
      if (Number.isFinite(max)) out = Math.min(max, out);
      return out;
    }

    /**
     * Valor futuro con capitalización mensual y aportaciones
     * a principio de cada mes (anualidad anticipada).
     */
    function futureValue(initial, monthly, years, annualRate) {
      const n = Math.round(years * 12);
      const i = annualRate / 100 / 12;

      if (i === 0) return initial + monthly * n;

      const growth = Math.pow(1 + i, n);
      return initial * growth + monthly * ((growth - 1) / i) * (1 + i);
    }

    function update() {
      const initial = num(els.initial, 0);
      const monthly = num(els.monthly, 0);
      const years   = num(els.years, 20);
      const rate    = num(els.rate, 6);

      els.outYears.textContent = years === 1 ? '1 año' : `${years} años`;
      els.outRate.textContent  = `${rate.toFixed(1).replace('.', ',')} %`;

      const total    = futureValue(initial, monthly, years, rate);
      const contrib  = initial + monthly * Math.round(years * 12);
      const interest = Math.max(total - contrib, 0);

      els.total.textContent    = eur.format(total);
      els.contrib.textContent  = eur.format(contrib);
      els.interest.textContent = eur.format(interest);

      const max = Math.max(total, 1);
      els.barC.style.width = `${(contrib / max) * 100}%`;
      els.barI.style.width = `${(interest / max) * 100}%`;
    }

    calcForm.addEventListener('input', update);
    calcForm.addEventListener('submit', e => e.preventDefault());
    update();
  }

  /* ---------- 8. Formulario de contacto ---------- */
  const contactForm = $('#contact-form');

  if (contactForm) {
    const status = $('#form-status');

    const rules = {
      name:    v => v.trim().length >= 2 || 'Indica tu nombre.',
      email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Introduce un correo electrónico válido.',
      phone:   v => v.trim() === '' || /^[+\d][\d\s().-]{6,}$/.test(v.trim()) || 'El teléfono no parece válido.',
      message: v => v.trim().length >= 10 || 'Cuéntanos algo más (mínimo 10 caracteres).',
      privacy: (_, el) => el.checked || 'Debes aceptar la política de privacidad.'
    };

    function setError(field, message) {
      const input = $(`#${field}`);
      const box = $(`#err-${field}`);
      if (!input || !box) return;

      if (message) {
        input.setAttribute('aria-invalid', 'true');
        box.textContent = message;
        box.hidden = false;
      } else {
        input.removeAttribute('aria-invalid');
        box.textContent = '';
        box.hidden = true;
      }
    }

    function validateField(field) {
      const input = $(`#${field}`);
      if (!input) return true;
      const result = rules[field](input.value, input);
      setError(field, result === true ? '' : result);
      return result === true;
    }

    Object.keys(rules).forEach(field => {
      const input = $(`#${field}`);
      if (!input) return;
      input.addEventListener('blur', () => validateField(field));
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });

    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const ok = Object.keys(rules).map(validateField).every(Boolean);

      if (!ok) {
        status.textContent = 'Revisa los campos marcados antes de enviar.';
        status.className = 'form-status is-error';
        const firstBad = $('[aria-invalid="true"]', contactForm);
        if (firstBad) firstBad.focus();
        return;
      }

      // TODO: conectar con el backend o servicio de formularios.
      // Sustituye este bloque por un fetch() al endpoint real, p. ej.:
      //   await fetch('/api/contacto', { method: 'POST', body: new FormData(contactForm) });
      status.textContent = 'Formulario válido. Falta conectar el envío al servidor.';
      status.className = 'form-status is-ok';
    });
  }

  /* ---------- 9. Año en el pie ---------- */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
