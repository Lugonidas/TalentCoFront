import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth({ middleware: "auth" });
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const isActive = (path) => {
    return location.pathname == path;
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Manejador para cerrar el sidebar si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarExpanded &&
        !event.target.closest("aside") &&
        !event.target.closest("button")
      ) {
        setIsSidebarExpanded(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSidebarExpanded]);

  return (
    <>
      {isSidebarExpanded && (
        <div className="fixed inset-0 opacity-50 z-10 bg-black"></div>
      )}
      <aside
        className={`fixed col-span-1 sidebar shadow-md bg-gray-300 ${
          isSidebarExpanded
            ? "w-64"
            : "-translate-x-full md:translate-x-0 md:w-16"
        } h-screen flex flex-col justify-between transition-all ease-linear z-10`}
      >
        <button
          aria-label="Ir a ver el menu"
          onClick={toggleSidebar}
          className="p-2 flex flex-col bg-indigo-800 text-white items-center absolute top-0 left-full transition-all ease-linear hover:translate-x-1 z-10"
        >
          <i className="text-xl fa-solid fa-border-none"></i>
          <span className="text-xs">Menu</span>
        </button>

        {/* Contenido del sidebar */}
        <div>
          <Link
            aria-label="Ir a ver el dashboard"
            to="/dashboard"
            className={`${
              isSidebarExpanded ? "grid-cols-4" : ""
            } menu__logo p-2 grid items-center gap-2 font-bold text-indigo-800 text-xl`}
          >
            <img
              loading="lazy"
              src="/icon.png"
              alt="Imagen Logotipo Talentos Colombia"
              className="col-span-1 mx-auto w-10"
            />
            {isSidebarExpanded && (
              <span className="menu__logo-texto text-2xl col-span-3">
                Talent<span>.</span>Co
              </span>
            )}
          </Link>

          {/* Links del menú */}
          <ul className="mt-5">
            <li>
              <Link
                aria-label="Ir a ver el dashboard"
                to="/dashboard"
                className={` ${
                  isActive("/dashboard")
                    ? "active bg-indigo-500 text-white border-indigo-800 transition-all ease-linear"
                    : ""
                } ${
                  isSidebarExpanded ? "grid-cols-4" : ""
                }  nav-link grid p-2 gap-2 items-center text-gray-700 font-bold hover:text-white hover:bg-indigo-400 transition-all ease-linear duration-500 text-xl`}
              >
                <img
                  loading="lazy"
                  className="w-9 mx-auto"
                  src="/img/dashboard.png"
                  alt="Dashboard"
                />
                {isSidebarExpanded && (
                  <span className="col-span-3">Dashboard</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                aria-label="Ir a ver al chat"
                to="/dashboard/chat"
                className={`${
                  isActive("/dashboard/chat")
                    ? "active bg-indigo-500 text-white border-indigo-800 transition-all ease-linear"
                    : ""
                } ${
                  isSidebarExpanded ? "grid-cols-4" : ""
                }  nav-link grid p-2 gap-2 items-center text-gray-700 font-bold hover:text-white hover:bg-indigo-400 transition-all ease-linear duration-500 text-xl`}
              >
                <img
                  loading="lazy"
                  className="w-9 mx-auto"
                  src="/img/chat.png"
                  alt="Chat"
                />
                {isSidebarExpanded && <span className="col-span-3">Chat</span>}
              </Link>
            </li>
            <li>
              <Link
                aria-label="Ir a ver todos los cursos"
                to="/dashboard/cursos"
                className={`${
                  isActive("/dashboard/cursos")
                    ? "active bg-indigo-500 text-white border-indigo-800 transition-all ease-linear"
                    : ""
                } ${
                  isSidebarExpanded ? "grid-cols-4" : ""
                }  nav-link grid p-2 gap-2 items-center text-gray-700 font-bold hover:text-white hover:bg-indigo-400 transition-all ease-linear duration-500 text-xl`}
              >
                <img
                  loading="lazy"
                  className="w-9 mx-auto"
                  src="/img/cursos.png"
                  alt="Cursos"
                />
                {isSidebarExpanded && (
                  <span className="col-span-3">Cursos</span>
                )}
              </Link>
            </li>
            {user && Number(Number(user.id_rol)) == 2 && (
              <li>
                <Link
                  aria-label="Ir a ver mis cursos"
                  to="/dashboard/misCursos"
                  className={`${
                    isActive("/dashboard/misCursos")
                      ? "active bg-indigo-500 text-white border-indigo-800 transition-all ease-linear"
                      : ""
                  } ${
                    isSidebarExpanded ? "grid-cols-4" : ""
                  }  nav-link grid p-2 gap-2 items-center text-gray-700 font-bold hover:text-white hover:bg-indigo-400 transition-all ease-linear duration-500 text-xl`}
                >
                  <img
                    loading="lazy"
                    className="w-9 mx-auto"
                    src="/img/misCursos.png"
                    alt="mis Cursos"
                  />
                  {isSidebarExpanded && (
                    <span className="col-span-3">Mis cursos</span>
                  )}
                </Link>
              </li>
            )}
            {user &&
              (Number(Number(user.id_rol)) == 1 ||
                Number(Number(user.id_rol)) == 3) && (
                <>
                  <li>
                    <Link
                      aria-label="Ir a ver mis cursos"
                      to="/dashboard/misCursos"
                      className={`${
                        isActive("/dashboard/misCursos")
                          ? "active bg-indigo-500 text-white border-indigo-800 transition-all ease-linear"
                          : ""
                      } ${
                        isSidebarExpanded ? "grid-cols-4" : ""
                      }  nav-link grid p-2 gap-2 items-center text-gray-700 font-bold hover:text-white hover:bg-indigo-400 transition-all ease-linear duration-500 text-xl`}
                    >
                      <img
                        loading="lazy"
                        className="w-9 mx-auto"
                        src="/img/misCursos.png"
                        alt="mis Cursos"
                      />
                      {isSidebarExpanded && (
                        <span className="col-span-3">Mis cursos</span>
                      )}
                    </Link>
                  </li>
                </>
              )}
            {user && Number(user.id_rol) == 1 && (
              <>
                <li>
                  <Link
                    aria-label="Ir a ver las categorias"
                    to="/dashboard/categorias"
                    className={`${
                      isActive("/dashboard/categorias")
                        ? "active bg-indigo-500 text-white border-indigo-800 transition-all ease-linear"
                        : ""
                    } ${
                      isSidebarExpanded ? "grid-cols-4" : ""
                    }  nav-link grid p-2 gap-2 items-center text-gray-700 font-bold hover:text-white hover:bg-indigo-400 transition-all ease-linear duration-500 text-xl`}
                  >
                    <img
                      loading="lazy"
                      className="w-9 mx-auto"
                      src="/img/categorias.png"
                      alt="Usuarios"
                    />
                    {isSidebarExpanded && (
                      <span className="col-span-3">Categorias</span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    aria-label="Ir a ver los usuarios"
                    to="/dashboard/usuarios"
                    className={`${
                      isActive("/dashboard/usuarios")
                        ? "active bg-indigo-500 text-white border-indigo-800 transition-all ease-linear"
                        : ""
                    } ${
                      isSidebarExpanded ? "grid-cols-4" : ""
                    }  nav-link grid p-2 gap-2 items-center text-gray-700 font-bold hover:text-white hover:bg-indigo-400 transition-all ease-linear duration-500 text-xl`}
                  >
                    <img
                      loading="lazy"
                      className="w-9 mx-auto"
                      src="/img/usuarios.png"
                      alt="Usuarios"
                    />
                    {isSidebarExpanded && (
                      <span className="col-span-3">Usuarios</span>
                    )}
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                aria-label="Ir a ver las reuniones"
                to="/dashboard/reuniones" // Ruta hacia la página de creación de reuniones
                className={`${
                  isActive("/dashboard/reuniones")
                    ? "active bg-indigo-500 text-white border-indigo-800 transition-all ease-linear"
                    : ""
                } ${
                  isSidebarExpanded ? "grid-cols-4" : ""
                }  nav-link grid p-2 gap-2 items-center text-gray-700 font-bold hover:text-white hover:bg-indigo-400 transition-all ease-linear duration-500 text-xl`}
              >
                <img
                  loading="lazy"
                  className="w-9 mx-auto"
                  src="/img/camara.png"
                  alt="Camara"
                />
                {/* Icono de video */}
                {isSidebarExpanded && (
                  <span className="col-span-3">Reuniones</span> // Texto del botón
                )}
              </Link>
            </li>
            <li>
              <Link
                aria-label="Ir a ver el perfil"
                to="/dashboard/perfil"
                className={`${
                  isActive("/dashboard/perfil")
                    ? "active bg-indigo-500 text-white border-indigo-800 transition-all ease-linear"
                    : ""
                } ${
                  isSidebarExpanded ? "grid-cols-4" : ""
                }  nav-link grid p-2 gap-2 items-center text-gray-700 font-bold hover:text-white hover:bg-indigo-400 transition-all ease-linear duration-500 text-xl`}
              >
                <img
                  loading="lazy"
                  className="w-9 mx-auto"
                  src="/img/perfil.png"
                  alt="Imagen del perfil"
                />
                {isSidebarExpanded && (
                  <span className="col-span-3">Mi Perfil</span>
                )}
              </Link>
            </li>
          </ul>
        </div>

        <div className="w-full">
          {isSidebarExpanded && (
            <div>
              <p className="hora px-2 text-right text-3xl font-bold text-indigo-800">
                <span>{hours}:</span>
                <span>{minutes}</span>
                <span className="text-xs">{seconds}</span>
              </p>
            </div>
          )}
          <div className="flex flex-col border-t border-dotted border-indigo-800">
            <div className="p-2 flex gap-2 items-center justify-between">
              <img
                loading="lazy"
                className="w-16 h-16"
                src={`${apiUrl}/storage/${user?.imagen}`}
                alt={`Imagen ${user?.name}`}
              />
              {isSidebarExpanded && (
                <p className="font-bold flex flex-col text-end capitalize ">
                  {user?.usuario}
                  {user && Number(user.id_rol) == 1 && (
                    <span className="text-indigo-800">Administrador</span>
                  )}
                  {user && Number(user.id_rol) == 3 && (
                    <span className="text-indigo-800">Docente</span>
                  )}
                  {user && Number(user.id_rol) == 2 && (
                    <span className="text-indigo-800">Estudiante</span>
                  )}
                </p>
              )}
            </div>
            <button
              onClick={logout}
              className="p-2 bg-green-800 text-white font-bold hover:bg-green-900 transition-all ease-linear duration-500 text-xl"
              aria-label="Cerrar sesión"
            >
              <i className="fa-solid fa-arrow-right-from-bracket rotate-180 pl-1"></i>
              {isSidebarExpanded && <span>Cerrar sesión</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
