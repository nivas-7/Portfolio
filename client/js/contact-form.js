/**
 * Contact form controller.
 * Validates input client-side, submits via API, and manages
 * loading/success/error UI states.
 */
const ContactForm = (() => {
  const RULES = {
    name: { minLength: 2, maxLength: 100, required: true },
    email: { required: true, pattern: /^\S+@\S+\.\S+$/ },
    subject: { minLength: 3, maxLength: 150, required: true },
    message: { minLength: 10, maxLength: 2000, required: true },
  };

  const ERROR_MESSAGES = {
    name: {
      required: 'Name is required',
      minLength: 'Name must be at least 2 characters',
      maxLength: 'Name cannot exceed 100 characters',
    },
    email: {
      required: 'Email is required',
      pattern: 'Please enter a valid email address',
    },
    subject: {
      required: 'Subject is required',
      minLength: 'Subject must be at least 3 characters',
      maxLength: 'Subject cannot exceed 150 characters',
    },
    message: {
      required: 'Message is required',
      minLength: 'Message must be at least 10 characters',
      maxLength: 'Message cannot exceed 2000 characters',
    },
  };

  /**
   * Validates a single field value against its rule set.
   * Returns an error message string, or null if valid.
   */
  const validateField = (fieldName, value) => {
    const rules = RULES[fieldName];
    const messages = ERROR_MESSAGES[fieldName];
    const trimmed = value.trim();

    if (rules.required && trimmed.length === 0) {
      return messages.required;
    }
    if (rules.minLength && trimmed.length < rules.minLength) {
      return messages.minLength;
    }
    if (rules.maxLength && trimmed.length > rules.maxLength) {
      return messages.maxLength;
    }
    if (rules.pattern && !rules.pattern.test(trimmed)) {
      return messages.pattern;
    }
    return null;
  };

  /**
   * Displays or clears the error message for a given field
   * and toggles the .invalid class on its parent .form-group.
   */
  const showFieldError = (fieldName, errorMessage) => {
    const input = document.getElementById(fieldName);
    const errorEl = document.getElementById(`${fieldName}-error`);
    if (!input || !errorEl) return;

    const formGroup = input.closest('.form-group');

    if (errorMessage) {
      errorEl.textContent = errorMessage;
      formGroup?.classList.add('invalid');
    } else {
      errorEl.textContent = '';
      formGroup?.classList.remove('invalid');
    }
  };

  /**
   * Validates all fields in the form. Returns true if all valid,
   * false otherwise (and displays errors for invalid fields).
   */
  const validateAll = (form) => {
    let isValid = true;

    Object.keys(RULES).forEach((fieldName) => {
      const input = form.elements[fieldName];
      const error = validateField(fieldName, input.value);
      showFieldError(fieldName, error);
      if (error) isValid = false;
    });

    return isValid;
  };

  /**
   * Toggles the submit button between idle and loading states.
   */
  const setLoading = (button, isLoading) => {
    const textEl = button.querySelector('.btn-text');
    const spinnerEl = button.querySelector('.btn-spinner');

    button.disabled = isLoading;
    if (textEl) textEl.style.opacity = isLoading ? '0.6' : '1';
    if (spinnerEl) spinnerEl.hidden = !isLoading;
  };

  /**
   * Shows a success or error message below the submit button.
   */
  const showStatus = (statusEl, message, type) => {
    statusEl.textContent = message;
    statusEl.className = `form-status ${type}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('contact-submit-btn');
    const statusEl = document.getElementById('form-status');

    // Clear any previous status message
    showStatus(statusEl, '', '');

    if (!validateAll(form)) {
      showStatus(statusEl, 'Please fix the errors above before submitting.', 'error');
      return;
    }

    const payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      subject: form.elements.subject.value.trim(),
      message: form.elements.message.value.trim(),
    };

    setLoading(submitBtn, true);

    try {
      const response = await API.submitContact(payload);
      showStatus(statusEl, response.message || 'Message sent successfully!', 'success');
      form.reset();
    } catch (error) {
      showStatus(statusEl, error.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(submitBtn, false);
    }
  };

  /**
   * Wires up real-time validation (on blur) and the submit handler.
   */
  const init = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Validate each field as the user leaves it (better UX than only on submit)
    Object.keys(RULES).forEach((fieldName) => {
      const input = form.elements[fieldName];
      if (!input) return;

      input.addEventListener('blur', () => {
        const error = validateField(fieldName, input.value);
        showFieldError(fieldName, error);
      });

      // Clear error as soon as the user starts fixing it
      input.addEventListener('input', () => {
        const formGroup = input.closest('.form-group');
        if (formGroup?.classList.contains('invalid')) {
          const error = validateField(fieldName, input.value);
          if (!error) showFieldError(fieldName, null);
        }
      });
    });

    form.addEventListener('submit', handleSubmit);
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  ContactForm.init();
});