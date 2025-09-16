import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminMensajes() {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [success, setSuccess] = useState(null);

  function fetchMensajes() {
    setLoading(true);
    fetch('/api/messages', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(setMensajes)
      .catch(() => setError('Error cargando mensajes'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchMensajes(); }, []);

  async function handleResponder(e) {
    e.preventDefault();
    setError(null); setSuccess(null);
    try {
      const res = await fetch(`/api/messages/${selected._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ respuesta })
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setSuccess('Respuesta enviada por email.');
      setRespuesta('');
      setSelected(null);
      fetchMensajes();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="admin-mensajes-container">
      <h2 className="admin-title">Mensajes de Contacto</h2>
      {loading ? (
        <div className="empty-state">Cargando...</div>
      ) : mensajes.length === 0 ? (
        <div className="empty-state">No hay mensajes.</div>
      ) : (
        <div className="admin-mensajes-list">
          {mensajes.map(msg => (
            <div className="admin-mensaje-card" key={msg._id}>
              <div className="admin-mensaje-header">{msg.name} &lt;{msg.email}&gt;</div>
              <div className="admin-mensaje-date">{msg.createdAt && new Date(msg.createdAt).toLocaleString()}</div>
              <div className="admin-mensaje-body">{msg.message}</div>
              <button className="btn btn-danger" onClick={() => handleDelete(msg._id)}>Eliminar</button>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <form onSubmit={handleResponder} className="card" style={{ marginTop: 24, maxWidth: 500 }}>
          <h3>Responder a {selected.name}</h3>
          <div style={{ marginBottom: 8 }}><b>Mensaje:</b> {selected.mensaje}</div>
          <textarea value={respuesta} onChange={e => setRespuesta(e.target.value)} required placeholder="Escribe tu respuesta..." rows={4} />
          <button className="btn btn-primary" type="submit">Enviar respuesta</button>
          <button className="btn btn-secondary" type="button" onClick={()=>setSelected(null)} style={{ marginLeft: 8 }}>Cancelar</button>
        </form>
      )}
      {error && <div className="toast" style={{ background:'#fff', color:'var(--color-danger)', borderLeft:'6px solid var(--color-danger)' }}>{error}</div>}
      {success && <div className="toast" style={{ background:'#fff', color:'#2EC4B6', borderLeft:'6px solid #2EC4B6' }}>{success}</div>}
    </section>
  );
}
