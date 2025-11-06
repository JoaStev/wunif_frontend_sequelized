import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserSidebar from '../components/UserSidebar';

export default function Perfil() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => setPerfil(data))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="empty-state">Cargando perfil...</div>;
  if (!perfil) return <div className="empty-state">No se encontró el perfil.</div>;

  return (
    <div className="user-dashboard-grid">
      <UserSidebar />
      <section className="user-main">
        <h2 style={{ marginTop: 0 }}>Mi perfil</h2>
        <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: 9999, background: 'linear-gradient(180deg,#e6fffb,#fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: 'var(--color-primary)', fontWeight: 700 }} aria-hidden>
            {perfil.estudianteNombre?.[0]}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.2em', fontWeight: 700 }}>{perfil.estudianteNombre}</div>
            <div style={{ color: '#6b7280' }}>{perfil.email}</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }} className="card">
          <h3>Detalles</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div><b>Acudiente:</b> {perfil.acudienteNombre} ({perfil.acudienteDocumento})</div>
            <div><b>Estudiante:</b> {perfil.estudianteNombre} ({perfil.estudianteDocumento})</div>
            <div><b>Grado/Sección:</b> {perfil.gradoSeccion}</div>
            <div><b>Dirección:</b> {perfil.direccion}</div>
            <div><b>Teléfono:</b> {perfil.telefono}</div>
            <div><b>Email:</b> {perfil.email}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
