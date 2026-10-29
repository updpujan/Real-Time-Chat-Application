import { formatError, request } from './api.js';

const toastContainer = document.querySelector('#toast-container');

const showToast = (message, type = 'success') => {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toastContainer.append(toast);
  window.setTimeout(() => toast.remove(), 3800);
};

const setSubmitting = (form, isSubmitting) => {
  const button = form.querySelector('button[type="submit"]');
  if (button) {
    button.disabled = isSubmitting;
    button.textContent = isSubmitting
      ? 'Please wait…'
      : form.id === 'login-form'
        ? 'Log in'
        : 'Create account';
  }
};

document.querySelector('#register-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  setSubmitting(form, true);

  try {
    const formData = new FormData(form);
    const result = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });
    showToast(result.message || 'Account created successfully');
    window.setTimeout(() => {
      window.location.href = '/login.html';
    }, 900);
  } catch (error) {
    showToast(formatError(error), 'error');
    setSubmitting(form, false);
  }
});

document.querySelector('#login-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  setSubmitting(form, true);

  try {
    const formData = new FormData(form);
    const result = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });
    showToast(result.message || 'Logged in successfully');
    window.setTimeout(() => {
      window.location.href = '/chat.html';
    }, 700);
  } catch (error) {
    showToast(formatError(error), 'error');
    setSubmitting(form, false);
  }
});

document.querySelector('#logout-button')?.addEventListener('click', async () => {
  const button = document.querySelector('#logout-button');
  button.disabled = true;

  try {
    const result = await request('/auth/logout', { method: 'POST' });
    showToast(result.message || 'Logged out successfully');
    window.setTimeout(() => {
      window.location.href = '/login.html';
    }, 700);
  } catch (error) {
    showToast(formatError(error), 'error');
    button.disabled = false;
  }
});
