import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <div>
      <footer className="footer-icit" style={{ background: 'var(--color-primary)', color: '#fff', padding: '2em 0 1em 0', borderTop: '4px solid var(--color-accent)', marginTop: '3em' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2em', alignItems: 'center', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ minWidth: 220 }}>
            <div style={{ fontWeight: 700, fontSize: '1.1em', marginBottom: 4 }}>Contacto: <span style={{ fontWeight: 400 }}>+57 3173683264</span></div>
            <a href="mailto:icit64@gmail.com" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 500, display: 'block' }}>icit64@gmail.com</a>
            <a href="mailto:icit64@yahoo.com" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 500, display: 'block' }}>icit64@yahoo.com</a>
          </div>
          <div style={{ minWidth: 220, marginTop: 8 }}>
            <div style={{ fontWeight: 700, fontSize: '1.1em', marginBottom: 4 }}>Dirección:</div>
            <div>Cra 75 # 3d-41</div>
            <div>Cali, Colombia</div>
          </div>
          </div>
           <div style={{ color: '#ffffffff', fontSize: '0.95em', marginTop: '0.5em' }}>
         © {new Date().getFullYear()} ICIT. Todos los derechos reservados.
          </div>
      </footer>
    </div>
  );
}
