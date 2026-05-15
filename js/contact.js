// Contact form client-side validation
(function () {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  if (!form) return;

  function showError(fieldId, message) {
    const el = document.getElementById(fieldId + '-error');
    const input = document.getElementById(fieldId);
    if (el) el.textContent = message;
    if (input) input.setAttribute('aria-invalid', 'true');
  }

  function clearError(fieldId) {
    const el = document.getElementById(fieldId + '-error');
    const input = document.getElementById(fieldId);
    if (el) el.textContent = '';
    if (input) input.removeAttribute('aria-invalid');
  }

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function validate() {
    var valid = true;

    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var subject = document.getElementById('subject').value.trim();
    var message = document.getElementById('message').value.trim();

    clearError('name'); clearError('email'); clearError('subject'); clearError('message');

    if (!name) { showError('name', 'Name is required.'); valid = false; }
    if (!email) { showError('email', 'Email is required.'); valid = false; }
    else if (!validateEmail(email)) { showError('email', 'Please enter a valid email.'); valid = false; }
    if (!subject) { showError('subject', 'Subject is required.'); valid = false; }
    if (!message) { showError('message', 'Message is required.'); valid = false; }

    return valid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validate()) {
      form.hidden = true;
      successMsg.hidden = false;
    }
  });
})();
