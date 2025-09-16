import React from 'react';
import '../icit-ui.css';

const Home = () => {
  return (
    <section className="home-hero-section">
      <div className="home-hero-bg"></div>
      <div className="home-hero-content">
        <h1 className="home-hero-title">
          Uniformes ICIT
          <span className="home-hero-sub">Calidad, identidad y comodidad para tu colegio</span>
        </h1>
        <p className="home-hero-desc">
          Descubre la colección oficial de uniformes del Colegio ICIT. Compra fácil, seguro y con atención personalizada.
        </p>
        <div className="home-hero-btns">
          <a href="/catalogo" className="icit-btn icit-btn-lg icit-btn-gold">Ver Catálogo</a>
          <a href="/contacto" className="icit-btn icit-btn-lg icit-btn-outline">Contáctanos</a>
        </div>
      </div>
      <div className="home-hero-graphic">
        <div className="home-hero-shape shape-1"></div>
        <div className="home-hero-shape shape-2"></div>
        <div className="home-hero-shape shape-3"></div>
        <img src="/icit-logo.png" alt="Logo ICIT" className="home-hero-logo" />
      </div>
    </section>
  );
};

export default Home;
