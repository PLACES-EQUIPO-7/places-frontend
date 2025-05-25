import { useState } from "react";

const EscanearPaquete = () => {
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleScan = () => {
    if (!codigo.trim()) {
      setMensaje("Por favor ingresa un código.");
      return;
    }

    
    setMensaje(`Paquete con código "${codigo}" escaneado correctamente.`);
    setCodigo(""); 
  };

  return (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <div className="flex-grow flex flex-col items-center justify-start p-4">
      <h1 className="text-2xl font-bold mb-4 mt-8">Escanear Paquete</h1>

      <input
        type="text"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="Escanea o ingresa el código del paquete"
        className="w-full max-w-md p-2 border rounded mb-4"
      />

      <button
        onClick={handleScan}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Escanear
      </button>

      {mensaje && (
        <p className="mt-4 text-green-700 font-medium">{mensaje}</p>
      )}
    </div>
  </div>
);

};

export default EscanearPaquete;
