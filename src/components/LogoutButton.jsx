import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function LogoutButton() {
  const { logout } = useAuth();
  return (
    <button className="btn btn-secondary" onClick={logout} style={{ marginLeft: '1em' }}>
      Cerrar sesión
    </button>
  );
}
