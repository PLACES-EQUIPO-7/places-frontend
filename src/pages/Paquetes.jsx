import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/cajas.jpg";

function Paquetes() {
  const navigate = useNavigate();

  const placeId = localStorage.getItem("placeId");
  const placeName = localStorage.getItem("placeName");
  const placeRole = localStorage.getItem("placeRole");
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
        const placeIdNum = Number(placeId);
        const response = await fetch(
          `http://3.148.27.206/api/places/shipments?place_id=${placeIdNum}&status=PENDING&type=PICK_UP`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error al obtener los paquetes: ${response.status}`);
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

  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-6"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-4xl mx-auto bg-white bg-opacity-95 rounded-xl shadow-lg p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          ← Volver
        </button>

        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Paquetes próximos en <span className="italic">{placeName}</span>
        </h1>
        <p className="mb-6 text-gray-700 font-semibold">
          Total de paquetes proximos a llegar: {paquetes.length}
        </p>

        {paquetes.length === 0 ? (
          <p className="text-gray-600">No hay paquetes pendientes por llegar.</p>
        ) : (
          <ul className="space-y-6">
            {paquetes.map((paq) => (
              <li
                key={paq.id}
                className="border p-5 rounded-lg shadow-sm bg-green-50 hover:bg-green-100 transition"
              >
                <p className="font-semibold text-lg mb-1">Nombre del paquete: {paq.phrase}</p>
                <p>ID: <span className="font-mono">{paq.id}</span></p>
                <p>Tipo: <span className="capitalize">{paq.type.toLowerCase().replace("_", " ")}</span></p>
                <p>Estado: <span className="font-semibold">{paq.status}</span></p>
                <p>Tipo receptor: {paq.receiver_type}</p>
                <p>
                  Fecha entrega:{" "}
                  {paq.delivered_at ? new Date(paq.delivered_at).toLocaleString() : "No entregado"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Paquetes;
