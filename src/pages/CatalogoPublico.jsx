import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Catalogo.css';

const CART_KEY = 'cart';
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}
function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export default function CatalogoPublico() {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCartState] = useState(getCart());
  const [added, setAdded] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProductos)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setCart(cart); }, [cart]);

  // Tallas por tipo de producto
  function getSizes(prod) {
    if (prod.name.toLowerCase().includes('media')) {
      return ['4-6', '6-8', '8-10', '10-12', '12-14'];
    }
    return ['xxs', 'xs', 's', 'm', 'l', 'xl'];
  }

  const [selectedSizes, setSelectedSizes] = useState({});

  function handleSizeChange(prodId, size) {
    setSelectedSizes(prev => ({ ...prev, [prodId]: size }));
  }

  function addToCart(prod) {
    const size = selectedSizes[prod._id];
    if (!size) {
      setToast({ id: prod._id, name: prod.name, price: prod.price, imageUrl: prod.imageUrl, error: 'Selecciona una talla' });
      setTimeout(() => setToast(null), 2500);
      return;
    }
    setCartState(prev => {
      const exists = prev.find(i => i.productId === prod._id && i.size === size);
      if (exists) return prev.map(i => i.productId === prod._id && i.size === size ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: prod._id, quantity: 1, size }];
    });
    setAdded(prod._id + size);
    setToast({ id: prod._id, name: prod.name, price: prod.price, imageUrl: prod.imageUrl });
    setTimeout(() => setAdded(null), 1200);
    setTimeout(() => setToast(null), 3500);
  }

  if (loading) return <div className="empty-state">Cargando catálogo...</div>;
  if (!productos.length) return <div className="empty-state">Aún no hay uniformes disponibles.</div>;

  return (
    <section className="catalogo-section">
      <div className="catalogo-header">
        <h2 className="catalogo-titulo">Catálogo</h2>
        <div className="catalogo-subtitulo">Uniformes oficiales ICIT</div>
      </div>
      <div className="catalogo-grid premium">
        {productos.map(prod => (
          <div className="catalogo-card premium" key={prod._id}>
            <div className="catalogo-img-wrap">
              {prod.imageUrl && <img src={prod.imageUrl} alt={prod.name} className="catalogo-img" />}
            </div>
            <div className="catalogo-info">
              <div className="catalogo-nombre">{prod.name}</div>
              <div className="catalogo-desc">{prod.model}</div>
              <div className="catalogo-talla">
                <label htmlFor={`size-${prod._id}`}>Talla:&nbsp;</label>
                <select
                  id={`size-${prod._id}`}
                  value={selectedSizes[prod._id] || ''}
                  onChange={e => handleSizeChange(prod._id, e.target.value)}
                  style={{ minWidth: 80 }}
                >
                  <option value="">Selecciona</option>
                  {getSizes(prod).map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="catalogo-precio">{Number(prod.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
              {user && user.role === 'user' && (
                <button className="btn btn-primary catalogo-btn" onClick={() => addToCart(prod)} disabled={added===prod._id + (selectedSizes[prod._id] || '')}>
                  {added===prod._id + (selectedSizes[prod._id] || '') ? 'Agregado!' : 'Agregar al carrito'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Toast notification */}
      {toast && (
        <div className="addcart-toast" role="status">
          <div className="addcart-thumb">
            {toast.imageUrl ? <img src={toast.imageUrl} alt={toast.name} /> : <div className="placeholder" />}
          </div>
          <div className="addcart-body">
            <div className="addcart-title">Añadido al carrito</div>
            <div className="addcart-name">{toast.name}</div>
            <div className="addcart-price">{Number(toast.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</div>
            <div className="addcart-actions">
              <button className="btn btn-light" onClick={() => { setToast(null); navigate('/carrito'); }}>Ver carrito</button>
              <button className="btn btn-primary" onClick={() => { setToast(null); navigate('/carrito'); }}>Pagar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
