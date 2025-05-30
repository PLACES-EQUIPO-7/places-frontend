import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardGeneral from './pages/DashboardGeneral';
import Registro from './pages/Registro';  
import PlaceDashboard from './pages/PlaceDashboard';
import Paquetes from './pages/Paquetes';
import Inventario from './pages/Inventario';
import Facturacion from './pages/Facturacion';
import Perfil from './pages/Perfil';
import EscanearPaquete from './pages/EscanearPaquete';
import LayoutConFooter from './components/LayoutConFooter';
import GoogleCallback from './components/GoogleCallback'; 
import ConfirmarPaquete from './pages/ConfirmarPaquete';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/google-callback" element={<GoogleCallback />} /> 

      {/* Agrupar todo lo que debe llevar footer dentro del layout */}
      <Route element={<LayoutConFooter />}>
        <Route path="/dashboard" element={<DashboardGeneral />} />
        <Route path="/registro" element={<Registro />} /> 
        <Route path="/tiendas/:placeId" element={<PlaceDashboard />} />
        <Route path="/tiendas/:placeId/paquetes" element={<Paquetes />} />
        <Route path="/tiendas/:placeId/inventario" element={<Inventario />} />
        <Route path="/tiendas/:placeId/facturacion" element={<Facturacion />} />
        <Route path="/tiendas/:placeId/perfil" element={<Perfil />} />
        <Route path="/tiendas/:placeId/EscanearPaquete" element={<EscanearPaquete />} />
        <Route path="/tiendas/:placeId/confirmar-paquete" element={<ConfirmarPaquete />} />

      </Route>
    </Routes>
  );
}

export default App;
