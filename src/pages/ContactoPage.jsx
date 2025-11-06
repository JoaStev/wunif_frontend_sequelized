import React, { useState } from 'react';

export default function ContactoPage() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const form = e.target;
    const data = {
      fromName: form.fromName.value,
      fromEmail: form.fromEmail.value,
      subject: form.subject.value,
      body: form.body.value,
    };

    try {
      setSending(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      setStatus({ ok: true, message: 'Mensaje enviado. ¡Gracias!' });
      form.reset();
    } catch (err) {
      console.error('Error enviando contacto:', err);
      setStatus({ ok: false, message: 'Error enviando el mensaje. Intenta de nuevo.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section style={{ maxWidth: 500, margin: '2em auto' }}>
      <h2>Contáctanos</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fromName">Nombre</label>
        <input id="fromName" name="fromName" required />
        <label htmlFor="fromEmail">Correo electrónico</label>
        <input id="fromEmail" name="fromEmail" type="email" required />
        <label htmlFor="subject">Asunto</label>
        <input id="subject" name="subject" required />
        <label htmlFor="body">Mensaje</label>
        <textarea id="body" name="body" rows={4} required />
        <button className="btn btn-primary" type="submit" style={{ width: '100%' }} disabled={sending}>
          {sending ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      {status && (
        <div style={{ marginTop: 12, color: status.ok ? 'green' : 'red' }}>{status.message}</div>
      )}
    </section>
  );
}
