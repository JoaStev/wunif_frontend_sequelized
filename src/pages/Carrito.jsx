import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CART_KEY = 'cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export default function Carrito() {
  const { user } = useAuth();
  const [cart, setCartState] = useState(getCart());
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setCart(cart);
  }, [cart]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProductos)
      .finally(() => setLoading(false));
  }, []);

  const items = cart.map(item => {
    const prod = productos.find(p => p._id === item.productId);
    return prod ? { ...prod, quantity: item.quantity } : null;
  }).filter(Boolean);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function removeItem(productId) {
    setCartState(cart.filter(i => i.productId !== productId));
  }

  function clearCart() {
    setCartState([]);
  }

  async function handleBuy(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setProcessing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          items: items.map(i => ({ product: i._id, quantity: i.quantity })),
          paymentMethod
        })
      });
      let data = {};
      const text = await res.text();
      try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
      if (!res.ok) throw new Error(data.error || 'Error en la compra');
      setSuccess('¡Compra realizada. Recibo enviado a tu correo!');
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
      setShowModal(false);
    }
  }

  if (loading) return <div className="empty-state">Cargando carrito...</div>;

  if (!items.length) return <div className="empty-state">Tu carrito está vacío. Explora el catálogo.</div>;

  return (
    <section className="carrito-container">
      <h2 className="carrito-title">Carrito</h2>
      <div className="carrito-list">
        {items.map(item => (
          <div className="carrito-card" key={item._id}>
            <div className="carrito-img-wrap">
              {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="carrito-img" />}
            </div>
            <div className="carrito-info">
              <div className="carrito-nombre">{item.name}</div>
              <div className="carrito-desc">{item.model} | Talla: {item.size}</div>
              <div className="carrito-precio">{item.price.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
              <div className="carrito-cantidad">Cantidad: {item.quantity}</div>
              <div className="carrito-subtotal">Subtotal: <span>{(item.price * item.quantity).toLocaleString('es-CO')}</span></div>
            </div>
            <button className="btn btn-danger carrito-eliminar" onClick={() => removeItem(item._id)}>Eliminar</button>
          </div>
        ))}
      </div>
      <div className="carrito-total">
        Total: <span>{total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
      </div>
      <button className="btn btn-primary carrito-pagar" onClick={() => setShowModal(true)} disabled={processing}>Comprar</button>
      {showModal && (
        <div className="carrito-modal-bg" role="dialog" aria-modal="true">
          <form className="carrito-modal" onSubmit={handleBuy}>
            <h3>Selecciona método de pago</h3>
            <div className="carrito-metodos">
              <label><input type="radio" name="pay" value="PSE" checked={paymentMethod==='PSE'} onChange={()=>setPaymentMethod('PSE')} /> PSE</label>
              <label><input type="radio" name="pay" value="DEBITO" checked={paymentMethod==='DEBITO'} onChange={()=>setPaymentMethod('DEBITO')} /> Débito</label>
              <label><input type="radio" name="pay" value="CREDITO" checked={paymentMethod==='CREDITO'} onChange={()=>setPaymentMethod('CREDITO')} /> Crédito</label>
            </div>
            <button className="btn btn-primary" type="submit" disabled={!paymentMethod || processing}>
              {processing ? 'Procesando...' : 'Confirmar pago'}
            </button>
            <button className="btn btn-secondary" type="button" onClick={()=>setShowModal(false)} style={{ marginLeft: 8 }}>Cancelar</button>
          </form>
        </div>
      )}
      {error && <div className="toast" style={{ background:'#fff', color:'var(--color-danger)', borderLeft:'6px solid var(--color-danger)' }}>{error}</div>}
      {success && <div className="toast" style={{ background:'#fff', color:'#2EC4B6', borderLeft:'6px solid #2EC4B6' }}>{success}</div>}
    </section>
  );
}
