import { useLocation, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/cajas.jpg";

function PlaceDashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Intentamos obtener datos de state, si no están, usamos localStorage
  const place = state?.place ?? {
    id: localStorage.getItem("placeId"),
    name: localStorage.getItem("placeName"),
    address: localStorage.getItem("placeAddress"),
  };

  const role = state?.role ?? localStorage.getItem("placeRole");

  // Si falta lugar o id, mostramos error
  if (!place || !place.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">No se encontró la información del lugar.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

const readableRole =
  role === "PLACE_OWNER"
    ? "Dueño"
    : role === "PLACE_EMPLOYEE"
    ? "Trabajador"
    : role === "PLACE_AGGREGATOR"
    ? "Administrador"
    : "Desconocido";


  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-3xl mx-auto bg-white bg-opacity-95 rounded-xl shadow-lg p-6 relative">
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-4 right-4 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
        >
          Volver al inicio
        </button>

        <h1 className="text-3xl font-bold text-green-700 mb-2">Bienvenido a {place.name}</h1>
        <p className="text-gray-700 mb-1">Dirección: {place.address}</p>
        <p className="text-gray-700 mb-6">
          Rol: <span className="font-semibold">{readableRole}</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OptionCard title="Paquetes Próximos" path={`/tiendas/${place.id}/paquetes`} />
          <OptionCard title="Inventario" path={`/tiendas/${place.id}/inventario`} />
          <OptionCard title="Facturación" path={`/tiendas/${place.id}/facturacion`} />
          <OptionCard title="Mi Perfil" path={`/tiendas/${place.id}/perfil`} />
        </div>
      </div>
    </div>
  );
}

function OptionCard({ title, path }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="bg-green-50 p-6 rounded-lg shadow hover:shadow-md cursor-pointer transition-all"
    >
      <h3 className="text-lg font-semibold text-green-800">{title}</h3>
    </div>
  );
}

export default PlaceDashboard;
