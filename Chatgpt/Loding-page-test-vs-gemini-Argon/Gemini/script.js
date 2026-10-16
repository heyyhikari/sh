(() => {
  // 1. Mobile Navigation Controller
  const menuToggle = document.getElementById('menu-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = primaryNav.querySelectorAll('a');

  function setMenuState(isOpen) {
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    primaryNav.classList.toggle('is-open', isOpen);
  }

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!isExpanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
      setMenuState(false);
      menuToggle.focus();
    }
  });

  // 2. Service Selection Buttons -> Scroll & Pre-fill Contact Form
  const serviceButtons = document.querySelectorAll('.select-service-btn');
  const serviceSelect = document.getElementById('service');
  const contactSection = document.getElementById('contact');
  const nameInput = document.getElementById('name');

  serviceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetService = button.getAttribute('data-service');
      if (serviceSelect && targetService) {
        serviceSelect.value = targetService;
        validateField(serviceSelect);
      }
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => nameInput.focus({ preventScroll: true }), 450);
    });
  });

  // 3. Portfolio Sample Specification Modal
  const projectData = {
    krono: {
      title: 'Krono Telemetry (Sample Concept)',
      summary: 'Reference architecture for a developer-focused observability platform. Designed to present technical documentation alongside an interactive pricing estimator.',
      specs: [
        ['Status', 'Sample Concept Build'],
        ['Stack', 'Semantic HTML5, CSS Grid, Vanilla JS'],
        ['CSS Payload', '4.2 KB (Gzipped)'],
        ['Accessibility', 'Full Keyboard & ARIA Landmark Support']
      ]
    },
    monolith: {
      title: 'Monolith Technical Press (Sample Concept)',
      summary: 'Editorial layout exploration prioritizing long-form reading comfort, fluid typographic scales, and high-contrast dark mode rendering.',
      specs: [
        ['Status', 'Sample Concept Build'],
        ['Stack', 'Plain HTML & CSS Custom Properties'],
        ['First Contentful Paint', '0.3s (Simulated Fast 3G)'],
        ['Typography', 'System UI & Monospace Scale']
      ]
    },
    veridian: {
      title: 'Veridian Audio Systems (Sample Concept)',
      summary: 'Hardware showcase concept built to organize dense acoustic measurements and comparison tables cleanly on small mobile viewports.',
      specs: [
        ['Status', 'Sample Concept Build'],
        ['Stack', 'Responsive Tables, Native Dialogs'],
        ['JavaScript Footprint', 'Zero Third-Party Dependencies'],
        ['Contrast Ratio', '14.5:1 Primary Text']
      ]
    }
  };

  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalSummary = document.getElementById('modal-summary');
  const modalSpecs = document.getElementById('modal-specs');
  const modalClose = document.getElementById('modal-close');
  const detailButtons = document.querySelectorAll('.project-detail-btn');

  detailButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      const data = projectData[key];
      if (!data || typeof modal.showModal !== 'function') return;

      modalTitle.textContent = data.title;
      modalSummary.textContent = data.summary;
      modalSpecs.innerHTML = data.specs
        .map(([label, val]) => `<div><dt>${label}</dt><dd>${val}</dd></div>`)
        .join('');

      modal.showModal();
    });
  });

  modalClose.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (clickedOutside) modal.close();
  });

  // 4. Client-Side Contact Form Validation
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function getErrorMessage(field) {
    const value = field.value.trim();

    if (field.required && !value) {
      return 'This field is required.';
    }
    if (field.id === 'name' && value.length < 2) {
      return 'Please enter at least 2 characters.';
    }
    if (field.id === 'email' && !emailRegex.test(value)) {
      return 'Please enter a valid email address (e.g., name@domain.com).';
    }
    if (field.id === 'message' && value.length < 20) {
      return `Please provide at least 20 characters (currently ${value.length}).`;
    }
    return '';
  }

  function validateField(field) {
    const errorEl = document.getElementById(`${field.id}-error`);
    const errorMessage = getErrorMessage(field);

    if (errorMessage) {
      field.setAttribute('aria-invalid', 'true');
      errorEl.textContent = errorMessage;
      errorEl.hidden = false;
      return false;
    } else {
      field.setAttribute('aria-invalid', 'false');
      errorEl.textContent = '';
      errorEl.hidden = true;
      return true;
    }
  }

  const fields = ['name', 'email', 'service', 'message'].map((id) =>
    document.getElementById(id)
  );

  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.hidden = true;

    let firstInvalidField = null;
    let isFormValid = true;

    fields.forEach((field) => {
      const valid = validateField(field);
      if (!valid && !firstInvalidField) {
        firstInvalidField = field;
      }
      if (!valid) isFormValid = false;
    });

    if (!isFormValid && firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    const submittedName = document.getElementById('name').value.trim();
    const selectedServiceText =
      serviceSelect.options[serviceSelect.selectedIndex].text;

    formStatus.textContent = `Validation passed for ${submittedName} (${selectedServiceText}). Because this is a static local demo without a backend server, no data was sent over the network.`;
    formStatus.hidden = false;
    form.reset();
    fields.forEach((f) => f.removeAttribute('aria-invalid'));
  });
})();
