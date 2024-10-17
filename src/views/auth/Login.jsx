import { createRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function Login() {
  const usuarioRef = createRef();
  const passwordRef = createRef();

  const { login, errores, loading } = useAuth({
    middleware: "guest",
    url: "/dashboard",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowPassword(false);

    const datos = {
      usuario: usuarioRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await login(datos);
    } catch (error) {
      console.log("Error iniciando sesión.", error);
    }
  };

  return (
    <>
      <div className="w-full py-5 md:flex h-screen justify-center px-5">
        <div className="flex-1 flex flex-col justify-center items-center">
          <img
            loading="lazy"
            src="../img/logo.png"
            alt="Imagen logotipo TalentCo"
            className="max-w-xs object-contain"
          />
          <p className="text-center font-black text-indigo-800 text-2xl">
            Talent.<span>Co</span>
          </p>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-black uppercase text-center mb-4 text-indigo-800">
            Inicia Sesión
          </h1>
          <p className="text-gray-600">
            Inicia sesión diligenciando el formulario
          </p>

          {errores &&
            errores.length > 0 &&
            !errores.usuario &&
            !errores.password && (
              <p className=" text-center p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores}
              </p>
            )}

          <div className="bg-white shadow-md rounded-md mt-5 p-5">
            <form onSubmit={handleSubmit}>
              <div className="flex-1 mb-4 flex flex-col gap-2">
                <label htmlFor="usuario" className="text-slate-800">
                  Usuario
                </label>
                <input
                  type="text"
                  ref={usuarioRef}
                  className="p-2 w-full bg-indigo-50 outline-none text-gray-600"
                  name="usuario"
                  placeholder="Ej: lugonidas"
                />
                {errores && errores.usuario && (
                  <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                    {errores.usuario}
                  </p>
                )}
              </div>

              <div className=" flex-1 mb-4 flex flex-col gap-2">
                <label htmlFor="password" className="text-slate-800">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} // Cambiar entre text y password
                    ref={passwordRef}
                    className="p-2 w-full bg-indigo-50 outline-none text-gray-600"
                    name="password"
                    placeholder="*************"
                  />
                  <button
                    type="button"
                    className="absolute right-0 rounded-r-md text-white bottom-0 top-0 bg-indigo-600 p-2"
                    onClick={() => setShowPassword(!showPassword)} // Alternar el estado de showPassword
                  >
                    {showPassword ? (
                      <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i className="fa-solid fa-eye"></i>
                    )}
                  </button>
                </div>
                {errores && errores.password && (
                  <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                    {errores.password}
                  </p>
                )}
              </div>

              {/* Mostrar spinner si está cargando, de lo contrario, mostrar el botón */}
              {loading ? (
                <div className="flex justify-center">
                  <svg
                    className="animate-spin h-6 w-6 text-indigo-800"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM12 4a8 8 0 010 16v4c6.627 0 12-5.373 12-12h-4z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <input
                  type="submit"
                  value="Iniciar Sesión"
                  className="bg-indigo-800 text-white w-full p-2 transition-all ease-in hover:bg-indigo-700 hover:cursor-pointer uppercase font-bold"
                />
              )}
            </form>
            <div className="my-4 flex gap-2">
              <p className="text-gray-500">¿Aún no tienes cuenta?</p>
              <Link
                to="/registro"
                className="nav-link flex items-center gap-1 text-indigo-800 font-bold hover:text-indigo-800 transition-all ease-in-out duration-300"
              >
                Regístrate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
