import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/mi-fondo.jpg";

function DashboardGeneral() {
  const [user, setUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("placeId");
    localStorage.removeItem("placeNit");
    localStorage.removeItem("placeName");
    localStorage.removeItem("placeAddress");
    localStorage.removeItem("placeRole");

    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    const fetchPlaces = async () => {
      try {
        const response = await fetch("http://3.148.27.206/api/places/my-places", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar las tiendas");
        }

        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const toggleEnablePlace = async (placeId, currentStatus) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://3.148.27.206/api/places/${placeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado de la tienda");
      }

      setPlaces((prev) =>
        prev.map((item) =>
          item.place.id === placeId ? { ...item, place: { ...item.place, enabled: !currentStatus } } : item
        )
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const handlePlaceClick = (place, role, isDisabled) => {
    if (isDisabled && user?.role !== "aggregator") return;

    localStorage.setItem("placeId", place.id);
    localStorage.setItem("placeNit", place.nit);
    localStorage.setItem("placeName", place.name);
    localStorage.setItem("placeAddress", place.address);
    localStorage.setItem("placeRole", role);

    navigate(`/tiendas/${place.id}`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-800 drop-shadow">
              ¡Hola, {user?.user_name} 👋!
            </h1>
            <p className="text-lg text-gray-700">Bienvenido a PLACES</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Crear lugar */}
        {user?.role === "aggregator" && (
          <div className="text-center mb-6">
            <button
              onClick={() => navigate("/Registro")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              Crear nuevo lugar y usuario
            </button>
          </div>
        )}

        {/* Título central */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 drop-shadow">
            SELECCIONA EL PLACE A TRABAJAR
          </h2>
        </div>

        {/* Grid de tiendas */}
        {loading ? (
          <p className="text-center text-gray-600 animate-pulse">Cargando tiendas...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : places.length === 0 ? (
          <p className="text-center text-gray-600">No tienes lugares registrados.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((item, index) => {
              const isDisabled = !item.place.enabled;
              const isAggregator = user?.role === "aggregator";

              return (
                <div key={index} className="relative">
                  <div
                    className={`rounded-xl p-5 pb-20 transition-all ${
                      isDisabled ? "bg-white opacity-50" : "bg-white hover:shadow-xl"
                    } ${
                      isDisabled && !isAggregator ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    onClick={() =>
                      handlePlaceClick(item.place, item.role, isDisabled)
                    }
                  >
                    <h3 className="text-xl font-bold text-green-700 mb-2">
                      {item.place.name}
                    </h3>
                    <p className="text-gray-700 mb-1">
                      <strong>Dirección:</strong> {item.place.address}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Rol:</strong>{" "}
                      {isAggregator
                        ? "Administrador"
                        : item.role === "PLACE_OWNER"
                        ? "Dueño"
                        : "Trabajador"}
                    </p>
                    <p
                      className={`mt-2 font-semibold ${
                        item.place.enabled ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.place.enabled ? "Habilitado" : "Deshabilitado"}
                    </p>
                  </div>

                  {/* Botón para habilitar/deshabilitar */}
                  {isAggregator && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEnablePlace(item.place.id, item.place.enabled);
                        }}
                        className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition ${
                          item.place.enabled
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {item.place.enabled ? "Deshabilitar" : "Habilitar"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardGeneral;
