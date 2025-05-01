import { useState } from 'react';
import { User, Mail, Lock, IdCard, MapPin, Store, Map, LocateFixed, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    email: '',
    contrasena: '',
    tipoCedula: 'CC',
    cedula: '',
    nombreLocal: '',
    direccion: '',
    codigoPostal: '',
    latitud: '',
    longitud: '',
    rol: 'owner', // Agregar campo para rol
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de registro
    setTimeout(() => {
      setLoading(false);

      // Crear un objeto de usuario con los datos del formulario
      const newUser = {
        nombre: form.nombre,
        apellido: form.apellido,
        usuario: form.usuario,
        email: form.email,
        contrasena: form.contrasena,
        tipoCedula: form.tipoCedula,
        cedula: form.cedula,
        rol: form.rol, // Usar el rol seleccionado
        tienda: {
          nombre: form.nombreLocal,
          direccion: form.direccion,
          codigoPostal: form.codigoPostal,
          latitud: form.latitud,
          longitud: form.longitud,
        },
      };

      // Guardar el usuario y tienda en localStorage
      localStorage.setItem('user', JSON.stringify(newUser));

      alert('Registro exitoso (simulado)');
      navigate('/login');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-6">Registro</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda - Datos del usuario */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Datos del Usuario</h2>

          <Input label="Nombre" icon={<User />} name="nombre" onChange={handleChange} />
          <Input label="Apellido" icon={<User />} name="apellido" onChange={handleChange} />
          <Input label="Usuario" icon={<User />} name="usuario" onChange={handleChange} />
          <Input label="Email" icon={<Mail />} name="email" type="email" onChange={handleChange} />
          <Input label="Contraseña" icon={<Lock />} name="contrasena" type="password" onChange={handleChange} />
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Tipo de cédula</label>
            <select
              name="tipoCedula"
              onChange={handleChange}
              className="input"
              value={form.tipoCedula}
            >
              <option value="CC">CC</option>
              <option value="TI">TI</option>
              <option value="CE">CE</option>
            </select>
          </div>
          <Input label="Número de cédula" icon={<IdCard />} name="cedula" onChange={handleChange} />
          
          {/* Seleccionar rol */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Rol</label>
            <select
              name="rol"
              onChange={handleChange}
              className="input"
              value={form.rol}
            >
              <option value="owner">Dueño</option>
              <option value="employee">Empleado</option>
              <option value="aggregator">Agregador</option>
            </select>
          </div>
        </div>

        {/* Columna derecha - Datos del local */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Datos del Local</h2>

          <Input label="Nombre del local" icon={<Store />} name="nombreLocal" onChange={handleChange} />
          <Input label="Dirección" icon={<MapPin />} name="direccion" onChange={handleChange} />
          <Input label="Código postal" icon={<Map />} name="codigoPostal" onChange={handleChange} />
          <Input label="Latitud" icon={<LocateFixed />} name="latitud" onChange={handleChange} />
          <Input label="Longitud" icon={<LocateFixed />} name="longitud" onChange={handleChange} />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
        disabled={loading}
      >
        {loading && <Loader2 className="animate-spin mr-2" size={20} />}
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
          Volver al login
        </Link>
      </p>
    </form>
  );
};

const Input = ({ label, icon, name, onChange, type = 'text' }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <div className="relative">
      <input
        name={name}
        type={type}
        onChange={onChange}
        className="input pl-10"
        placeholder={label}
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
    </div>
  </div>
);

export default Register;
