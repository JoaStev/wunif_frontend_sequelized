import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
    <section className="perfil-container">
      <h2 className="perfil-title">Mi perfil</h2>
      <div className="perfil-card">
        <div className="perfil-avatar-halo">
          <span>{perfil.estudianteNombre?.[0]}</span>
        </div>
        <div className="perfil-info">
          <div className="perfil-nombre">{perfil.estudianteNombre}</div>
          <div className="perfil-email">{perfil.email}</div>
        </div>
      </div>
      <div className="perfil-tabs">
        <button className="perfil-tab active">Datos</button>
      </div>
      <div className="perfil-datos-card">
        <div className="perfil-dato"><b>Acudiente:</b> {perfil.acudienteNombre} ({perfil.acudienteDocumento})</div>
        <div className="perfil-dato"><b>Estudiante:</b> {perfil.estudianteNombre} ({perfil.estudianteDocumento})</div>
        <div className="perfil-dato"><b>Grado/Sección:</b> {perfil.gradoSeccion}</div>
        <div className="perfil-dato"><b>Dirección:</b> {perfil.direccion}</div>
        <div className="perfil-dato"><b>Teléfono:</b> {perfil.telefono}</div>
        <div className="perfil-dato"><b>Email:</b> {perfil.email}</div>
      </div>
    </section>
  );
}
