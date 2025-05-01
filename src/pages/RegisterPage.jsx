import Register from "../components/Register";

const RegisterPage = () => {
  return (
    <div
      className="min-h-screen bg-center bg-cover flex items-center justify-center relative"
      style={{ backgroundImage: 'url(/src/assets/mi-fondo.jpg)' }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-4">
        <Register />
      </div>
    </div>
  );
};

export default RegisterPage;
