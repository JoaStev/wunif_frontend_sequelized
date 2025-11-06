import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserHeader from '../components/UserHeader';
import UserSidebar from '../components/UserSidebar';
import Perfil from './Perfil';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderUpdates, setOrderUpdates] = useState({});

  useEffect(() => {
    if (!user) return;
    fetch('/api/users/me', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(setProfile)
      .catch(() => setProfile(null));
    // Obtener pedidos del usuario
    fetch('/api/orders/mine', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(setOrders);
  }, [user]);

  useEffect(() => {
    // Para cada pedido, obtener actualizaciones
    if (!orders.length) return;
    orders.forEach(order => {
      fetch(`/api/orders/${order.id}/updates`, { headers: { Authorization: `Bearer ${user.token}` } })
        .then(r => r.ok ? r.json() : { statusUpdates: [] })
        .then(data => {
          setOrderUpdates(prev => ({ ...prev, [order.id]: data.statusUpdates }));
        });
    });
  }, [orders, user]);

  async function handleDeleteOrder(orderId) {
    if (!window.confirm('¿Eliminar este pedido?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (!res.ok) throw new Error('No se pudo eliminar el pedido');
      setOrders(orders => orders.filter(o => o.id !== orderId));
      setOrderUpdates(updates => {
        const copy = { ...updates };
        delete copy[orderId];
        return copy;
      });
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div style={{ background: '#f6f7f9ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ boxShadow: '0 4px 24px rgba(44,62,80,0.10)', borderRadius: 24, background: '#fff', padding: '40px 32px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '2em', color: 'var(--color-primary)', marginBottom: 24 }}>
            Mi perfil
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#3b82f6' }}>
                {profile?.estudianteNombre?.[0] || 'U'}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: 20, color: '#222' }}>{profile?.estudianteNombre}</div>
                <div style={{ color: '#6b7280', fontSize: 16 }}>{profile?.email}</div>
              </div>
            </div>
            <div style={{ width: '100%', textAlign: 'left', background: '#f3f4f6', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 600, color: '#222' }}>Acudiente:</div>
                  <div style={{ color: '#444' }}>{profile?.acudienteNombre} ({profile?.acudienteDocumento})</div>
                  <div style={{ color: '#444', fontSize: 14 }}></div>
                </div>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 600, color: '#222' }}>Estudiante:</div>
                  <div style={{ color: '#444' }}>{profile?.estudianteNombre} ({profile?.estudianteDocumento})</div>
                </div>
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontWeight: 600, color: '#222' }}>Grado/Sección:</div>
                  <div style={{ color: '#444' }}>{profile?.gradoSeccion}</div>
                </div>
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontWeight: 600, color: '#222' }}>Dirección:</div>
                  <div style={{ color: '#444' }}>{profile?.direccion}</div>
                </div>
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontWeight: 600, color: '#222' }}>Teléfono:</div>
                  <div style={{ color: '#444' }}>{profile?.telefono}</div>
                </div>
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontWeight: 600, color: '#222' }}>Email:</div>
                  <div style={{ color: '#444' }}>{profile?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/pedidos" className="btn btn-primary" style={{ fontSize: 20, padding: '16px 32px', borderRadius: 12, boxShadow: '0 2px 12px rgba(44,62,80,0.07)', fontWeight: 600 }}>
            Ver pedidos y actualizaciones
          </Link>
        </div>
      </div>
    </div>
  );
}
