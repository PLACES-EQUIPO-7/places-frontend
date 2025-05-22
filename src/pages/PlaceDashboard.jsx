import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBox, FaClipboardList, FaFileInvoiceDollar, FaUser } from "react-icons/fa";
import backgroundImage from "../assets/cajas.jpg";

function PlaceDashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const place = state?.place ?? {
    id: localStorage.getItem("placeId"),
    name: localStorage.getItem("placeName"),
    address: localStorage.getItem("placeAddress"),
  };

  const role = state?.role ?? localStorage.getItem("placeRole");

  if (!place || !place.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white bg-opacity-90">
        <div className="text-center p-6 rounded-xl shadow-md bg-white/80 backdrop-blur-md">
          <p className="text-red-600 text-lg font-semibold mb-4">
            No se encontró la información del lugar.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
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
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <motion.div
      className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-2xl p-8 backdrop-blur-md relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Botones superiores: Perfil y Volver */}
      <div className="absolute top-4 right-4 flex gap-3">
        <button
          onClick={() => navigate(`/tiendas/${place.id}/perfil`)}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-lg shadow transition flex items-center gap-2"
        >
          <FaUser className="text-lg" />
          Mi Perfil
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow transition"
        >
          Volver al inicio
        </button>
      </div>

      <h1 className="text-3xl font-extrabold text-green-800 mb-2">
        Bienvenido a <span className="italic">{place.name}</span>
      </h1>
      <p className="text-gray-700 mb-1">📍 Dirección: {place.address}</p>
      <p className="text-gray-700 mb-6">
        🧑 Rol: <span className="font-semibold">{readableRole}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <OptionCard
          title="Paquetes Próximos"
          icon={<FaBox className="text-3xl text-green-600" />}
          path={`/tiendas/${place.id}/paquetes`}
        />
        <OptionCard
          title="Inventario"
          icon={<FaClipboardList className="text-3xl text-green-600" />}
          path={`/tiendas/${place.id}/inventario`}
        />
        <OptionCard
          title="Facturación"
          icon={<FaFileInvoiceDollar className="text-3xl text-green-600" />}
          path={`/tiendas/${place.id}/facturacion`}
        />
      </div>
    </motion.div>
  </div>
);

}

function OptionCard({ title, path, icon }) {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(path)}
      className="bg-green-50 p-6 rounded-xl shadow hover:shadow-lg cursor-pointer transition-all flex items-center space-x-4 hover:bg-green-100"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div>{icon}</div>
      <h3 className="text-lg font-semibold text-green-800">{title}</h3>
    </motion.div>
  );
}

export default PlaceDashboard;
