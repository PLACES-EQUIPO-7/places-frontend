import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardGeneral from './pages/DashboardGeneral';
import Registro from './pages/Registro';  
import PlaceDashboard from './pages/PlaceDashboard';
import Paquetes from './pages/Paquetes';
import Inventario from './pages/Inventario';
import Facturacion from './pages/Facturacion';
import Perfil from './pages/Perfil';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardGeneral />} />
      <Route path="/registro" element={<Registro />} /> 
      <Route path="/tiendas/:placeId" element={<PlaceDashboard />} />

      {/* Rutas para las vistas dentro de una tienda */}
      <Route path="/tiendas/:placeId/paquetes" element={<Paquetes />} />
      <Route path="/tiendas/:placeId/inventario" element={<Inventario />} />
      <Route path="/tiendas/:placeId/facturacion" element={<Facturacion />} />
      <Route path="/tiendas/:placeId/perfil" element={<Perfil />} />
    </Routes>
  );
}

export default App;
