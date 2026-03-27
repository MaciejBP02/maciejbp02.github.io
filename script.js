/* ════════════════════════════════════════════════════════════════
   ACADEMIC PORTFOLIO — script.js
   Obsługuje:
     • Przełączanie motywów (jasny / ciemny)
     • Przełączanie języków (PL / EN)
     • Formularz kontaktowy (mailto)
     • Aktywny link nawigacji przy scrollu
   ════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. THEME TOGGLE ──────────────────────────────────────── */
  const body        = document.body;
  const themeBtn    = document.getElementById('themeToggle');
  const THEME_KEY   = 'portfolio-theme';

  const savedTheme  = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const next = body.classList.contains('theme-light') ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  function applyTheme(theme) {
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(`theme-${theme}`);
    themeBtn.querySelector('.theme-icon').textContent = theme === 'light' ? '◐' : '○';
    themeBtn.title = theme === 'light' ? 'Przełącz na ciemny motyw' : 'Switch to light theme';
  }

  /* ── 2. LANGUAGE TOGGLE ───────────────────────────────────── */
  const LANG_KEY  = 'portfolio-lang';
  const btnPl     = document.getElementById('btnPl');
  const btnEn     = document.getElementById('btnEn');

  const savedLang = localStorage.getItem(LANG_KEY) || 'pl';
  applyLang(savedLang);

  btnPl.addEventListener('click', () => { applyLang('pl'); localStorage.setItem(LANG_KEY, 'pl'); });
  btnEn.addEventListener('click', () => { applyLang('en'); localStorage.setItem(LANG_KEY, 'en'); });

  function applyLang(lang) {
    /* Przełącz klasę na <html> i <body> */
    document.documentElement.lang = lang;
    body.classList.remove('lang-pl', 'lang-en');
    body.classList.add(`lang-${lang}`);

    /* Aktywne przyciski */
    btnPl.classList.toggle('active', lang === 'pl');
    btnEn.classList.toggle('active', lang === 'en');

    /* Zaktualizuj wszystkie elementy z data-pl / data-en */
    document.querySelectorAll('[data-pl][data-en]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text !== null) {
        /* Użyj innerHTML aby obsłużyć <br /> w atrybutach */
        if (text.includes('<br')) {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      }
    });

    /* Zaktualizuj <title> strony */
    document.title = lang === 'pl'
      ? 'MP — Portfolio'
      : 'MP — Academic Portfolio';

    /* Zaktualizuj placeholder przycisku wysyłki */
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.textContent = lang === 'pl' ? 'Wyślij wiadomość' : 'Send message';
    }
  }

  /* ── 3. CONTACT FORM → MAILTO ────────────────────────────── */
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const subject = form.querySelector('#subject').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        const lang = body.classList.contains('lang-en') ? 'en' : 'pl';
        const msg = lang === 'pl'
          ? 'Proszę wypełnić wymagane pola: imię, e-mail i wiadomość.'
          : 'Please fill in the required fields: name, e-mail and message.';
        alert(msg);
        return;
      }

      const recipient = 'imię.nazwisko@student.uj.edu.pl';   /* ← zmień na swój adres */
      const body_text = `Imię / Name: ${name}\nE-mail: ${email}\n\n${message}`;
      const mailto = `mailto:${recipient}`
        + `?subject=${encodeURIComponent(subject || 'Wiadomość ze strony / Message from website')}`
        + `&body=${encodeURIComponent(body_text)}`;

      window.location.href = mailto;
    });
  }

  /* ── 4. ACTIVE NAV LINK ON SCROLL ────────────────────────── */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

  if ('IntersectionObserver' in window && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'nav-active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  /* ── 5. FADE-IN SECTIONS ON SCROLL ───────────────────────── */
  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.section, .card, .pub-item, .gallery-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      fadeObserver.observe(el);
    });

    /* Kiedy element jest widoczny – odkryj go */
    document.addEventListener('scroll', () => {}, { passive: true });
  }

});

/* Dodaj styl dla .visible do arkusza JS (nie wymaga edycji CSS) */
const style = document.createElement('style');
style.textContent = `
  .section.visible,
  .card.visible,
  .pub-item.visible,
  .gallery-item.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  .site-nav a.nav-active {
    color: var(--accent);
  }
`;
document.head.appendChild(style);
