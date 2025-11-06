import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminPedidos() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/orders/all', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setOrders)
      .catch(() => setError('Error cargando pedidos'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="empty-state">Cargando pedidos...</div>;
  if (error) return <div className="toast" style={{ background:'#e53e3e' }}>{error}</div>;
  if (!orders.length) return <div className="empty-state">No hay pedidos realizados.</div>;

  return (
    <section>
      <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '2em', color: 'var(--color-primary)', marginBottom: 18 }}>Pedidos realizados</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ fontSize: 15 }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Actualizaciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id}>
                <td>{String(order.id).slice(-6)}</td>
                  <td>{order.guardianName || order.user}</td>
                <td>{new Date(order.createdAt).toLocaleString('es-CO')}</td>
                <td>
                  <ul style={{ paddingLeft: 16 }}>
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.name} ({item.model}) - Talla: <b>{item.size}</b> x{item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>${order.total.toLocaleString('es-CO')}</td>
                <td>{order.status}</td>
                <td>
                  <ul style={{ paddingLeft: 16 }}>
                    {order.statusUpdates?.map((up, i) => (
                      <li key={i}>{up}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
