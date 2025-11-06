import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Carrito.css';

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
  const [paymentDetails, setPaymentDetails] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [notification, setNotification] = useState(false);
  const [purchaseToastVisible, setPurchaseToastVisible] = useState(false);
  const [toastExiting, setToastExiting] = useState(false);

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
    return prod ? { ...prod, quantity: item.quantity, size: item.size } : null;
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
      // Basic client-side validation depending on chosen method
      if (!paymentMethod) throw new Error('Selecciona un método de pago');
      if (paymentMethod === 'CREDITO') {
        const { cardName, cardNumber, expMonth, expYear, cvv } = paymentDetails;
        if (!cardName || !cardNumber || !expMonth || !expYear || !cvv) throw new Error('Completa los datos de la tarjeta de crédito');
      }
      if (paymentMethod === 'DEBITO') {
        const { cardName, cardNumber, pin } = paymentDetails;
        if (!cardName || !cardNumber || !pin) throw new Error('Completa los datos de la tarjeta de débito');
      }
      if (paymentMethod === 'PSE') {
        const { bank, docType, docNumber } = paymentDetails;
        if (!bank || !docType || !docNumber) throw new Error('Completa los datos para PSE');
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          items: items.map(i => ({ product: i._id, quantity: i.quantity, size: i.size })),
          paymentMethod,
          paymentDetails // this is only for simulation / record-keeping; not used for real payments
        })
      });
      let data = {};
      const text = await res.text();
      try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
      if (!res.ok) throw new Error(data.error || 'Error en la compra');
      
      // Limpiamos carrito y mostramos notificación
      clearCart();
      setSuccess('¡PAGO REALIZADO CON ÉXITO!');
      setPurchaseToastVisible(true);
      setToastExiting(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
      setShowModal(false);
    }
  }

  React.useEffect(() => {
    if (success) {
      setToastExiting(false);
      setPurchaseToastVisible(true);
      const hideTimer = setTimeout(() => {
        setToastExiting(true);
        const exitTimer = setTimeout(() => {
          setPurchaseToastVisible(false);
          setToastExiting(false);
        }, 400); // match animation duration
        return () => clearTimeout(exitTimer);
      }, 3000);
      return () => clearTimeout(hideTimer);
    }
  }, [success]);

  if (loading) return <div className="empty-state">Cargando carrito...</div>;

  if (!items.length) return <div className="empty-state">Tu carrito está vacío. Explora el catálogo.</div>;

  return (
    <>

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
              <div className="carrito-desc">{item.model} | Talla: <b>{item.size}</b></div>
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
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <input type="radio" name="pay" value="PSE" checked={paymentMethod === 'PSE'} onChange={() => { setPaymentMethod('PSE'); setPaymentDetails({}); }} />
                PSE
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <input type="radio" name="pay" value="DEBITO" checked={paymentMethod === 'DEBITO'} onChange={() => { setPaymentMethod('DEBITO'); setPaymentDetails({}); }} />
                Débito
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <input type="radio" name="pay" value="CREDITO" checked={paymentMethod === 'CREDITO'} onChange={() => { setPaymentMethod('CREDITO'); setPaymentDetails({}); }} />
                Crédito
              </label>
            </div>

            {/* Payment method forms (mock, non-real) */}
            {paymentMethod === 'CREDITO' && (
              <div>
                <label>Nombre en la tarjeta</label>
                <input value={paymentDetails.cardName || ''} onChange={e => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })} />
                <label>Número de tarjeta</label>
                <input value={paymentDetails.cardNumber || ''} onChange={e => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value.replace(/\D/g, '') })} maxLength={19} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label>Exp. mes</label>
                    <input value={paymentDetails.expMonth || ''} onChange={e => setPaymentDetails({ ...paymentDetails, expMonth: e.target.value })} placeholder="MM" maxLength={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Exp. año</label>
                    <input value={paymentDetails.expYear || ''} onChange={e => setPaymentDetails({ ...paymentDetails, expYear: e.target.value })} placeholder="YY" maxLength={2} />
                  </div>
                  <div style={{ width: 120 }}>
                    <label>CVC</label>
                    <input value={paymentDetails.cvv || ''} onChange={e => setPaymentDetails({ ...paymentDetails, cvv: e.target.value.replace(/\D/g, '') })} maxLength={4} />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'DEBITO' && (
              <div>
                <label>Nombre en la tarjeta</label>
                <input value={paymentDetails.cardName || ''} onChange={e => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })} />
                <label>Número de tarjeta</label>
                <input value={paymentDetails.cardNumber || ''} onChange={e => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value.replace(/\D/g, '') })} maxLength={19} />
                <label>PIN (mock)</label>
                <input value={paymentDetails.pin || ''} onChange={e => setPaymentDetails({ ...paymentDetails, pin: e.target.value.replace(/\D/g, '') })} maxLength={6} />
              </div>
            )}

            {paymentMethod === 'PSE' && (
              <div>
                <label>Banco</label>
                <select value={paymentDetails.bank || ''} onChange={e => setPaymentDetails({ ...paymentDetails, bank: e.target.value })}>
                  <option value="">Selecciona un banco</option>
                  <option>Davivienda</option>
                  <option>Bancolombia</option>
                  <option>BBVA</option>
                  <option>Banco de Bogotá</option>
                </select>
                <label>Tipo de documento</label>
                <select value={paymentDetails.docType || ''} onChange={e => setPaymentDetails({ ...paymentDetails, docType: e.target.value })}>
                  <option value="">Selecciona</option>
                  <option>CC</option>
                  <option>CE</option>
                  <option>NIT</option>
                </select>
                <label>Número de documento</label>
                <input value={paymentDetails.docNumber || ''} onChange={e => setPaymentDetails({ ...paymentDetails, docNumber: e.target.value.replace(/\D/g, '') })} />
              </div>
            )}

            <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              <button className="btn btn-primary" type="submit" disabled={!paymentMethod || processing}>
                {processing ? 'Procesando...' : 'Confirmar pago'}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => { setShowModal(false); setPaymentMethod(''); setPaymentDetails({}); }} style={{ marginLeft: 8 }}>Cancelar</button>
              <div style={{ marginLeft: 'auto', color: '#6b7c93' }}>Total: <strong>{total.toLocaleString('es-CO')}</strong></div>
            </div>
          </form>
        </div>
      )}
      {error && <div className="toast" style={{ background:'#fff', color:'var(--color-danger)', borderLeft:'6px solid var(--color-danger)' }}>{error}</div>}
      {success && (
        <div className="toast" style={{ 
          background:'#fff', 
          color:'#2EC4B6', 
          borderLeft:'6px solid #2EC4B6',
          padding: '20px',
          fontSize: '1.2em',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          {success}
        </div>
      )}

      {/* Purchase toast (top center) */}
      {purchaseToastVisible && (
        <div className={`purchase-toast ${toastExiting ? 'exit' : ''}`}>
          Tu compra ha sido realizada
        </div>
      )}
    </section>
    </>
  );
}
