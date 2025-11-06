import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserPedidos() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [orderUpdates, setOrderUpdates] = useState({});

  useEffect(() => {
    if (!user) return;
    fetch('/api/orders/mine', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(setOrders);
  }, [user]);

  useEffect(() => {
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
    <section className="user-main card">
      <h3>Pedidos y actualizaciones</h3>
      <div style={{ marginTop: 32 }}>
        {orders.length === 0 ? (
          <div className="empty-state">No tienes pedidos realizados.</div>
        ) : (
          <ul style={{ paddingLeft: 0 }}>
            {orders.map(order => (
              <li key={order.id} style={{ marginBottom: 18, listStyle: 'none', borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Pedido #{String(order.id).slice(-6)}
                  <button className="btn btn-danger" style={{ marginLeft: 12, fontSize: 13, padding: '2px 8px' }} onClick={() => handleDeleteOrder(order.id)}>Eliminar</button>
                </div>
                <div style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>
                  <b>Productos:</b>
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: 16 }}>
                    {order.items?.map((item, idx) => (
                      <li key={idx}>
                        {item.name} ({item.model}) - Talla: <b>{item.size}</b> x{item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ fontSize: 14, color: '#555' }}>
                  <b>Actualizaciones:</b>
                  {orderUpdates[order.id]?.map((up, idx) => (
                    <div key={idx} style={{ marginBottom: 4 }}>• {up}</div>
                  )) || <span>Cargando actualizaciones...</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
