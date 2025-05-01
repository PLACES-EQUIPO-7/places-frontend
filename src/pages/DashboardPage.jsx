import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardOwner from '../components/DashboardOwner';
import DashboardEmployee from '../components/DashboardEmployee';
import DashboardAggregator from '../components/DashboardAggregator';

function DashboardPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      navigate('/login');
    } else {
      setRole(currentUser.rol);
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return <div className="text-center p-6 text-white">Cargando...</div>;

  return (
    <div
      className="min-h-screen bg-center bg-cover relative"
      style={{ backgroundImage: 'url(/src/assets/mi-fondo.jpg)' }}
    >
      {/* Aquí se renderiza el dashboard según el rol */}
      <div className="min-h-screen w-full">
        {role === 'owner' && <DashboardOwner />}
        {role === 'employee' && <DashboardEmployee />}
        {role === 'aggregator' && <DashboardAggregator />}
      </div>
    </div>
  );
}

export default DashboardPage;
