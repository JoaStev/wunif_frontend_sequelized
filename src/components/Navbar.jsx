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
          {user && user.role !== 'admin' && (
            <>
              <a href="/catalogo" className="btn btn-secondary">Catálogo</a>
              <a href="/carrito" className="btn btn-secondary">Carrito</a>
            </>
          )}
          {user && user.role === 'admin' && (
            <>
              <a href="/admin/usuarios" className="btn btn-secondary">Usuarios</a>
              <a href="/admin/productos" className="btn btn-secondary">Productos</a>
              <a href="/admin/pedidos" className="btn btn-secondary">Pedidos</a>
              <a href="/admin/stats" className="btn btn-secondary">Estadísticas</a>
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
        {!user && <a href="/login" className="btn btn-primary">Iniciar sesión</a>}
        {user && user.role !== 'admin' && (
          <div className="user-menu">
            <a href="/dashboard" className="btn btn-primary">Mi panel</a>
            <LogoutButton />
          </div>
        )}
        {user && user.role === 'admin' && <LogoutButton />}
      </div>
    </nav>
  );
}
