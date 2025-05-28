import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import cajas from "../assets/cajas.jpg";

const ConfirmarPaquete = () => {
  const { state: paquete } = useLocation();
  const navigate = useNavigate();
  const [confirmado, setConfirmado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const nuevoStatus = paquete.status === "PENDING" ? "RECEIVED" : "PENDING";

  const instruccionesPorCaso = {
    "PICK_UP-PENDING": "Verifica que coincidan los datos físicos antes de continuar.",
    "PICK_UP-RECEIVED": "Verifica con el comprador que el paquete este en buenas condiciones.",
    "DEVOLUTION-PENDING": "Este paquete está en proceso de devolución. Asegúrate de que se devuelva correctamente.",
    "DEVOLUTION-RECEIVED": "Estas a punto de entregar el paquete a la colecta. Confirma el registro final de esta devolución.",
  };

  const clave = `${paquete.type}-${paquete.status}`;
  const instrucciones = instruccionesPorCaso[clave] || "Verifica el paquete y confirma la operación.";

  const handleConfirmar = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://3.148.27.206/api/places/process", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...paquete,
          status: nuevoStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al confirmar el paquete.");
      }

      setConfirmado(true);
      setMensaje("✅ Operación confirmada exitosamente.");
    } catch (err) {
      console.error(err);
      setError("❌ No se pudo confirmar la operación. Intenta nuevamente.");
    }
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
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-xl w-full relative text-center"
      >
        {!confirmado ? (
          <>
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-3 rounded-lg shadow transition flex items-center gap-2"
            >
              <FaArrowLeft /> Atrás
            </button>

            <h2 className="text-3xl font-extrabold text-green-800 mb-4 mt-2">Confirmar Paquete</h2>
            <p className="mb-6 text-gray-700 font-medium">{instrucciones}</p>

            <button
              onClick={handleConfirmar}
              className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-semibold w-full"
            >
              Confirmar
            </button>

            {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
          </>
        ) : (
          <div className="flex flex-col items-center">
            <FaCheckCircle className="text-green-500 text-5xl mb-4" />
            <h2 className="text-3xl font-bold mb-2 text-green-800">¡Confirmado!</h2>
            <p className="text-gray-700 mb-6 font-medium">{mensaje}</p>

            <button
              onClick={() => {
                const placeId = localStorage.getItem("placeId");
                navigate(`/tiendas/${placeId}/EscanearPaquete`);
              }}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold w-full"
            >
              Volver al inicio
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConfirmarPaquete;
