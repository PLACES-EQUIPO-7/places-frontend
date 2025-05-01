import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registro() {
  const [isNewUser, setIsNewUser] = useState(true);
  const [isNewPlace, setIsNewPlace] = useState(true);

  const [dni, setDni] = useState("");
  const [dniType, setDniType] = useState("cc");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("PLACE_OWNER");

  const [placeName, setPlaceName] = useState("");
  const [nit, setNit] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();

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
        : { dni, dni_type: dniType },
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
      rol,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://3.148.27.206/api/places", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("No se pudo completar el registro.");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Registro de Tienda y Usuario
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegistro}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sección Usuario */}
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-semibold mb-2">Información del Usuario</h3>
              <div className="flex gap-4 mb-4">
                <button type="button" onClick={() => setIsNewUser(true)} className={`px-4 py-2 rounded ${isNewUser ? "bg-green-500 text-white" : "bg-gray-200"}`}>Usuario nuevo</button>
                <button type="button" onClick={() => setIsNewUser(false)} className={`px-4 py-2 rounded ${!isNewUser ? "bg-green-500 text-white" : "bg-gray-200"}`}>Usuario existente</button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Tipo de documento</label>
                <select value={dniType} onChange={(e) => setDniType(e.target.value)} className="w-full border rounded px-3 py-2">
                  <option value="cc">Cédula</option>
                  <option value="ti">Tarjeta de Identidad</option>
                  <option value="ce">Cédula de Extranjería</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Número de documento</label>
                <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>

              {isNewUser && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Nombres</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Apellidos</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Nombre de usuario</label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Correo electrónico</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Contraseña</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                </>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium">Rol</label>
                <select value={rol} onChange={(e) => setRol(e.target.value)} className="w-full border rounded px-3 py-2">
                  <option value="PLACE_OWNER">Dueño</option>
                  <option value="PLACE_EMPLOYEE">Trabajador</option>
                </select>
              </div>
            </div>

            {/* Sección Tienda */}
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-semibold mb-2">Información de la Tienda</h3>
              <div className="flex gap-4 mb-4">
                <button type="button" onClick={() => setIsNewPlace(true)} className={`px-4 py-2 rounded ${isNewPlace ? "bg-green-500 text-white" : "bg-gray-200"}`}>Tienda nueva</button>
                <button type="button" onClick={() => setIsNewPlace(false)} className={`px-4 py-2 rounded ${!isNewPlace ? "bg-green-500 text-white" : "bg-gray-200"}`}>Tienda existente</button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">NIT</label>
                <input type="text" value={nit} onChange={(e) => setNit(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              {isNewPlace && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Nombre de la tienda</label>
                    <input type="text" value={placeName} onChange={(e) => setPlaceName(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Dirección</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Código postal</label>
                    <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Latitud</label>
                    <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Longitud</label>
                    <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                </>
              )}
            </div>
          </div>

          <button type="submit" className="w-full mt-6 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registro;
