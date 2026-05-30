import React, { useState } from 'react';
import { api } from '../services/api.js';

function LoginPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: 'davyd.tavdhiridze@nure.ua',
    password: 'user123'
  });
  const [error, setError] = useState('');

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');

    try {
      const response = mode === 'login'
        ? await api.login({ email: form.email, password: form.password })
        : await api.register(form);

      onAuth(response.token, response.user);
    } catch (err) {
      setError(err.message);
    }
  }

  function fillAdmin() {
    setForm({ name: 'Administrator', email: 'admin@taskmanager.local', password: 'admin123' });
  }

  function fillUser() {
    setForm({ name: 'Davyd Tavdhiridze', email: 'davyd.tavdhiridze@nure.ua', password: 'user123' });
  }

  return (
    <section className="auth-card">
      <h2>{mode === 'login' ? 'Вхід у систему' : 'Реєстрація користувача'}</h2>
      <p>Для 3 рівня реалізовано користувачів, ролі доступу, планування задач і нагадування.</p>

      <div className="quick-login">
        <button onClick={fillUser}>User</button>
        <button onClick={fillAdmin}>Admin</button>
      </div>

      <form onSubmit={submit} className="form">
        {mode === 'register' && (
          <label>
            Ім’я
            <input name="name" value={form.name} onChange={updateField} required />
          </label>
        )}

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={updateField} required />
        </label>

        <label>
          Пароль
          <input type="password" name="password" value={form.password} onChange={updateField} required />
        </label>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="primary-button">
          {mode === 'login' ? 'Увійти' : 'Зареєструватися'}
        </button>
      </form>

      <button className="link-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Створити нового користувача' : 'Повернутися до входу'}
      </button>
    </section>
  );
}

export default LoginPage;
