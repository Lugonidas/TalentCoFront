import { createRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";

export default function Login() {
  const emailRef = createRef();
  const passwordRef = createRef();

  const { login, errores, loading } = useAuth({
    middleware: "guest",
    url: "/dashboard",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await login(datos);
      if (errores && errores.length > 0) {
        Swal.fire({
          title: "Error",
          text: errores,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch {
      console.log(errores);
    }
  };

  return (
    <>
      <div className="w-full flex h-screen justify-center px-5">
        <div className="flex-1 flex flex-col justify-center items-center">
          <img
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

          <div className="bg-white shadow-md rounded-md mt-5 p-5">
            <form onSubmit={handleSubmit}>
              <div className="flex-1 mb-4 flex flex-col gap-2">
                <label htmlFor="email" className="text-slate-800">
                  Correo
                </label>
                <input
                  type="email"
                  ref={emailRef}
                  className="p-2 w-full bg-indigo-50 outline-none text-gray-600"
                  name="email"
                  placeholder="Ej: lugo@correo.cmo"
                />
              </div>

              <div className="flex-1 mb-4 flex flex-col gap-2">
                <label htmlFor="password" className="text-slate-800">
                  Contraseña
                </label>
                <input
                  type="password"
                  ref={passwordRef}
                  className="p-2 w-full bg-indigo-50 outline-none text-gray-600"
                  name="password"
                  placeholder="*************"
                />
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
          </div>
        </div>
      </div>
    </>
  );
}
