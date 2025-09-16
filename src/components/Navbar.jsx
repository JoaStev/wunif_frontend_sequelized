import React from 'react';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './LogoutButton';

export default function Navbar() {
  const { user } = useAuth();
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <a href="/" className="navbar-logo" style={{ fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', fontSize: '1.5em', letterSpacing: '2px', marginRight: '2em' }}>
          <link rel="icon" type="image/png" href="\wunifl.png" /> WUNIF
        </a>
        <div className="navbar-links" style={{ display: 'flex', gap: '0.5em', flex: 1, justifyContent: 'center' }}>
          {!user && <a href="/catalogo" className="btn btn-secondary">Catálogo</a>}
          {user && user.role !== 'admin' && <a href="/" className="btn btn-secondary">Inicio</a>}
          {user && user.role !== 'admin' && <a href="/carrito" className="btn btn-secondary">Carrito</a>}
          {user && user.role !== 'admin' && <a href="/perfil" className="btn btn-secondary">Perfil</a>}
          {user && user.role === 'admin' && <a href="/admin/usuarios" className="btn btn-secondary">Usuarios</a>}
          {user && user.role === 'admin' && <a href="/admin/productos" className="btn btn-secondary">Productos</a>}
          {user && user.role === 'admin' && <a href="/admin/stats" className="btn btn-secondary">Estadísticas</a>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
        {!user && <a href="/login" className="btn btn-primary">Iniciar sesión</a>}
        {user && <LogoutButton />}
      </div>
    </nav>
  );
}
