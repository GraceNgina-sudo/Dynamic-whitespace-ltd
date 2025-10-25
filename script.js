(() => {
  'use strict';

  // run after DOM ready
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(() => {
    // Netlify form: only block submit when invalid so Netlify can handle valid submits
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          form.classList.add('was-validated');
          return;
        }
        // allow native submit when valid (Netlify will handle redirect)
      });
    }

    // Try several path candidates for language files (works locally and deployed)
    async function fetchLangFile(lang) {
      const candidates = [
        `./Lang/${lang}.json`,
        `/Lang/${lang}.json`,
        `Lang/${lang}.json`
      ];
      for (const p of candidates) {
        try {
          const res = await fetch(p, { cache: 'no-store' });
          if (!res.ok) continue;
          return await res.json();
        } catch (e) {
          // try next candidate
        }
      }
      throw new Error(`Language file for "${lang}" not found`);
    }

    async function loadLanguage(lang) {
      try {
        const translations = await fetchLangFile(lang);

        // Translate elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          if (!key) return;
          const txt = translations[key];
          if (txt === undefined) return;

          // Inputs / Textareas: set value or placeholder
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            if (el.hasAttribute('data-i18n-value')) el.value = txt;
            else el.setAttribute('placeholder', txt);
            return;
          }

          // allow HTML when explicitly requested
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

        // Explicit values (buttons/inputs)
        document.querySelectorAll('[data-i18n-value]').forEach(el => {
          const key = el.getAttribute('data-i18n-value');
          if (!key) return;
          const txt = translations[key];
          if (txt !== undefined) el.value = txt;
        });

        // Update document title and meta description when available
        if (translations['site_title']) document.title = translations['site_title'];
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && translations['meta_description']) metaDesc.setAttribute('content', translations['meta_description']);

        // Toggle active class on language options
        document.querySelectorAll('.lang-option').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        console.info(`Language loaded: ${lang}`);
      } catch (err) {
        console.error('loadLanguage error:', err);
      }
    }

    // Initialize language (persisted choice or default)
    const initial = localStorage.getItem('site_lang') || 'en';
    loadLanguage(initial);

    // Wire up language buttons (elements with .lang-option and data-lang)
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        if (!lang) return;
        localStorage.setItem('site_lang', lang);
        loadLanguage(lang);
      });
    });
  });
})();
