import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaBarcode, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import cajas from "../assets/cajas.jpg";

const EscanearPaquete = () => {
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [mostrarContinuar, setMostrarContinuar] = useState(false);
  const [paquete, setPaquete] = useState(null);

  const navigate = useNavigate();
  const { placeId } = useParams();

  const handleScan = async () => {
    setMensaje("");
    setError("");
    setMostrarContinuar(false);
    setPaquete(null);

    if (!codigo.trim()) {
      setError("Por favor ingresa un código.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://3.148.27.206/api/places/start?target_id=${codigo}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Paquete no encontrado o error en el servidor.");
      }

      const data = await response.json();
      const { type, status, phrase } = data;

      setPaquete(data); // Guardamos el paquete para enviarlo después

      if (type === "PICK_UP" && status === "RECEIVED") {
        setMensaje(`Paquete listo para entregar`);
        setMostrarContinuar(true);
      } else if (type === "PICK_UP" && status === "PENDING") {
        setMensaje(`⏳ Te llegara un paquete`);
        setMostrarContinuar(true);
      } else if (type === "DEVOLUTION" && status === "PENDING") {
        setMensaje(`♻️ Paquete devuelto por parte del cliente`);
        setMostrarContinuar(true);
      } else if (type === "DEVOLUTION" && status === "RECEIVED") {
        setMensaje(`📥 Devolver a la colecta`);
        setMostrarContinuar(true);
      } else {
        setMensaje(`📦 Paquete con estado desconocido: ${status}`);
      }

    } catch (err) {
      console.error(err);
      setError("❌ Error al escanear el paquete. Verifica el código.");
    }

    setCodigo("");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-8"
      style={{ backgroundImage: `url(${cajas})` }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 relative"
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow transition flex items-center gap-2"
        >
          <FaArrowLeft /> Volver
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-green-800 mb-6 mt-4 flex justify-center items-center gap-2">
            <FaBarcode className="text-2xl" />
            Escanear Paquete
          </h1>

          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Escanea o ingresa el código del paquete"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition mb-4"
          />

          <button
            onClick={handleScan}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Escanear
          </button>

          {mensaje && (
            <p className="mt-6 text-green-700 font-medium flex items-center gap-2 justify-center">
              <FaCheckCircle /> {mensaje}
            </p>
          )}

          {error && (
            <p className="mt-6 text-red-600 font-medium flex items-center gap-2 justify-center">
              <FaTimesCircle /> {error}
            </p>
          )}

          {mostrarContinuar && (
            <button
              onClick={() => navigate(`/tiendas/${placeId}/confirmar-paquete`, { state: paquete })}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Continuar
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EscanearPaquete;
