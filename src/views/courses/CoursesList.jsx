import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import useCourse from "../../hooks/useCourse";
import { Link } from "react-router-dom";
import Rating from "../../components/Rating";
import { useState } from "react";
import Loader from "../../components/Loader";

export default function CoursesList() {
  const { user, isAdmin } = useAuth({ middleware: "guest" });
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;

  const {
    handleOpenEditModal,
    cursosData,
    selectedCategoria,
    searchTerm,
    setSearchTerm,
    updateCourse,
    loading,
  } = useCourse();

  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  const cursos = cursosData?.cursos || [];

  // Filtrar cursos por categoría seleccionada, término de búsqueda y estado
  const filteredCursos = cursos.filter((curso) => {
    const matchesCategoria = selectedCategoria
      ? curso.categoria.id === selectedCategoria
      : true;
    const matchesSearchTerm = curso.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesEstado = isAdmin
      ? estadoFiltro === "todos"
        ? true
        : estadoFiltro === "activos"
        ? curso.estado === 1
        : estadoFiltro === "inactivos"
        ? curso.estado === 0
        : true
      : curso.estado === 1; // Solo cursos activos para docentes y estudiantes

    return matchesCategoria && matchesSearchTerm && matchesEstado;
  });

  // Función para calcular la calificación promedio
  const calculateAverageRating = (comentarios) => {
    if (comentarios.length === 0) return 0;
    const totalRating = comentarios.reduce(
      (acc, comentario) => acc + comentario.calificacion,
      0
    );
    return totalRating / comentarios.length;
  };

  // Función para manejar el cambio de estado del curso
  const handleSwitchChange = (curso) => {
    const newEstado = curso.estado === 1 ? 0 : 1;
    const updatedCurso = { ...curso, estado: newEstado };
    updateCourse(curso.id, updatedCurso);
  };

  if (loading) {
    <Loader />
  }

  return (
    <>
      {user && isAdmin && (
        <div>
          <strong>Filtros por estado:</strong>
          <div className="flex flex-wrap gap-1 items-start mb-4">
            {(isAdmin || user) && (
              <>
                <button
                  onClick={() => setEstadoFiltro("todos")}
                  className={`py-0.5 px-2 border border-dotted border-indigo-800 transition-all ease-linear hover:cursor-pointer ${
                    estadoFiltro === "todos"
                      ? "bg-indigo-800 text-white"
                      : "hover:bg-indigo-800 hover:text-white"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setEstadoFiltro("activos")}
                  className={`py-0.5 px-2 border border-dotted border-indigo-800 transition-all ease-linear hover:cursor-pointer ${
                    estadoFiltro === "activos"
                      ? "bg-indigo-800 text-white"
                      : "hover:bg-indigo-800 hover:text-white"
                  }`}
                >
                  Activos
                </button>
                <button
                  onClick={() => setEstadoFiltro("inactivos")}
                  className={`py-0.5 px-2 border border-dotted border-indigo-800 transition-all ease-linear hover:cursor-pointer ${
                    estadoFiltro === "inactivos"
                      ? "bg-indigo-800 text-white"
                      : "hover:bg-indigo-800 hover:text-white"
                  }`}
                >
                  Inactivos
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center mb-4 p-2 gap-2 border border-gray-300 rounded">
        <i className="fa-brands fa-searchengin"></i>
        <input
          type="text"
          placeholder="Buscar curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full focus:outline-none focus:border-indigo-800"
        />
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCursos.map((curso) => {
          const averageRating = calculateAverageRating(curso.comentarios);

          return (
            <motion.li
              key={curso.id}
              className="grid md:grid-cols-2 gap-2 bg-white shadow-md transition-all ease-linear hover:shadow-xl overflow-hidden relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-52">
                <motion.img
                  src={`${apiUrl}/storage/${curso.imagen}`}
                  alt={`Imagen ${curso.titulo}`}
                  className="h-48 w-48 mx-auto object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div>
                <strong className="font-bold mb-2 text-indigo-800">
                  {curso.titulo}
                </strong>
                <p>
                  <i className="fa-solid fa-user-tie"></i>
                  <span> {curso.docente.name}</span>
                </p>
                <span>
                  <i className="fa-regular fa-clock"></i> {curso.duracion} Horas
                </span>
                <div className="flex items-center gap-1">
                  <Rating initialRating={averageRating} readOnly />
                  <p className="text-xs">
                    <span>{averageRating.toFixed(1)}/5</span>
                  </p>
                </div>
                {/* Acciones */}
                <div className="md:py-2">
                  <Link
                    to={`${user ? "/dashboard" : ""}/cursos/show/${curso.id}`}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className="fa-solid fa-eye bg-green-600 text-white p-2"></i>
                    </motion.button>
                  </Link>

                  {user && isAdmin && (
                    <div className="space-y-4 my-2 absolute bottom-0 right-2">
                      <div className="flex flex-col">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={curso.estado === 1}
                            onChange={() => handleSwitchChange(curso)}
                          />
                          <div className="peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-500 w-8 h-8 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-['✖️'] after:rounded-full after:absolute after:outline-none after:h-6 after:w-6 after:bg-gray-50 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-hover:after:scale-75 peer-checked:after:content-['✔️'] after:-rotate-180 peer-checked:after:rotate-0"></div>
                        </label>
                      </div>
                    </div>
                  )}

                  {user && user.id === curso.id_docente && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleOpenEditModal(curso)}
                      >
                        <i className="fa-solid fa-pen bg-blue-600 text-white p-2"></i>
                      </motion.button>
                      {/*                       <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteCourse(curso.id)}
                      >
                        <i className="fa-solid fa-trash bg-red-600 text-white p-2"></i>
                      </motion.button> */}
                    </>
                  )}
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </>
  );
}
