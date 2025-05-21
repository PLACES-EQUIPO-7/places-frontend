import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("TODOS");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const placeId = localStorage.getItem("placeId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const obtenerEndpoint = () => {
    const baseUrl = `http://3.148.27.206/api/places/shipments?place_id=${placeId}&status=RECEIVED`;
    if (filtro === "PICK_UP") return `${baseUrl}&type=PICK_UP`;
    if (filtro === "DEVOLUTION") return `${baseUrl}&type=DEVOLUTION`;
    return baseUrl;
  };

  const cargarProductos = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(obtenerEndpoint(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al cargar productos del inventario.");

      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError(err.message || "Error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (placeId && token) {
      cargarProductos();
    } else {
      setError("No se encontró el ID del lugar o el token.");
    }
  }, [filtro]);

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: 'url("/src/assets/mi-fondo.jpg")' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl mx-auto bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative"
      >
        {/* Botón regresar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-white font-semibold transition"
        >
          ← Regresar
        </motion.button>

        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800 drop-shadow">
          Inventario
        </h1>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {["TODOS", "PICK_UP", "DEVOLUTION"].map((tipo) => (
            <motion.button
              key={tipo}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full font-semibold shadow transition-all duration-300 text-sm tracking-wide ${
                filtro === tipo
                  ? tipo === "PICK_UP"
                    ? "bg-green-600 text-white"
                    : tipo === "DEVOLUTION"
                    ? "bg-red-600 text-white"
                    : "bg-blue-600 text-white"
                  : "bg-white/90 border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setFiltro(tipo)}
            >
              {tipo === "TODOS"
                ? "Todos"
                : tipo === "PICK_UP"
                ? "Para Entregar"
                : "Para Devolver"}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-600 animate-pulse">Cargando productos...</p>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        ) : productos.length === 0 ? (
          <p className="text-center text-gray-600">No hay productos disponibles.</p>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {productos.map((producto) => (
                <motion.div
                  key={producto.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transform hover:scale-105 transition-all border border-gray-200"
                >
                  <h3 className="font-bold text-xl text-green-700 mb-2">
                    Producto #{producto.id}
                  </h3>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Frase:</span> {producto.phrase}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        producto.status === "RECEIVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      Estado: {producto.status}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        producto.type === "PICK_UP"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      Tipo: {producto.type}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
