import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, CloudCog } from 'lucide-react';

function Login() {
  const [form, setForm] = useState({ usuario: '', contrasena: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.usuario || !form.contrasena) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://3.148.27.206/api/places/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: form.usuario,
          password: form.contrasena,
        }),
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text); // ahora intentamos convertirlo a JSON
      } catch (e) {
        data = {}; // si falla, dejamos un objeto vacío
      } 

      if (response.ok) {
        const authHeader = response.headers.get('Authorization');
        if (!authHeader) throw new Error('Token no recibido');
      
        const token = authHeader.replace('Bearer ', '');
        localStorage.setItem('token', token);
      
        const decodeJWT = (token) => {
          const payload = token.split('.')[1];
          const decoded = atob(payload);
          return JSON.parse(decoded);
        };
      
        const info = decodeJWT(token);
        localStorage.setItem('userId', info.sub);
        localStorage.setItem('user', JSON.stringify({
          id: info.sub,
          user_name: form.usuario,
          role: info.role,
        }));
        
        
      
        navigate('/dashboard');
      } 
      else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error de red. Intenta nuevamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-6">PLACES</h1>
  
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium">Usuario</label>
          <div className="relative">
            <input
              name="usuario"
              onChange={handleChange}
              className="input pl-10 w-full border border-gray-300 rounded-lg py-2 px-3"
              placeholder="Ingrese su usuario"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
  
        <div>
          <label className="block mb-1 text-sm font-medium">Contraseña</label>
          <div className="relative">
            <input
              type="password"
              name="contrasena"
              onChange={handleChange}
              className="input pl-10 w-full border border-gray-300 rounded-lg py-2 px-3"
              placeholder="Ingrese su contraseña"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
  
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
  
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin mr-2" size={20} />}
          {loading ? 'Entrando...' : 'Iniciar Sesión'}
        </button>
      </form>
  
      {/* Separador */}
      <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="px-3 text-sm text-gray-500">o</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>
  
      {/* Botón de Iniciar con Google */}
      <button
        type="button"
        onClick={async () => {
          try {
            // TODO: reemplazar con lógica real de OAuth con Google
            console.log("Redirigiendo a Google...");
            await new Promise((resolve) => setTimeout(resolve, 500));
            navigate('/dashboard');
          } catch (error) {
            console.error('Error al iniciar sesión con Google', error);
          }
        }}
        className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center"
      >
        <CloudCog className="mr-2" size={20} />
        Ingresar con Google
      </button>
    </div>
  );
  
}

export default Login;