import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Navegacion() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // Referencia para el menú

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`${
        isOpen ? "relative" : ""
      } flex justify-between items-center gap-1 w-full p-4 border-b-2 border-dashed border-indigo-800 bg-white shadow-md`}
    >
      <div>
        <Link to="/" className="gap-1">
          <img
            loading="lazy"
            src="/icon.png"
            alt="Imagen Logotipo Talentos Colombia"
            className="h-10 w-10"
          />
          <span className="text-indigo-800 text-2xl font-bold">
            Talent<span className="text-yellow-600">Co</span>
          </span>
        </Link>
      </div>

      <div className="flex md:hidden">
        <button
          onClick={toggleMenu}
          className="text-indigo-800 focus:outline-none"
        >
          <i className="fa-solid fa-bars text-2xl"></i>
        </button>
      </div>

      <div
        ref={menuRef} // Añadir referencia al menú
        className={`z-10 flex-col md:items-center md:flex md:flex-row gap-4 md:gap-10 ${
          isOpen
            ? "flex absolute left-0 mt-1 top-full shadow-md bg-white w-full py-12 md:p-2"
            : "hidden"
        }`}
      >
        <div className="flex flex-col md:grid grid-cols-3 gap-2 md:gap-6">
          <Link
            to="/cursos"
            className={`${
              isActive("/cursos")
                ? "border-b-2 border-yellow-600"
                : "border-b-2 border-white"
            } w-full nav-link px-2 gap-1 text-gray-700 hover:text-indigo-800 transition-all ease-in-out duration-300`}
            onClick={closeMenu} // Cierra el menú al hacer clic
          >
            Cursos
          </Link>
          <Link
            to="/sobre-nosotros"
            className={`${
              isActive("/sobre-nosotros")
                ? "border-b-2 border-yellow-600"
                : "border-b-2 border-white"
            } w-full nav-link px-2 gap-1 text-gray-700 hover:text-indigo-800 transition-all ease-in-out duration-300`}
            onClick={closeMenu} // Cierra el menú al hacer clic
          >
            Acerca de
          </Link>
          <Link
            to="/contacto"
            className={`${
              isActive("/contacto")
                ? "border-b-2 border-yellow-600"
                : "border-b-2 border-white"
            } w-full nav-link px-2 gap-1 text-gray-700 hover:text-indigo-800 transition-all ease-in-out duration-300`}
            onClick={closeMenu} // Cierra el menú al hacer clic
          >
            Contacto
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <Link
            to="/login"
            className="nav-link flex items-center px-2 gap-1 text-indigo-800 font-bold hover:text-indigo-800 transition-all ease-in-out duration-300"
            onClick={closeMenu} // Cierra el menú al hacer clic
          >
            <i
              className={`${
                isActive("/login") ? "active text-xl text-yellow-600" : ""
              } fa-solid fa-sign-in-alt p-1`}
            ></i>
            Login
          </Link>
          <Link
            to="/registro"
            className="nav-link flex items-center px-2 gap-1 text-indigo-800 font-bold hover:text-indigo-800 transition-all ease-in-out duration-300"
            onClick={closeMenu} // Cierra el menú al hacer clic
          >
            <i
              className={`${
                isActive("/registro") ? "active text-xl text-yellow-600" : ""
              } fa-solid fa-user-plus p-1`}
            ></i>
            Registro
          </Link>
        </div>
      </div>
    </nav>
  );
}
