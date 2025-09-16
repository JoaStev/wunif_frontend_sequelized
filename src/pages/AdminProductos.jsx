import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminProductos() {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null); // null o { ...campos }
  const [success, setSuccess] = useState(null);

  function fetchProductos() {
    setLoading(true);
    fetch('/api/products', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(setProductos)
      .catch(() => setError('Error cargando productos'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchProductos(); }, []);

  function handleInput(e) {
    const { name, value, type } = e.target;
    if (name === 'price') {
      // Permitir ingresar 10000, 10.000, 10,000 y convertir a entero
      const clean = value.replace(/\D/g, '');
      setForm(f => ({ ...f, price: clean ? Number(clean) : '' }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleNew() {
    setForm({ name: '', model: '', size: '', price: '', imageUrl: '', isActive: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); setSuccess(null);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setForm(null);
      setSuccess('Producto publicado en el catálogo.');
      fetchProductos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar producto?')) return;
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` }
    });
    fetchProductos();
  }

  return (
    <section>
      <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '2em', color: 'var(--color-primary)', marginBottom: 18 }}>Productos</h2>
      <button className="btn btn-primary" onClick={handleNew} style={{ marginBottom: 16 }}>Crear producto</button>
      {loading ? (
        <div className="empty-state">Cargando...</div>
      ) : productos.length === 0 ? (
        <div className="empty-state">Aún no hay uniformes disponibles.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ fontSize: 15 }}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Modelo</th>
                <th>Talla</th>
                <th>Precio</th>
                <th>Activo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p._id} style={{ background: p.isActive ? '#fff' : '#f8fafc' }}>
                  <td>{p.name}</td>
                  <td>{p.model}</td>
                  <td>{p.size}</td>
                  <td><span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{Number(p.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span></td>
                  <td>{p.isActive ? <span style={{ color: '#2EC4B6', fontWeight: 600 }}>Sí</span> : <span style={{ color: '#e53e3e' }}>No</span>}</td>
                  <td><button className="btn btn-danger" onClick={() => handleDelete(p._id)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {form && (
        <form onSubmit={handleSubmit} className="card" style={{ marginTop: 24, maxWidth: 500 }}>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 16 }}>Nuevo producto</h3>
          <label>Nombre
            <input name="name" placeholder="Nombre" value={form.name} onChange={handleInput} required minLength={3} />
          </label>
          <label>Modelo
            <input name="model" placeholder="Modelo" value={form.model} onChange={handleInput} required minLength={2} />
          </label>
          <label>Talla
            <input name="size" placeholder="Talla" value={form.size} onChange={handleInput} required />
          </label>
          <label>Precio
            <input
              name="price"
              placeholder="Precio"
              value={form.price ? Number(form.price).toLocaleString('es-CO') : ''}
              onChange={handleInput}
              required
              inputMode="numeric"
              pattern="[0-9,.]*"
              title="Ingresa el precio en pesos colombianos"
            />
          </label>
          <label>URL de imagen
            <input name="imageUrl" placeholder="URL de imagen" value={form.imageUrl} onChange={handleInput} type="url" />
          </label>
          <label style={{ display: 'block', margin: '8px 0', textAlign: 'left' }}>
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} /> Activo en catálogo
          </label>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-primary" type="submit">Guardar</button>
            <button className="btn btn-secondary" type="button" onClick={()=>setForm(null)}>Cancelar</button>
          </div>
        </form>
      )}
      {error && <div className="toast" style={{ background:'#fff', color:'var(--color-danger)', borderLeft:'6px solid var(--color-danger)' }}>{error}</div>}
      {success && <div className="toast" style={{ background:'#fff', color:'#2EC4B6', borderLeft:'6px solid #2EC4B6' }}>{success}</div>}
    </section>
  );
}
