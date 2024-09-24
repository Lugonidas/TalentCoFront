import { useContext, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import useTarea from "../../hooks/useTarea";
import CourseContext from "../../context/CourseProvider";
import Loader from "../../components/Loader";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Rating from "../../components/Rating";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import CreateTarea from "./CreateTarea";
import Modal from "../../components/Modal";
import useComentario from "../../hooks/useComentario";
import ShowTarea from "./ShowTarea";
import EditTarea from "./EditTarea";

export default function Inicio() {
  const { user, isAdmin } = useAuth({ middleware: "auth" });
  const { selectedCourse, getCourseById } = useContext(CourseContext);
  const {
    getTareasByCurso,
    tareas,
    handleOpenCreateModalTarea,
    handleOpenEditModal,
    editModal,
    createModalTarea,
    loading,
    viewModal,
    handleOpenViewModal,
  } = useTarea();

  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;

  const { courseId } = useParams();

  const { comentarios } = useComentario();

  useEffect(() => {
    getTareasByCurso(courseId);
    getCourseById(courseId);
  }, [courseId]);

  // Calcular el promedio de calificaciones
  const totalCalificaciones = comentarios.reduce(
    (acc, comentario) => acc + comentario.calificacion,
    0
  );
  const promedioCalificaciones =
    comentarios.length > 0 ? totalCalificaciones / comentarios.length : 0;

  if (!selectedCourse) {
    return <Loader />;
  }

  return (
    <div className="mx-auto px-2">
      {viewModal && (
        <Modal>
          <div className="relative md:w-3/4 mx-auto my-2 p-2 bg-white shadow-md opacity-100">
            <ShowTarea />
          </div>
        </Modal>
      )}
      {editModal && (
        <Modal>
          <div className="relative md:w-3/4 mx-auto my-2 p-2 bg-white shadow-md opacity-100">
            <EditTarea />
          </div>
        </Modal>
      )}
      {createModalTarea && (
        <Modal>
          <div className="relative md:w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <CreateTarea />
          </div>
        </Modal>
      )}
      <div className="border border-dotted my-2 px-4 md:px-10">
        <div className="mb-4 flex justify-end gap-4 items-center ">
          <Link
            to={`${user ? "/dashboard" : ""}/cursos/show/${selectedCourse.id}`}
            aria-label={`Volver al curso ` + selectedCourse.titulo}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Volver a los cursos"
            >
              <i className="fa-regular fa-circle-left text-3xl text-green-800"></i>
            </motion.button>
          </Link>

          {user?.id == selectedCourse.id_docente && (
            <>
              {/* <button
                onClick={handleOpenCreateModal}
                className="my-4 py-1 px-2 bg-purple-800 text-white transition-all ease-in-out hover:scale-105"
                aria-label="Agregar Lección"
              >
                Agregar Lección
              </button> */}
              <button
                onClick={handleOpenCreateModalTarea}
                className="my-4 py-1 px-2 bg-purple-800 text-white transition-all ease-in-out hover:scale-105"
                aria-label="Agregar Lección"
              >
                Agregar Tarea
              </button>
            </>
          )}
        </div>
        <div>
          <div className="grid md:grid-cols-2 gap-14 w-full border-b border-indigo-800 border-dotted pb-4">
            <div className="">
              <img
                loading="lazy"
                className="max-h-[300px] block mx-auto"
                src={`${apiUrl}/storage/${selectedCourse.imagen}`}
                alt={`Imagen ${selectedCourse.titulo}`}
              />
            </div>
            <div className="text-left">
              <p className="capitalize font-bold text-2xl text-indigo-800">
                {selectedCourse.titulo}
              </p>
              <span className="bg-yellow-500 text-black px-1 font-bold">
                {selectedCourse.categoria?.nombre}
              </span>
              <p>{selectedCourse.descripcion}</p>
              <p className="capitalize">
                <span className="font-bold">Por: </span>
                {selectedCourse.docente?.name}{" "}
                {selectedCourse.docente?.apellido}
              </p>

              <div>
                <Rating
                  initialRating={promedioCalificaciones}
                  readOnly={true}
                  className="flex items-center gap-2"
                />
              </div>

              <p>
                <i className="text-indigo-800 fa-solid fa-graduation-cap"></i>{" "}
                {selectedCourse.estudiantes.length}
              </p>
              <p>
                <i className="text-indigo-800 fa-regular fa-clock"></i>{" "}
                {selectedCourse.duracion}
                {selectedCourse.duracion.length == 1 ? " Hora" : " Horas"}
              </p>
              <p>
                <i className="text-indigo-800 fa-solid fa-swatchbook"></i>{" "}
                {selectedCourse.lecciones.length}
                {selectedCourse.lecciones.length == 1
                  ? " Lección"
                  : " Lecciones"}
              </p>
              <p className="text-xs">
                Creado:{" "}
                {formatDistanceToNow(new Date(selectedCourse.created_at), {
                  locale: es,
                  addSuffix: true,
                })}
              </p>
              <p className="text-xs">
                Actualizado:{" "}
                {formatDistanceToNow(new Date(selectedCourse.updated_at), {
                  locale: es,
                  addSuffix: true,
                })}
              </p>

              {/* {!estaInscrito &&
                user &&
                user?.id_rol != 1 &&
                user?.id_rol != 3 && (
                  <div>
                    <button
                      aria-label={textoBtnIncripcion}
                      onClick={() => inscribirme(user.id, selectedCourse.id)}
                      className="py-1 px-4 my-3 text-indigo-800 uppercase font-bold transition-all ease-linear hover:bg-indigo-800 hover:text-white outline-dotted outline-indigo-800"
                    >
                      {textoBtnIncripcion}
                    </button>
                  </div>
                )}

              {estaInscrito && (
                <span className="py-1 px-2 bg-indigo-800 text-white inline-block my-2">
                  Inscrito
                </span>
              )} */}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-black uppercase mb-4 text-indigo-800">
          Listado de tareas
        </h3>

        {loading ? (
          <Loader /> // Mostrar el loader mientras se cargan las tareas
        ) : tareas && tareas.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {tareas.map((tarea) => (
              <div
                key={tarea.id}
                className="relative shadow-md p-2 flex flex-col mb-4 transition-all ease-in hover:shadow-lg"
              >
                <strong className="text-xs">Título</strong>
                <p>{tarea.titulo}</p>
                <strong className="text-xs">Descripción</strong>
                <p>{tarea.descripcion}</p>
                <p className="capitalize text-xs">
                  <strong>Activo:</strong>{" "}
                  {formatDistanceToNow(new Date(tarea.fecha_inicio), {
                    locale: es,
                    addSuffix: true,
                  })}
                </p>
                <p className="capitalize text-xs">
                  <strong>Cierre:</strong>{" "}
                  {formatDistanceToNow(new Date(tarea.fecha_fin), {
                    locale: es,
                    addSuffix: true,
                  })}
                </p>

                <span
                  className={`${
                    new Date() >
                    new Date(tarea.fecha_fin).setHours(23, 59, 59, 999)
                      ? "bg-red-600" // Si la fecha actual es mayor que la fecha de cierre, está cerrada
                      : "bg-green-600" // De lo contrario, está activa
                  } my-2 px-2 py-1 text-xs inline-block w-min text-white font-bold`}
                >
                  {new Date() >
                  new Date(tarea.fecha_fin).setHours(23, 59, 59, 999)
                    ? "Cerrada"
                    : "Activa"}{" "}
                </span>

                {/* Acciones */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleOpenViewModal(tarea)}
                    className="py-1 px-2 text-white bg-indigo-500 transition-all ease-linear hover:scale-110"
                  >
                    Ver
                  </button>

                  {/*                   {user && isAdmin && (
                    <div className="space-y-4 my-2 absolute bottom-0 right-2">
                      <div className="flex flex-col">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={tarea.estado == 1}
                            onChange={() => handleSwitchChange(curso)}
                          />
                          <div className="peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-500 w-8 h-8 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-['✖️'] after:rounded-full after:absolute after:outline-none after:h-6 after:w-6 after:bg-gray-50 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-hover:after:scale-75 peer-checked:after:content-['✔️'] after:-rotate-180 peer-checked:after:rotate-0"></div>
                        </label>
                      </div>
                    </div>
                  )} */}

                  {user && user.id == selectedCourse.id_docente && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleOpenEditModal(tarea)}
                        aria-label="Ir a editar el curso"
                      >
                        <i className="fa-solid fa-pen bg-blue-600 text-white p-2"></i>
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay tareas disponibles</p> // Mensaje si no hay tareas
        )}
      </div>
    </div>
  );
}
