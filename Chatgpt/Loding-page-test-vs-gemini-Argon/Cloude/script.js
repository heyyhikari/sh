(function () {
  'use strict';

  // CHANGE THIS to your real email address.
  var CONTACT_EMAIL = 'hello@example.com';

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  // Contact form validation
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var rules = {
    name: function (v) {
      if (!v.trim()) return 'Please enter your name.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    email: function (v) {
      if (!v.trim()) return 'Please enter your email address.';
      if (!emailPattern.test(v.trim())) return 'Please enter a valid email address.';
      return '';
    },
    type: function (v) {
      return v ? '' : 'Please choose a project type.';
    },
    message: function (v) {
      if (!v.trim()) return 'Please tell me about your project.';
      if (v.trim().length < 20) return 'Please write at least 20 characters.';
      return '';
    }
  };

  function validateField(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var msg = rule(field.value);
    var errorEl = document.getElementById(field.id + '-error');
    errorEl.textContent = msg;
    if (msg) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
    return !msg;
  }

  var fields = form.querySelectorAll('input, select, textarea');

  fields.forEach(function (field) {
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    status.classList.remove('is-error');

    var firstInvalid = null;
    fields.forEach(function (field) {
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      status.textContent = 'Please fix the highlighted fields.';
      status.classList.add('is-error');
      firstInvalid.focus();
      return;
    }

    var data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      type: form.elements.type.value,
      message: form.elements.message.value.trim()
    };

    var subject = 'Project enquiry: ' + data.type;
    var body =
      'Name: ' + data.name + '\n' +
      'Email: ' + data.email + '\n' +
      'Project type: ' + data.type + '\n\n' +
      data.message;

    var href = 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    status.textContent = 'Details look good. Your email app should open with a draft. Nothing is sent until you press send there.';
    window.location.href = href;
  });
})();
