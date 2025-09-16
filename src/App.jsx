import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CatalogoPublico from './pages/CatalogoPublico';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ContactoPage from './pages/ContactoPage';
import PrivateRoute from './routes/PrivateRoute';
import Perfil from './pages/Perfil';
import Carrito from './pages/Carrito';


import AdminUsuarios from './pages/AdminUsuarios';
import AdminProductos from './pages/AdminProductos';

import AdminStats from './pages/AdminStats';
import AdminMensajes from './pages/AdminMensajes';

import { useAuth } from './context/AuthContext';



export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ maxWidth: 700, margin: '2em auto', padding: '1em' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<CatalogoPublico />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contacto" element={<ContactoPage />} />

          {/* Rutas privadas para usuario */}

          <Route element={<PrivateRoute />}> 
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/carrito" element={<Carrito />} />
          </Route>

          {/* Rutas privadas para admin */}
          <Route element={<PrivateRoute role="admin" />}> 
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="/admin/productos" element={<AdminProductos />} />
            <Route path="/admin/stats" element={<AdminStats />} />
            <Route path="/admin/mensajes" element={<AdminMensajes />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
