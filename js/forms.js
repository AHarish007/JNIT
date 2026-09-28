/* JNIT Inc — Form validation, password tools, success states (front-end only, no backend) */
(function () {
  'use strict';

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^[+()\-\s\d]{7,20}$/;

  function fieldOf(input) { return input.closest('.field, .checkbox'); }

  function setError(input, msg) {
    var f = fieldOf(input);
    if (!f) return;
    var out = f.querySelector('.field-msg');
    f.classList.toggle('has-error', !!msg);
    f.classList.toggle('is-valid', !msg && input.value !== '' && input.type !== 'checkbox');
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (out) out.textContent = msg || '';
  }

  function validate(input, form) {
    var v = (input.value || '').trim();
    var label = input.dataset.label || 'This field';
    if (input.type === 'checkbox') {
      if (input.required && !input.checked) return 'Please accept to continue.';
      return '';
    }
    if (input.required && !v) return label + ' is required.';
    if (!v) return '';
    if (input.type === 'email' && !EMAIL.test(v)) return 'Enter a valid email address.';
    if (input.type === 'tel' && !PHONE.test(v)) return 'Enter a valid phone number.';
    if (input.dataset.match) {
      var other = form.querySelector('#' + input.dataset.match);
      if (other && other.value !== input.value) return 'Passwords do not match.';
    }
    if (input.minLength > 0 && v.length < input.minLength) return label + ' must be at least ' + input.minLength + ' characters.';
    if (input.dataset.strength && score(input.value) < 2) return 'Choose a stronger password.';
    return '';
  }

  function score(pw) {
    var s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 14) s++;
    return pw ? Math.max(1, s) : 0;
  }

  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    var inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(function (input) {
      if (input.type === 'submit' || input.type === 'hidden') return;
      input.addEventListener('blur', function () {
        if (input.value || input.type === 'checkbox') setError(input, validate(input, form));
      });
      input.addEventListener('input', function () {
        if (fieldOf(input) && fieldOf(input).classList.contains('has-error')) setError(input, validate(input, form));
      });
      input.addEventListener('change', function () { if (input.tagName === 'SELECT' || input.type === 'checkbox') setError(input, validate(input, form)); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      inputs.forEach(function (input) {
        if (input.type === 'submit' || input.type === 'hidden' || input.type === 'search') return;
        var msg = validate(input, form);
        setError(input, msg);
        if (msg && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }

      var btn = form.querySelector('[type="submit"]');
      var original = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.querySelector('.btn-text').textContent = 'Sending…'; }

      /* No backend: simulate a request. Replace with a real endpoint (e.g. fetch to a form service). */
      setTimeout(function () {
        var success = form.querySelector('.form-success') || (form.closest('.form-card') && form.closest('.form-card').querySelector('.form-success'));
        var inline = form.querySelector('.inline-success');
        if (success) { success.classList.add('show'); success.setAttribute('tabindex', '-1'); success.focus(); }
        if (inline) inline.textContent = 'Thanks! You are subscribed.';
        form.reset();
        form.querySelectorAll('.is-valid').forEach(function (f) { f.classList.remove('is-valid'); });
        var st = form.querySelector('.strength'); if (st) { st.dataset.level = 0; st.querySelector('.strength-label').textContent = 'Password strength'; }
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
      }, 900);
    });

    form.querySelectorAll('[data-success-reset]').forEach(function (b) {
      b.addEventListener('click', function () { b.closest('.form-success').classList.remove('show'); });
    });
  });

  /* Reset buttons inside success panels that live outside the form */
  document.querySelectorAll('.form-card [data-success-reset]').forEach(function (b) {
    b.addEventListener('click', function () { b.closest('.form-success').classList.remove('show'); });
  });

  /* Password visibility toggles */
  document.querySelectorAll('.pw-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.getAttribute('aria-controls'));
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(show));
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      btn.querySelector('.eye-open').style.display = show ? 'none' : '';
      btn.querySelector('.eye-closed').style.display = show ? '' : 'none';
    });
  });

  /* Strength meter */
  document.querySelectorAll('[data-strength]').forEach(function (input) {
    var meter = document.getElementById(input.dataset.strength);
    var names = ['Password strength', 'Weak', 'Fair', 'Good', 'Strong'];
    input.addEventListener('input', function () {
      var s = score(input.value);
      meter.dataset.level = s;
      meter.querySelector('.strength-label').textContent = names[s];
    });
  });
})();
