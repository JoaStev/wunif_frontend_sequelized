import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminUsuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null); // null o { ...campos }
  const [success, setSuccess] = useState(null);

  function fetchUsuarios() {
    setLoading(true);
    fetch('/api/users', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setUsuarios(data.data || []))
      .catch(() => setError('Error cargando usuarios'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchUsuarios(); }, []);

  function handleInput(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleNew() {
    setForm({
      email: '', password: '', acudienteNombre: '', acudienteDocumento: '', estudianteNombre: '', estudianteDocumento: '', estudianteNacimiento: '', gradoSeccion: '', direccion: '', telefono: '', role: 'user'
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); setSuccess(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Error al crear usuario');
      setSuccess('Usuario creado');
      setForm(null);
      fetchUsuarios();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDelete(id) {
    setError(null); setSuccess(null);
    fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(() => { setSuccess('Usuario eliminado'); fetchUsuarios(); })
      .catch(() => setError('Error eliminando usuario'));
  }

  return (
    <section className="admin-usuarios-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h2 className="admin-title">Usuarios</h2>
        <button className="btn btn-primary" onClick={handleNew} style={{ fontSize: '1em', padding: '8px 18px' }}>Crear usuario</button>
      </div>
      {loading ? (
        <div className="empty-state">Cargando...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, idx) => (
                <tr key={u._id} className={u.role==='admin' ? 'admin-row' : idx%2===0 ? 'even-row' : 'odd-row'}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td><button className="btn btn-danger" onClick={() => handleDelete(u._id)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {form && (
        <form onSubmit={handleSubmit} className="card" style={{ marginTop: 24, maxWidth: 500 }}>
          <h3>Nuevo usuario</h3>
          <input name="email" placeholder="Email" value={form.email} onChange={handleInput} required type="email" />
          <input name="password" placeholder="Contraseña inicial" value={form.password} onChange={handleInput} required type="password" />
          <input name="acudienteNombre" placeholder="Nombre acudiente" value={form.acudienteNombre} onChange={handleInput} required />
          <input name="acudienteDocumento" placeholder="Documento acudiente" value={form.acudienteDocumento} onChange={handleInput} required pattern="\d{6,12}" />
          <input name="estudianteNombre" placeholder="Nombre estudiante" value={form.estudianteNombre} onChange={handleInput} required />
          <input name="estudianteDocumento" placeholder="Documento estudiante" value={form.estudianteDocumento} onChange={handleInput} required pattern="\d{6,12}" />
          <input name="estudianteNacimiento" placeholder="Nacimiento (YYYY-MM-DD)" value={form.estudianteNacimiento} onChange={handleInput} required type="date" />
          <select name="gradoSeccion" value={form.gradoSeccion} onChange={handleInput} required>
            <option value="">Grado/Sección</option>
            {[...Array(11)].flatMap((_,i)=>[`${i+1}.1`,`${i+1}.2`]).map(g=>(<option key={g} value={g}>{g}</option>))}
          </select>
          <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleInput} required minLength={5} />
          <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleInput} required pattern="\d{10}" />
          <select name="role" value={form.role} onChange={handleInput} required>
            <option value="user">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn btn-primary" type="submit">Guardar</button>
          <button className="btn btn-secondary" type="button" onClick={()=>setForm(null)} style={{ marginLeft: 8 }}>Cancelar</button>
        </form>
      )}
      {error && <div className="toast" style={{ background:'#e53e3e' }}>{error}</div>}
      {success && <div className="toast" style={{ background:'#2EC4B6' }}>{success}</div>}
    </section>
  );
}
