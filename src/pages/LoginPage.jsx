import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      // Redirect based on role
      if (data.role === 'admin') navigate('/admin/usuarios');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-root">
      <div className="login-left">
        <div>
          <h1>¡Bienvenido de nuevo!</h1>
          <p>Accede a tu cuenta para gestionar pedidos, productos y usuarios. El acceso es seguro y privado.</p>
          <ul style={{marginTop:24, paddingLeft:18, color:'#e6eef7', fontSize:'1.05em'}}>
          </ul>
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <h2>Iniciar sesión</h2>
          <form onSubmit={handleSubmit} autoComplete="on">
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" name="email" type="email" required autoFocus placeholder="tucorreo@ejemplo.com" />
            <label htmlFor="password">Contraseña</label>
            <div style={{position:'relative'}}>
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} required placeholder="••••••••" style={{paddingRight:'38px'}} />
              <button type="button" onClick={()=>setShowPassword(v=>!v)} style={{position:'absolute',right:8,top:8,background:'none',border:'none',color:'#0f7bff',fontWeight:600,cursor:'pointer',fontSize:'1em'}}>
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
            {error && <div style={{ background: '#fff', color: '#b00020', borderLeft: '6px solid #b00020', marginBottom: 8, padding: 8 }}>{error}</div>}
            <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: 10 }} disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
            <div className="login-foot">¿Olvidaste tu contraseña? Contacta al administrador para recuperarla.</div>
          </form>
        </div>
      </div>
    </div>
  );
}
