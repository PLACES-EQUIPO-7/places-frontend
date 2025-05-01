import Login from '../components/Login';

function LoginPage() {
  return (
    <div
      className="min-h-screen bg-center bg-cover flex items-center justify-center relative"
      style={{ backgroundImage: 'url(/src/assets/mi-fondo.jpg)' }}
    >
      <div className="absolute inset-0 bg-black/50"></div> {/* capa oscura */}
      <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md mx-4">
        <Login />
      </div>
    </div>
  );
}

export default LoginPage;

