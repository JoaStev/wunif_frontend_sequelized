import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
  fetch('/api/stats/summary', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(setStats)
      .catch(() => setError('Error cargando estadísticas'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="empty-state">Cargando estadísticas...</div>;
  if (error) return <div className="toast" style={{ background:'#e53e3e' }}>{error}</div>;
  if (!stats) return null;

  return (
    <section>
      <h2>Estadísticas</h2>
      <div className="card" style={{ marginBottom: 24 }}>
        <h3>Ventas totales</h3>
        <p style={{ fontSize: 22, fontWeight: 700 }}>${stats.totalVentas?.toLocaleString('es-MX')}</p>
        <p>Órdenes completadas: <b>{stats.totalOrdenes}</b></p>
      </div>
      <div className="card" style={{ marginBottom: 24 }}>
        <h3>Top productos vendidos</h3>
        <ol>
          {stats.topProductos?.map(p => (
            <li key={p._id}>{p.name} ({p.model}) — <b>{p.cantidad}</b> vendidos</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
