import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);

      // Decodificar el JWT
      const decodeJWT = (jwt) => {
        try {
          const payload = jwt.split('.')[1];
          const decoded = atob(payload);
          return JSON.parse(decoded);
        } catch (error) {
          console.error('Error al decodificar el token:', error);
          return null;
        }
      };

      const info = decodeJWT(token);

      if (info) {
        localStorage.setItem('userId', info.sub);
        localStorage.setItem('user', JSON.stringify({
          id: info.sub,
          user_name: info.user_name || info.email || '', // según lo que incluya tu JWT
          role: info.role,
        }));
      }

      // Elimina el token de la URL para no dejarlo visible
      window.history.replaceState({}, document.title, '/dashboard');

      // Navegar al dashboard
      navigate('/dashboard');
    } else {
      console.error('Token no encontrado en la URL');
      navigate('/login'); // O redirige a error si lo prefieres
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-700">Procesando inicio de sesión con Google...</p>
    </div>
  );
}

export default GoogleCallback;
