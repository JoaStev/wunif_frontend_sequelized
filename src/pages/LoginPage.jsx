import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error de autenticación');
      login(data.token, data.role);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" style={{ maxWidth: 400, margin: '2.5em auto', boxShadow: '0 4px 16px #0001' }}>
      <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '2em', marginBottom: 18, color: 'var(--color-primary)' }}>Iniciar sesión</h2>
      <form onSubmit={handleSubmit} autoComplete="on">
        <label htmlFor="email">Correo electrónico</label>
        <input id="email" name="email" type="email" required autoFocus />
        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" required />
        {error && <div className="toast" style={{ background: '#fff', color: 'var(--color-danger)', borderLeft: '6px solid var(--color-danger)', marginBottom: 8 }}>{error}</div>}
        <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 10 }} disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </section>
  );
}
