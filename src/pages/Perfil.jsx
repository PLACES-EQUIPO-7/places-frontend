import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { motion } from "framer-motion";
import cajas from "../assets/cajas.jpg"; // Asegúrate de que la ruta sea correcta

const Perfil = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch("http://3.148.27.206/api/places/user/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener los datos del usuario");
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserDetails();
  }, [token]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://3.148.27.206/api/places/change/password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });
      if (!res.ok) throw new Error("Error al cambiar la contraseña");
      setPasswordMessage("✅ Contraseña actualizada con éxito.");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      setPasswordMessage("❌ Error al cambiar la contraseña.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: `url(${cajas})` }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
          <User size={28} /> Perfil del Usuario
        </h2>

        {userData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-gray-700 text-sm">
            <p><strong>Nombre:</strong> {userData.first_name}</p>
            <p><strong>Apellido:</strong> {userData.last_name}</p>
            <p><strong>Usuario:</strong> {userData.user_name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Cédula:</strong> {userData.dni}</p>
            <p><strong>Tipo:</strong> {userData.dni_type}</p>
          </div>
        ) : (
          <p className="text-center text-gray-600">Cargando datos del usuario...</p>
        )}

        <form
          onSubmit={handlePasswordChange}
          className="pt-4 border-t border-gray-300 mt-4 space-y-4"
        >
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Lock size={20} /> Cambiar Contraseña
          </h3>

          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder="Contraseña actual"
              className="w-full p-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              className="w-full p-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Cambiar contraseña
          </motion.button>

          {passwordMessage && (
            <p className="text-center text-sm text-red-600">{passwordMessage}</p>
          )}
        </form>

        <div className="text-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition"
          >
            ← Volver
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Perfil;
