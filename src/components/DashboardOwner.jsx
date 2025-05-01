import { useState, useEffect } from 'react';
import { PlusCircle, LogOut, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardOwner = () => {
  const [tiendas, setTiendas] = useState([]);
  const [modalTiendaAbierto, setModalTiendaAbierto] = useState(false);
  const [modalPerfilAbierto, setModalPerfilAbierto] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navigate = useNavigate();

  const [nuevaTienda, setNuevaTienda] = useState({
    nombre: '',
    direccion: '',
    codigoPostal: '',
    latitud: '',
    longitud: '',
  });

  const [perfil, setPerfil] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    email: '',
    contrasena: '',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.tienda) {
        setTiendas([user.tienda]);
      }
      setPerfil({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        usuario: user.usuario || '',
        email: user.email || '',
        contrasena: user.contrasena || '',
      });
    }
  }, []);

  const handleInputTienda = (e) => {
    setNuevaTienda({ ...nuevaTienda, [e.target.name]: e.target.value });
  };

  const handleInputPerfil = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const guardarTienda = () => {
    const updatedTiendas = [...tiendas, nuevaTienda];
    setTiendas(updatedTiendas);

    const user = JSON.parse(localStorage.getItem('user'));
    user.tienda = nuevaTienda;
    localStorage.setItem('user', JSON.stringify(user));

    setModalTiendaAbierto(false);
    setNuevaTienda({ nombre: '', direccion: '', codigoPostal: '', latitud: '', longitud: '' });
  };

  const guardarPerfil = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...user, ...perfil };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert('Perfil actualizado exitosamente');
    setModalPerfilAbierto(false);
  };

  const cerrarSesion = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen">
      <header className="bg-sky-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-2xl font-bold tracking-wide">PLACES</div>
        <div className="text-xl font-semibold">Mis Tiendas</div>
        <div className="flex items-center gap-4">
          <button onClick={() => setModalPerfilAbierto(true)} className="flex items-center hover:text-blue-300">
            <Pencil className="mr-1" size={18} /> Editar Perfil
          </button>
          <button onClick={cerrarSesion} className="flex items-center hover:text-red-300">
            <LogOut className="mr-1" size={18} /> Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="mb-4">
          <button
            onClick={() => setModalTiendaAbierto(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <PlusCircle className="mr-2" /> Crear Tienda
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tiendas.map((tienda, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/store/${encodeURIComponent(tienda.nombre)}`)}
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-100 transition"
            >
              <h2 className="text-lg font-semibold">{tienda.nombre}</h2>
              <p className="text-sm text-gray-600">{tienda.direccion}</p>
              <p className="text-sm text-gray-500">CP: {tienda.codigoPostal}</p>
              <p className="text-sm text-gray-500">Lat: {tienda.latitud} | Long: {tienda.longitud}</p>
            </div>
          ))}
        </div>
      </main>

      {modalTiendaAbierto && (
        <Modal title="Nueva Tienda" onClose={() => setModalTiendaAbierto(false)}>
          {['nombre', 'direccion', 'codigoPostal', 'latitud', 'longitud'].map((field) => (
            <input
              key={field}
              name={field}
              value={nuevaTienda[field]}
              onChange={handleInputTienda}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            />
          ))}
          <div className="flex justify-end gap-2">
            <button onClick={() => setModalTiendaAbierto(false)} className="text-gray-500">Cancelar</button>
            <button onClick={guardarTienda} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Guardar
            </button>
          </div>
        </Modal>
      )}

      {modalPerfilAbierto && (
        <Modal title="Editar Perfil" onClose={() => setModalPerfilAbierto(false)}>
          <form className="space-y-4">
            {['nombre', 'apellido', 'usuario', 'email'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field}
                </label>
                <input
                  name={field}
                  value={perfil[field]}
                  onChange={handleInputPerfil}
                  placeholder={`Tu ${field}`}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="flex items-center border border-gray-300 rounded px-3 py-2">
                <input
                  type={mostrarContrasena ? 'text' : 'password'}
                  name="contrasena"
                  value={perfil.contrasena}
                  onChange={handleInputPerfil}
                  className="w-full outline-none"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  className="text-sm text-blue-600 ml-2"
                >
                  {mostrarContrasena ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setModalPerfilAbierto(false)} className="text-gray-500">Cancelar</button>
              <button onClick={guardarPerfil} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Guardar Cambios
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-lg">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {children}
      <div className="text-right">
        <button onClick={onClose} className="text-sm text-gray-400 hover:underline">Cerrar</button>
      </div>
    </div>
  </div>
);

export default DashboardOwner;
