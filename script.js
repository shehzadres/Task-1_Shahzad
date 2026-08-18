(() => {
  'use strict';

  /* -----------------------------------------------------------
     Mobile navigation toggle
  ----------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  function closeNav() {
    navToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-open');
  }

  function toggleNav() {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    primaryNav.classList.toggle('is-open', !isOpen);
  }

  navToggle.addEventListener('click', toggleNav);

  // Close the mobile menu after choosing a link, and on Escape
  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeNav();
      navToggle.focus();
    }
  });

  // If the viewport grows past the mobile breakpoint, reset menu state
  const mobileQuery = window.matchMedia('(min-width: 768px)');
  mobileQuery.addEventListener('change', (event) => {
    if (event.matches) closeNav();
  });

  /* -----------------------------------------------------------
     Project grid filtering — simple state management
  ----------------------------------------------------------- */
  const filterBar = document.querySelector('.filter-bar');
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const emptyState = document.getElementById('emptyState');

  let activeFilter = 'all';

  function applyFilter() {
    let visibleCount = 0;
    projectCards.forEach((card) => {
      const matches = activeFilter === 'all' || card.dataset.category === activeFilter;
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    emptyState.hidden = visibleCount !== 0;
  }

  if (filterBar) {
    filterBar.addEventListener('click', (event) => {
      const chip = event.target.closest('.filter-chip');
      if (!chip) return;

      filterBar.querySelectorAll('.filter-chip').forEach((btn) => {
        btn.classList.toggle('is-active', btn === chip);
        btn.setAttribute('aria-pressed', String(btn === chip));
      });

      activeFilter = chip.dataset.filter;
      applyFilter();
    });
  }

  /* -----------------------------------------------------------
     Contact form — client-side validation & feedback
  ----------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  const validators = {
    name: (value) => value.trim().length > 1,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: (value) => value.trim().length > 9,
  };

  const messages = {
    name: 'Please enter your name.',
    email: 'Please enter a valid email address.',
    message: 'Tell me a bit more — at least 10 characters.',
  };

  function validateField(id) {
    const field = document.getElementById(id);
    const errorEl = document.getElementById(`${id}Error`);
    const isValid = validators[id](field.value);

    field.closest('.field').classList.toggle('has-error', !isValid);
    errorEl.textContent = isValid ? '' : messages[id];
    if (!isValid) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
    return isValid;
  }

  if (form) {
    ['name', 'email', 'message'].forEach((id) => {
      const field = document.getElementById(id);
      field.addEventListener('blur', () => validateField(id));
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const results = ['name', 'email', 'message'].map(validateField);
      const allValid = results.every(Boolean);

      if (!allValid) {
        formStatus.textContent = 'Please fix the highlighted fields.';
        return;
      }

      formStatus.textContent = 'Thanks — your message has been noted. I\u2019ll reply within two business days.';
      form.reset();
    });
  }

  /* -----------------------------------------------------------
     Footer year
  ----------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
