import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import MisCursos from "../courses/MisCursos";

export default function Student() {
  const { user } = useAuth({ middleware: "auth" });

  // Dentro de tu componente ShowCourse
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="border-2 border-dotted min-h-screen">
        <h1 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
          Dashboard
        </h1>
        <div className="p-2">
          <p className="text-gray-600 text-xl">
            Hola <strong className="text-indigo-800">{user.usuario}</strong>, nos alegra tenerte de vuelta.
          </p>
        </div>
        <div className="">
          <div className="grid md:grid-cols-4 gap-8 m-8">
          <Link
              to="/dashboard/chat"
              className=" transition-all ease-in-out shadow-md flex flex-col p-2 font-bold text-indigo-800 text-xl hover:shadow-xl hover:bg-gray-200 items-center justify-center rounded"
            >
              <span>
                <img className="w-14" src="/img/chat.png" alt="Chat" />
              </span>
              Chat
            </Link>
            <Link
              to="/dashboard/misCursos"
              className=" transition-all ease-in-out shadow-md flex flex-col p-2 font-bold text-indigo-800 text-xl hover:shadow-xl hover:bg-gray-200 items-center justify-center rounded"
            >
              <span>
                <img
                  className="w-14"
                  src="/img/misCursos.png"
                  alt="Mis Cursos"
                />
              </span>
              Mis Cursos
            </Link>
          </div>

          <div className="">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 m-8">
              {/* Gráfico de barras */}

            </div>
          </div>
        </div>

        <MisCursos/>
      </div>
    </>
  );
}
