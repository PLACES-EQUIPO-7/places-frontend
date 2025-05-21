import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../assets/mi-fondo.jpg";

export default function Registro() {
  const navigate = useNavigate();

  // Estados para formulario
  const [isNewUser, setIsNewUser] = useState(true);
  const [isNewPlace, setIsNewPlace] = useState(true);

  // Datos usuario
  const [dni, setDni] = useState("");
  const [dniType, setDniType] = useState("cc");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rol, setRol] = useState("PLACE_OWNER"); 

  // Datos tienda
  const [placeName, setPlaceName] = useState("");
  const [nit, setNit] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [error, setError] = useState("");

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError("");

    if (!dni || !rol || !nit) {
      setError("Cédula, rol y NIT son obligatorios.");
      return;
    }

    const payload = {
      user: isNewUser
        ? {
            dni,
            dni_type: dniType,
            first_name: firstName,
            last_name: lastName,
            user_name: userName,
            email,
            password,
          }
        : { dni },
      place: isNewPlace
        ? {
            name: placeName,
            nit,
            address,
            zip_code: zipCode,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          }
        : { nit },
      role: rol,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No autorizado. Por favor inicia sesión.");
        return;
      }

      const response = await fetch(
        "http://3.148.27.206/api/places/register/user-place",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const text = await response.text();

      if (!response.ok) {
        let errorMsg = "No se pudo completar el registro.";
        try {
          const data = text ? JSON.parse(text) : null;
          if (data?.message) errorMsg = data.message;
        } catch {
          // No es JSON
        }
        throw new Error(errorMsg);
      }

      alert("Registro exitoso");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-6xl animate-fade-in">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition"
        >
          Volver al Dashboard
        </button>

        <h2 className="text-2xl font-bold text-center text-green-600 mb-6 animate-fade-in">
          Registro de Tienda y Usuario
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 animate-fade-in">{error}</p>
        )}

        <form onSubmit={handleRegistro}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Usuario */}
            <div className="w-full md:w-1/2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-lg font-semibold mb-2">Información del Usuario</h3>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setIsNewUser(true)}
                  className={`px-4 py-2 rounded transition ${
                    isNewUser ? "bg-green-500 text-white" : "bg-gray-200"
                  }`}
                >
                  Usuario nuevo
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewUser(false)}
                  className={`px-4 py-2 rounded transition ${
                    !isNewUser ? "bg-green-500 text-white" : "bg-gray-200"
                  }`}
                >
                  Usuario existente
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Número de documento</label>
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  className="input"
                />
              </div>

              {isNewUser && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Tipo de documento</label>
                    <select
                      value={dniType}
                      onChange={(e) => setDniType(e.target.value)}
                      className="input"
                    >
                      <option value="cc">Cédula</option>
                      <option value="ti">Tarjeta de Identidad</option>
                      <option value="ce">Cédula de Extranjería</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Nombres</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Apellidos</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Nombre de usuario</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Correo electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input"
                    />
                  </div>
                    <div className="mb-4 relative">
                      <label className="block text-sm font-medium">Contraseña</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded px-3 py-2 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-8 text-gray-600"
                        tabIndex={-1} // para que no interfiera en tabulacion
                      >
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                </>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium">Rol</label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="input"
                >
                  <option value="PLACES_OWNER">Dueño</option>
                  <option value="PLACE_EMPLOYEE">Trabajador</option>
                </select>
              </div>
            </div>

            {/* Tienda */}
            <div className="w-full md:w-1/2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-lg font-semibold mb-2">Información de la Tienda</h3>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setIsNewPlace(true)}
                  className={`px-4 py-2 rounded transition ${
                    isNewPlace ? "bg-green-500 text-white" : "bg-gray-200"
                  }`}
                >
                  Tienda nueva
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewPlace(false)}
                  className={`px-4 py-2 rounded transition ${
                    !isNewPlace ? "bg-green-500 text-white" : "bg-gray-200"
                  }`}
                >
                  Tienda existente
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">NIT</label>
                <input
                  type="text"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
                  className="input"
                />
              </div>
              {isNewPlace && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Nombre de la tienda</label>
                    <input
                      type="text"
                      value={placeName}
                      onChange={(e) => setPlaceName(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Dirección</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Código postal</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Latitud</label>
                    <input
                      type="text"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Longitud</label>
                    <input
                      type="text"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="input"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
