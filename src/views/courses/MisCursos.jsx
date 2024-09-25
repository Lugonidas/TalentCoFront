import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useCourse from "../../hooks/useCourse";
import Modal from "../../components/Modal";
import CreateCourse from "./CreateCourse";
import EditCourse from "./EditCourse";
import Loader from "../../components/Loader";

export default function MisCursos() {
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;
  const { user, isStudent, isAdmin, isTeacher } = useAuth({
    middleware: "auth",
  });

  const {
    handleOpenEditModal,
    handleOpenCreateModal,
    createModal,
    editModal,
    selectedCourse,
    obtenerMisCursos,
    misCursos,
    loading,
  } = useCourse();

  // Filtra cursos activos
  const cursosActivos = misCursos.filter((curso) => curso.estado == 1);

  const estaVacio = () => misCursos.length === 0;

  useEffect(() => {
    if (user) {
      if (isTeacher || isAdmin) {
        obtenerMisCursos(user.id, "docente");
      } else if (isStudent) {
        obtenerMisCursos(user.id, "estudiante");
      }
    }
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {createModal && (
        <Modal>
          <div className="relative md:w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <CreateCourse />
          </div>
        </Modal>
      )}

      {editModal && selectedCourse && (
        <Modal>
          <div className="relative md:w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <EditCourse />
          </div>
        </Modal>
      )}

      <div className="px-2 border border-dotted m-2 min-h-full">
        <div className="px-2 my-2">
          <h1 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
            Mis Cursos
          </h1>

          {user && (isAdmin || isTeacher) && (
            <button
              className="my-4 py-1 px-2 bg-purple-800 text-white transition-all ease-in-out hover:scale-105"
              onClick={handleOpenCreateModal}
            >
              Agregar Curso
            </button>
          )}
        </div>

        <>
          {estaVacio() ? (
            <div>
              <span>No te has inscrito a ningún curso</span>
              <Link
                to="/dashboard/cursos"
                className="text-indigo-800 font-bold mx-1"
              >
                Ver cursos
              </Link>

              {(isAdmin || isTeacher) && (
                <>
                  <span>Aún no has creado ningún curso</span>
                  <button
                    className="my-4 py-1 px-2 bg-purple-800 text-white transition-all ease-in-out hover:scale-105"
                    onClick={handleOpenCreateModal}
                  >
                    Agregar Curso
                  </button>
                </>
              )}
            </div>
          ) : (
            <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {cursosActivos &&
                cursosActivos.map((curso) => (
                  <motion.li
                    key={curso.id}
                    className="grid md:grid-cols-2 gap-2 bg-white shadow-md transition-all ease-linear hover:shadow-xl overflow-hidden md:h-[200px]"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <motion.img
                        src={`${apiUrl}/storage/${curso.imagen}`}
                        alt={`Imagen ${curso.titulo}`}
                        className="w-full h-full object-cover"
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
                        <i className="fa-regular fa-clock"></i> {curso.duracion}{" "}
                        Horas
                      </span>
                      <p className="text-xs">
                        <i className="fa-solid fa-star text-yellow-400"></i>
                        <i className="fa-solid fa-star text-yellow-400"></i>
                        <i className="fa-solid fa-star text-yellow-400"></i>
                        <i className="fa-solid fa-star text-yellow-400"></i>
                        <i className="fa-solid fa-star text-yellow-400"></i>
                        <span> 4.8/5</span>
                      </p>
                      <div className="md:py-2">
                        <Link to={`/dashboard/cursos/show/${curso.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <i className="fa-solid fa-eye bg-green-600 text-white p-2"></i>
                          </motion.button>
                        </Link>

                        {user &&
                          Number(user.id) == isTeacher && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleOpenEditModal(curso)}
                              >
                                <i className="fa-solid fa-pen bg-blue-600 text-white p-2"></i>
                              </motion.button>
                            </>
                          )}
                      </div>
                    </div>
                  </motion.li>
                ))}
            </ul>
          )}
        </>
      </div>
    </>
  );
}
