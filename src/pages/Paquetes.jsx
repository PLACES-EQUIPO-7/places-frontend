import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import backgroundImage from "../assets/cajas.jpg";

function Paquetes() {
  const navigate = useNavigate();
  const placeId = localStorage.getItem("placeId");
  const placeName = localStorage.getItem("placeName");
  const token = localStorage.getItem("token");

  const [paquetes, setPaquetes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!placeId || !token) {
      setError("Falta la información necesaria para obtener los paquetes.");
      return;
    }

    const fetchPaquetes = async () => {
      try {
        const response = await fetch(
          `http://3.148.27.206/api/places/shipments?place_id=${Number(placeId)}&status=PENDING&type=PICK_UP`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los paquetes.");
        }

        const data = await response.json();
        setPaquetes(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los paquetes.");
      }
    };

    fetchPaquetes();
  }, [placeId, token]);

  return (
    <div
      className="min-h-screen bg-cover bg-center overflow-auto"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="min-h-screen bg-black/30 backdrop-blur-sm flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-5xl bg-white/90 rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            ← Volver
          </button>

          {error ? (
            <p className="text-red-600 text-lg font-semibold">{error}</p>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-green-800 mb-2">
                Paquetes próximos en{" "}
                <span className="italic text-green-700">{placeName}</span>
              </h1>
              <p className="mb-6 text-gray-800 font-medium">
                Total de paquetes por recibir:{" "}
                <span className="font-bold">{paquetes.length}</span>
              </p>

              {paquetes.length === 0 ? (
                <p className="text-gray-600 italic">No hay paquetes pendientes por llegar.</p>
              ) : (
                <ul className="space-y-6 overflow-y-auto">
                  {paquetes.map((paq, index) => (
                    <motion.li
                      key={paq.id}
                      className="border p-5 rounded-xl shadow-md bg-green-50 hover:bg-green-100 transition"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <p className="font-semibold text-lg text-green-800 mb-1">
                        📦 {paq.phrase}
                      </p>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          <strong>ID:</strong>{" "}
                          <span className="font-mono">{paq.id}</span>
                        </p>
                        <p>
                          <strong>Tipo:</strong>{" "}
                          <span className="capitalize">
                            {paq.type.toLowerCase().replace("_", " ")}
                          </span>
                        </p>
                        <p>
                          <strong>Estado:</strong>{" "}
                          <span className="font-semibold">{paq.status}</span>
                        </p>
                        <p>
                          <strong>Tipo receptor:</strong> {paq.receiver_type}
                        </p>
                        <p>
                          <strong>Fecha entrega:</strong>{" "}
                          {paq.delivered_at
                            ? new Date(paq.delivered_at).toLocaleString()
                            : "No entregado"}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Paquetes;
