import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardGeneral from './pages/DashboardGeneral';
import Registro from './pages/Registro';  

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardGeneral />} />
      <Route path="/registro" element={<Registro />} /> 
    </Routes>
  );
}

export default App;
