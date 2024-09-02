import { useContext } from "react";
import { motion } from "framer-motion";
import CourseContext from "../../context/CourseProvider";
import { useAuth } from "../../hooks/useAuth";

export default function CoursesList() {

  const { user } = useAuth({ middleware: "auth" });
  const apiUrl = import.meta.env.VITE_API_URL;

  const {
    handleOpenViewModal,
    handleOpenEditModal,
    deleteCourse,
    cursos,
    selectedCategoria,
  } = useContext(CourseContext);

  // Filtrar cursos por categoría seleccionada
  const filteredCursos = selectedCategoria
    ? cursos.filter((curso) => curso.categoria.id === selectedCategoria)
    : cursos;

  return (
    <ul className="grid my-2 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {filteredCursos.map((curso) => (
        <motion.li
          key={curso.id}
          className="grid md:grid-cols-2 gap-2 bg-white shadow-md transition-all ease-linear hover:shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <motion.img
              src={`${apiUrl}/api/storage/${curso.imagen}`}
              alt={`Imagen ${curso.titulo}`}
              className="w-full h-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div>
            <strong className=" font-bold mb-2 text-indigo-800">{curso.titulo}</strong>
            <p>
              <i className="fa-solid fa-user-tie"></i>
              <span> {curso.docente.name}</span>
            </p>
            <span>
              <i className="fa-regular fa-clock"></i> {curso.duracion} Horas
            </span>
            <p className="text-xs">
              <i className="fa-solid fa-star text-yellow-400"></i>
              <i className="fa-solid fa-star text-yellow-400"></i>
              <i className="fa-solid fa-star text-yellow-400"></i>
              <i className="fa-solid fa-star text-yellow-400"></i>
              <i className="fa-solid fa-star text-yellow-400"></i>
              <span> 4.8/5</span>
            </p>
            {/* Acciones */}
            <div className="py-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleOpenViewModal(curso)}>
                <i className="fa-solid fa-eye bg-green-600 text-white p-2"></i>
              </motion.button>

              { user && (user.id_rol === 1 || user.id_rol === 2) && (
                <>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleOpenEditModal(curso)}>
                    <i className="fa-solid fa-pen bg-blue-600 text-white p-2"></i>
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteCourse(curso.id)}>
                    <i className="fa-solid fa-trash bg-red-600 text-white p-2"></i>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
