import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cajasFondo from "../assets/cajas.jpg";

export default function Facturacion() {
  const navigate = useNavigate();

  const [mes, setMes] = useState(new Date().getMonth() + 1); // 1-12
  const [año, setAño] = useState(new Date().getFullYear());
  const [facturacion, setFacturacion] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const placeId = localStorage.getItem("placeId");

  const obtenerFacturacion = async () => {
    setLoading(true);
    setError("");
    setFacturacion(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://3.148.27.206/api/places/billing?place_id=${placeId}&month=${mes}&year=${año}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo obtener la facturación.");
      }

      const data = await response.json();
      setFacturacion(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (placeId) {
      obtenerFacturacion();
    }
  }, [mes, año]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: `url(${cajasFondo})` }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-lg max-w-4xl w-full p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition"
          aria-label="Volver"
        >
          ← Volver
        </button>

        <h1 className="text-3xl font-extrabold mb-6 text-green-700 drop-shadow">
          Facturación
        </h1>

        {/* Selectores */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6 items-center">
          <div>
            <label htmlFor="mes" className="block font-medium mb-1 text-gray-700">
              Mes:
            </label>
            <select
              id="mes"
              value={mes}
              onChange={(e) => setMes(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="año" className="block font-medium mb-1 text-gray-700">
              Año:
            </label>
            <input
              id="año"
              type="number"
              value={año}
              onChange={(e) => setAño(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-4 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-green-500"
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        {/* Estado de carga / error */}
        {loading && (
          <p className="text-blue-600 font-semibold text-center mb-4 animate-pulse">
            Cargando...
          </p>
        )}
        {error && (
          <p className="text-red-600 font-semibold text-center mb-4">{error}</p>
        )}

        {/* Facturación */}
        {facturacion && (
          <div className="space-y-6">
            {/* Lista de paquetes entregados */}
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                Paquetes entregados:
              </h2>
              {facturacion.delivered_shipments.length === 0 ? (
                <p className="text-gray-600">No hay paquetes entregados este mes.</p>
              ) : (
                <ul className="space-y-4 max-h-72 overflow-y-auto">
                  {facturacion.delivered_shipments.map((paquete) => {
                    const precio =
                      paquete.type === "PICK_UP"
                        ? facturacion.delivery_price
                        : facturacion.devolution_price;

                    return (
                      <li
                        key={paquete.id}
                        className="border border-green-300 p-4 rounded-md bg-green-50 shadow-sm hover:shadow-md transition"
                      >
                        <p>
                          <strong>ID:</strong> {paquete.id}
                        </p>
                        <p>
                          <strong>Estado:</strong> {paquete.status}
                        </p>
                        <p>
                          <strong>Frase:</strong> {paquete.phrase}
                        </p>
                        <p>
                          <strong>Fecha:</strong>{" "}
                          {new Date(paquete.delivered_at).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Precio:</strong> ${precio.toFixed(2)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Total */}
            <div className="text-2xl font-extrabold text-right text-green-700">
              Total: ${facturacion.total.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
