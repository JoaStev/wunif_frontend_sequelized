import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';
import './AdminUsuarios.css';

export default function AdminUsuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null); // null o { ...campos }
  const [editId, setEditId] = useState(null); // id del usuario a editar
  const [success, setSuccess] = useState(null);
  const [excelLoading, setExcelLoading] = useState(false);
  // Subida de Excel
  async function handleExcelUpload(e) {
    setExcelLoading(true);
    setError(null); setSuccess(null);
    const file = e.target.files[0];
    if (!file) return setExcelLoading(false);
    const formData = new FormData();
    formData.append('excel', file);
    try {
      const res = await fetch('/api/users/upload-excel', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Error al subir Excel');
      setSuccess('Usuarios creados desde Excel');
      fetchUsuarios();
    } catch (err) {
      setError(err.message);
    } finally {
      setExcelLoading(false);
    }
  }

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
    setEditId(null);
    setForm({
      email: '', password: '', acudienteNombre: '', acudienteDocumento: '', estudianteNombre: '', estudianteDocumento: '', estudianteNacimiento: '', gradoSeccion: '', direccion: '', telefono: '', role: 'user'
    });
  }

  function handleEdit(u) {
    setEditId(u._id);
    setForm({
      email: u.email || '',
      password: '', // Solo si se quiere cambiar
      acudienteNombre: u.acudienteNombre || '',
      acudienteDocumento: u.acudienteDocumento || '',
      estudianteNombre: u.estudianteNombre || '',
      estudianteDocumento: u.estudianteDocumento || '',
      estudianteNacimiento: u.estudianteNacimiento || '',
      gradoSeccion: u.gradoSeccion || '',
      direccion: u.direccion || '',
      telefono: u.telefono || '',
      role: u.role || 'user'
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); setSuccess(null);
    try {
      let res;
      if (editId) {
        res = await fetch(`/api/users/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
          body: JSON.stringify(form)
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Error al editar usuario');
        setSuccess('Usuario editado');
      } else {
        res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
          body: JSON.stringify(form)
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Error al crear usuario');
        setSuccess('Usuario creado');
      }
      setForm(null);
      setEditId(null);
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
      .catch(() => setError('Usuario eliminado'));
  }

  return (
  <section className="admin-usuarios-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h2 className="admin-title">Usuarios</h2>
        <button className="btn btn-primary" onClick={handleNew} style={{ fontSize: '1em', padding: '8px 18px' }}>Crear usuario</button>
      </div>
      <div style={{marginBottom:18}}>
        <label style={{fontWeight:'bold'}}>Subir usuarios por Excel:</label>
        <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} disabled={excelLoading} style={{marginLeft:8}} />
        {excelLoading && <span style={{marginLeft:12}}>Procesando archivo...</span>}
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
                <th>Grado</th>
                <th>Rol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, idx) => (
                <tr key={u._id} className={u.role==='admin' ? 'admin-row' : idx%2===0 ? 'even-row' : 'odd-row'}>
                  <td className="admin-user-cell admin-user-name">{u.estudianteNombre || u.name || '—'}</td>
                  <td className="admin-user-cell admin-user-email">{u.email || '—'}</td>
                  <td className="admin-user-cell admin-user-grade">{u.gradoSeccion || '—'}</td>
                  <td className="admin-user-cell admin-user-role">{u.role}</td>
                  <td>
                    <button className="btn btn-secondary" style={{marginRight:8}} onClick={() => handleEdit(u)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(u._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {form && (
        <form onSubmit={handleSubmit} className="card" style={{ marginTop: 24, maxWidth: 900 }}>
          <h3>{editId ? 'Editar usuario' : 'Nuevo usuario'}</h3>
          <input name="email" placeholder="Email" value={form.email} onChange={handleInput} required type="email" />
          <input name="password" placeholder="Contraseña" value={form.password} onChange={handleInput} required={editId ? false : true} type="password" />
          <input name="acudienteNombre" placeholder="Nombre acudiente" value={form.acudienteNombre} onChange={handleInput} required />
          <input name="acudienteDocumento" placeholder="Documento acudiente" value={form.acudienteDocumento} onChange={handleInput} required pattern="\d{6,12}" />
          <input name="estudianteNombre" placeholder="Nombre estudiante" value={form.estudianteNombre} onChange={handleInput} required />
          <input name="estudianteDocumento" placeholder="Documento estudiante" value={form.estudianteDocumento} onChange={handleInput} required pattern="\d{6,12}" />
          <input name="estudianteNacimiento" placeholder="Nacimiento (YYYY-MM-DD)" value={form.estudianteNacimiento} onChange={handleInput} required type="date" />
          <select name="gradoSeccion" value={form.gradoSeccion} onChange={handleInput} required>
            <option value="">Grado/Sección</option>
            {[...Array(11)].flatMap((_,i)=>[`${i+1}-1`,`${i+1}-2`]).map(g=>(<option key={g} value={g}>{g}</option>))}
          </select>
          <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleInput} required minLength={5} />
          <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleInput} required pattern="\d{10}" />
          <select name="role" value={form.role} onChange={handleInput} required>
            <option value="user">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn btn-primary" type="submit">Guardar</button>
          <button className="btn btn-secondary" type="button" onClick={()=>{setForm(null);setEditId(null);}} style={{ marginLeft: 8 }}>Cancelar</button>
        </form>
      )}
      {error && <div className="toast" style={{ background:'#e53e3e' }}>{error}</div>}
      {success && <div className="toast" style={{ background:'#2EC4B6' }}>{success}</div>}
    </section>
  );
}
