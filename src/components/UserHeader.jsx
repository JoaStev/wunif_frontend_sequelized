import React from 'react';

export default function UserHeader({ name }) {
  return (
    <header className="user-header">
      <div className="user-header-inner">
        <div className="user-welcome">
          <h2>Bienvenido{ name ? `, ${name}` : ''} 👋</h2>
          <p className="muted">Aquí está tu panel personal. Accede a tus pedidos, perfil y mensajes.</p>
          </div>
        </div>
    </header>
  );
}
