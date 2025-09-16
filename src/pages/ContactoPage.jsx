import React from 'react';

export default function ContactoPage() {
  // Aquí irá el formulario de contacto
  return (
    <section style={{ maxWidth: 500, margin: '2em auto' }}>
      <h2>Contáctanos</h2>
      <form>
        <label htmlFor="fromName">Nombre</label>
        <input id="fromName" name="fromName" required />
        <label htmlFor="fromEmail">Correo electrónico</label>
        <input id="fromEmail" name="fromEmail" type="email" required />
        <label htmlFor="subject">Asunto</label>
        <input id="subject" name="subject" required />
        <label htmlFor="body">Mensaje</label>
        <textarea id="body" name="body" rows={4} required />
        <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Enviar</button>
      </form>
    </section>
  );
}
