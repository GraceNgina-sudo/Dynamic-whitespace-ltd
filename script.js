(() => {
  'use strict';

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (event) {

  if (!form.checkValidity()) {
    event.preventDefault();
      form.classList.add('was-validated');
      return;
}
    });
  }
  
async function loadLanguage(lang) {
    try {
      const response = await fetch(`Lang/${lang}.json`);
      const translations = await response.json();

      // Translate elements with data-i18n (inner text)
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translations[key];
          } else {
            el.textContent = translations[key];
          }
        }
      });

      // Translate placeholders (data-i18n-placeholder attribute)
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[key]) {
          el.placeholder = translations[key];
        }
      });

      // Update document title
      if (translations['site_title']) {
        document.title = translations['site_title'];
      }

      // Update meta description
      if (translations['meta_description']) {
        const metaDescription = document.querySelector("meta[name='description']");
        if (metaDescription) {
          metaDescription.setAttribute('content', translations['meta_description']);
        }
      }
    } catch (error) {
      console.error('Error loading language file:', error);
    }
  }

  // Load default language (English)
  loadLanguage('en');

  // Language switcher
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('lang-option')) {
      e.preventDefault();
      const lang = e.target.getAttribute('data-lang');
      if (lang) {
        loadLanguage(lang);
    }
}
  });

})();

