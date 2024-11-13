import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/es";
import { motion } from "framer-motion";
import CreateLeccion from "../lecciones/CreateLeccion";
import Modal from "../../components/Modal";
import useLeccion from "../../hooks/useLeccion";
import useCourse from "../../hooks/useCourse";
import useComentario from "../../hooks/useComentario";
import { useAuth } from "../../hooks/useAuth";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import Accordion from "../../components/accordion/Accordion";
import ShowLeccion from "../lecciones/ShowLeccion";
import EditLeccion from "../lecciones/EditLeccion";
import EditComentario from "../comentarios/EditComentario";
import Rating from "../../components/Rating";
import "../../styles/spinner.scss";
import CreateComentario from "../comentarios/CreateComentario";
import Loader from "../../components/Loader";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import useTarea from "../../hooks/useTarea";
import CreateTarea from "../tareas/CreateTarea";
import StudentList from "../students/StudentList";

moment.locale("es");
export default function ShowCourse() {
  const { user, isAdmin, isTeacher } = useAuth({ middleware: "guest" });
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;
  const { courseId } = useParams();
  const menuRef = useRef(null);

  const [viewStudents, setViewStudents] = useState(false);
  const [estaInscrito, setEstaInscrito] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openEncuesta, setOpenEncuesta] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    selectedCourse,
    getCourseById,
    progreso,
    obtenerProgresoCurso,
    loading,
  } = useCourse();

  const { estudiantes } = selectedCourse ? selectedCourse : [];

  const {
    handleOpenEditModal,
    editModal: editModalComentario,
    selectedComentario,
    comentarios,
    haComentado,
    setHaComentado,
    loading: loadingComentarios,
  } = useComentario();

  const { createModalTarea, handleOpenCreateModalTarea } = useTarea();

  const descargarPDF = async () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      setIsSubmitting(true);
      // Realiza la petición a tu backend para generar el PDF
      const response = await clienteAxios.get(
        `curso/${courseId}/descargar-pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf", // Cambiado a "Accept" para indicar que esperas un PDF
          },
          responseType: "blob", // Asegúrate de que el tipo de respuesta es 'blob'
        }
      );

      // Crea un objeto URL para el blob y descarga el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `curso_${selectedCourse.titulo}.pdf`); // Asegúrate de usar courseId
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link); // Limpia el DOM
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      /* setErrores(errores.response.data.errors); */
    } finally {
      setIsSubmitting(false);
    }
  };

  const {
    handleOpenCreateModal,
    editModal,
    createModal,
    viewModal,
    lecciones,
    loadingLecciones,
    updateLecciones,
  } = useLeccion();

  const handleOpenViewStudents = () => {
    setViewStudents(true);
  };
  const handleCloseViewStudents = () => {
    setViewStudents(false);
  };

  // Función para manejar el clic fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  useEffect(() => {
    const fetchData = async () => {
      await getCourseById(courseId);
      updateLecciones(courseId);
      if (user && Number(user.id_rol) == 2) {
        await obtenerProgresoCurso(courseId);
      }
    };

    fetchData();
  }, [courseId]);

  useEffect(() => {
    if (selectedCourse && user) {
      const estaInscrito = selectedCourse.estudiantes.some(
        (estudiante) => Number(estudiante.id) == Number(user.id)
      );
      setEstaInscrito(estaInscrito);

      // Verificar si el usuario ha comentado
      const comentado = comentarios.some(
        (comentario) => Number(comentario.id_usuario) == Number(user.id)
      );
      setHaComentado(comentado);
    }
  }, [selectedCourse, user, comentarios]);

  const textoBtnIncripcion = estaInscrito ? "Ya inscrito" : "Inscribirse";

  const leccionesFiltradas =
    selectedCourse && user?.id == selectedCourse.id_docente
      ? lecciones
      : lecciones.filter((leccion) => leccion.estado == 1);

  const inscribirme = async (userId, cursoId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, inscribirme!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await clienteAxios.post(
          "inscripcion",
          {
            id_estudiante: userId,
            id_curso: cursoId,
            estado: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEstaInscrito(true);
        getCourseById(selectedCourse.id);
      }
    } catch (error) {
      console.error("Error:", error.response.data);
    }
  };

  // Redondear el progreso a un decimal
  const progresoCurso = progreso != null ? progreso.toFixed(1) : null;

  const totalCalificaciones = comentarios.reduce(
    (acc, comentario) => acc + Number(comentario.calificacion),
    0
  );

  const promedioCalificaciones =
    comentarios.length > 0
      ? (Number(totalCalificaciones) / comentarios.length).toFixed(1)
      : 0;

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {viewStudents && (
        <Modal>
          <div className="relative md:w-3/4 mx-auto my-4 p-6 bg-indigo-600 shadow-md opacity-100">
            <StudentList
              cursoId={selectedCourse.id}
              students={estudiantes}
            ></StudentList>
            <button
              className="py-2 px-4 my-2 text-white border "
              onClick={handleCloseViewStudents}
            >
              Cerrar
            </button>
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
      {createModal && (
        <Modal>
          <div className="relative md:w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <CreateLeccion />
          </div>
        </Modal>
      )}
      {viewModal && (
        <Modal>
          <div className="relative md:w-3/4 mx-auto my-2 p-2 bg-white shadow-md opacity-100">
            <ShowLeccion />
          </div>
        </Modal>
      )}
      {editModal && (
        <Modal>
          <div className="relative md:w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <EditLeccion />
          </div>
        </Modal>
      )}
      {editModalComentario && selectedComentario && (
        <Modal>
          <div className="relative md:w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <EditComentario />
          </div>
        </Modal>
      )}
      {openEncuesta && (
        <Modal>
          <div className="relative md:w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScBNllAQSN3_iks36i7XqU7OVYV717aKwudyqV7TCM6qWmbRQ/viewform?embedded=true"
              className="w-full min-h-screen"
            >
              Cargando…
            </iframe>
            <button
              className="absolute top-0 right-0 text-sm transition-all duration-100 ease hover:cursor-pointer hover:scale-110 p-1 bg-red-500 text-white font-bold"
              onClick={() => setOpenEncuesta(!openEncuesta)}
            >
              X Cerrar
            </button>
          </div>
        </Modal>
      )}
      {selectedCourse && (
        <>
          <div className="mx-auto px-2">
            <div className="border border-dotted my-2 px-4 md:px-10">
              <div className="mb-4 flex justify-end gap-4 items-center ">
                {/* Botón para volver a los cursos */}
                <Link
                  to={`${user ? "/dashboard" : ""}/cursos`}
                  aria-label="Volver a los cursos"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Volver a los cursos"
                  >
                    <i className="fa-regular fa-circle-left text-3xl text-green-800"></i>
                  </motion.button>
                </Link>

                {/* Enlace para ver tareas si está inscrito o es docente/admin */}
                {estaInscrito || isTeacher || isAdmin ? (
                  <>
                    {/* <button
                      onClick={() => setOpenEncuesta(!openEncuesta)}
                      className={`${
                        isSubmitting ? "bg-gray-400 cursor-not-allowed" : ""
                      } my-4 py-1 px-2 bg-green-600 text-white transition-all ease-in-out hover:scale-105`}
                    >
                      Realizar Encuesta
                    </button> */}

                    <Link
                      to={`/dashboard/tareas/curso/${selectedCourse.id}`}
                      className="my-4 py-1 px-2 bg-yellow-600 text-white transition-all ease-in-out hover:scale-105"
                      aria-label="Ver tareas"
                    >
                      Ver Tareas
                    </Link>
                  </>
                ) : null}

                <button
                  onClick={descargarPDF}
                  disabled={isSubmitting}
                  className={`${
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : ""
                  } my-4 py-1 px-2 bg-red-600 text-white transition-all ease-in-out hover:scale-105`}
                >
                  <i className="fa-solid fa-file-pdf"></i>{" "}
                  {isSubmitting ? "Descargando..." : "Curso"}
                </button>
                {/* Menú de tres puntitos */}
                {user?.id == selectedCourse.id_docente && (
                  <div className="relative">
                    {/* Icono de tres puntitos */}
                    <button
                      className="text-indigo-800 text-3xl hover:text-gray-400 p-2"
                      onClick={() => setIsMenuOpen((prev) => !prev)} // Toggle del menú al hacer clic
                      aria-label="Mostrar menú"
                    >
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>

                    {isMenuOpen && (
                      <div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10"
                        ref={menuRef} // Referencia al menú para detectar clics fuera
                      >
                        <button
                          onClick={handleOpenCreateModal}
                          className="block w-full py-2 px-4 text-left text-gray-800 hover:bg-gray-200"
                          aria-label="Agregar Lección"
                        >
                          Agregar Lección
                        </button>
                        <button
                          onClick={handleOpenCreateModalTarea}
                          className="block w-full py-2 px-4 text-left text-gray-800 hover:bg-gray-200"
                          aria-label="Agregar Tarea"
                        >
                          Agregar Tarea
                        </button>
                        <button
                          onClick={handleOpenViewStudents}
                          className="block w-full py-2 px-4 text-left text-gray-800 hover:bg-gray-200"
                          aria-label="Ver Estudiantes"
                        >
                          Ver Estudiantes
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <div className="grid md:grid-cols-2 gap-14 w-full border-b border-indigo-800 border-dotted pb-4">
                  <div className="">
                    <img
                      loading="lazy"
                      className="max-h-[300px] block mx-auto"
                      src={`${selectedCourse.imagen}`}
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
                      {formatDistanceToNow(
                        new Date(selectedCourse.created_at),
                        { locale: es, addSuffix: true }
                      )}
                    </p>
                    <p className="text-xs">
                      Actualizado:{" "}
                      {formatDistanceToNow(
                        new Date(selectedCourse.updated_at),
                        { locale: es, addSuffix: true }
                      )}
                    </p>

                    {!estaInscrito &&
                      user &&
                      user?.id_rol != 1 &&
                      user?.id_rol != 3 && (
                        <div>
                          <button
                            aria-label={textoBtnIncripcion}
                            onClick={() =>
                              inscribirme(user.id, selectedCourse.id)
                            }
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
                    )}
                  </div>
                </div>
              </div>
              <div className="my-4 grid md:grid-cols-2 gap-14 min-h-52">
                <div>
                  <h4 className="text-left font-bold text-xl">
                    Contenido del curso
                  </h4>

                  {estaInscrito && (
                    <strong className="text-xs text-indigo-800">
                      Progreso: <span>{progresoCurso} %</span>
                    </strong>
                  )}

                  {/* Lecciones */}
                  <div className="text-left">
                    {loadingLecciones ? (
                      <div className="flex items-center justify-center h-screen">
                        <span className="loader"></span>
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-500 font-bold">
                          {leccionesFiltradas.length} Lecciones
                        </span>
                        {leccionesFiltradas && (
                          <div className="mt-2">
                            <Accordion items={leccionesFiltradas} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 text-2xl">
                      <h4 className="text-left font-bold text-xl">
                        Valoración del curso
                      </h4>
                      <strong className="text-gray-500 flex items-center">
                        <Rating
                          initialRating={promedioCalificaciones}
                          readOnly={true}
                        />
                      </strong>
                    </div>
                    {!haComentado && estaInscrito && <CreateComentario />}

                    {comentarios && comentarios.length > 0 && (
                      <>
                        <div>
                          <h2 className="flex gap-1 text-md font-bold text-gray-500">
                            <span>{comentarios.length}</span>
                            {comentarios.length == 1
                              ? "Valoración"
                              : "Valoraciones"}
                          </h2>

                          <ul>
                            {comentarios.map((comentario) => (
                              <li
                                className="shadow-md p-2 flex flex-col relative"
                                key={comentario.id}
                              >
                                <div className="flex border-b border-dotted border-indigo-800">
                                  <img
                                    loading="lazy"
                                    className="w-16"
                                    src={`${comentario.user.imagen}`}
                                    alt={`Imagen ${comentario.user.name}`}
                                  />
                                  <div>
                                    <strong>{comentario.user.name}</strong>
                                    <strong className="text-indigo-800">
                                      <Rating
                                        initialRating={comentario.calificacion}
                                        readOnly={true}
                                      />
                                    </strong>
                                  </div>
                                </div>
                                <span>{comentario.comentario}</span>
                                {haComentado &&
                                  comentario.id_usuario == user.id && (
                                    <motion.button
                                      className="absolute top-0 right-0"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() =>
                                        handleOpenEditModal(comentario)
                                      }
                                      aria-label="Editar Comentario"
                                    >
                                      <i className="fa-solid fa-pen bg-blue-600 text-white p-2"></i>
                                    </motion.button>
                                  )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
