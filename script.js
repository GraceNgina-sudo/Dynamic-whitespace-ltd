(() => {
  'use strict';

  // Form: only block submit when invalid so Netlify can handle valid submits
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.classList.add('was-validated');
        return;
      }
      // allow native submit when valid (Netlify will handle it)
    });
  }

  async function loadLanguage(lang) {
    try {
      const res = await fetch(`Lang/${lang}.json`);
      if (!res.ok) throw new Error(`Language file Lang/${lang}.json not found (${res.status})`);
      const translations = await res.json();

      // Translate elements (textContent or innerHTML when marked)
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        const txt = translations[key];
        if (txt === undefined) return;

        // Inputs/Textareas: set value or placeholder
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.hasAttribute('data-i18n-value')) el.value = txt;
          else el.setAttribute('placeholder', txt);
          return;
        }

        // Allow HTML when explicitly requested
        if (el.hasAttribute('data-i18n-html')) el.innerHTML = txt;
        else el.textContent = txt;
      });

      // Explicit placeholders
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (!key) return;
        const txt = translations[key];
        if (txt !== undefined) el.setAttribute('placeholder', txt);
      });

      // Explicit values
      document.querySelectorAll('[data-i18n-value]').forEach(el => {
        const key = el.getAttribute('data-i18n-value');
        if (!key) return;
        const txt = translations[key];
        if (txt !== undefined) el.value = txt;
      });

      // Title and meta
      if (translations['site_title']) document.title = translations['site_title'];
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && translations['meta_description']) metaDesc.setAttribute('content', translations['meta_description']);

      // Mark active language buttons
      document.querySelectorAll('.lang-option').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });

    } catch (err) {
      console.error('Error loading language file:', err);
    }
  }

  // initialize language from saved choice or default
  const saved = localStorage.getItem('site_lang') || 'en';
  loadLanguage(saved);

  // wire up language buttons
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      if (!lang) return;
      localStorage.setItem('site_lang', lang);
      loadLanguage(lang);
    });
  });

})();