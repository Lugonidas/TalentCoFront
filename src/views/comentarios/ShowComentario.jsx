import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/es";
import { motion } from "framer-motion";
import CreateLeccion from "../lecciones/CreateLeccion";
import Modal from "../../components/Modal";
import useLeccion from "../../hooks/useLeccion";
import useCourse from "../../hooks/useCourse";
import { useAuth } from "../../hooks/useAuth";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import Accordion from "../../components/accordion/Accordion";
import ShowLeccion from "../lecciones/ShowLeccion";
import EditLeccion from "../lecciones/EditLeccion";
import Rating from "../../components/Rating";
import "../../styles/spinner.scss";

export default function ShowCourse() {
  const { user } = useAuth({ middleware: "guest" });
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;

  const { courseId } = useParams();
  const {
    selectedCourse,
    getCourseById,
    createComentarioCourse,
    progreso,
    obtenerProgresoCurso,
    loading,
  } = useCourse();
  const {
    handleOpenCreateModal,
    editModal,
    createModal,
    viewModal,
    lecciones,
    loadingLecciones,
    updateLecciones,
  } = useLeccion();
  const [estaInscrito, setEstaInscrito] = useState(false);
  const [haComentado, setHaComentado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCalificacion((prevCalificacion) => ({
      ...prevCalificacion,
      [name]: value,
    }));
  };

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
      const haComentado = selectedCourse.comentarios.some(
        (comentario) => Number(comentario.id_usuario) == Number(user.id)
      );
      setHaComentado(haComentado);
    }

    // Asegúrate de que el estado `calificacion` se actualice correctamente aquí
    setCalificacion((prevCalificacion) => ({
      ...prevCalificacion,
      id_usuario: user ? user.id : prevCalificacion.id_usuario,
      commentable_id: selectedCourse
        ? selectedCourse.id
        : prevCalificacion.commentable_id,
    }));
  }, [selectedCourse, user]);

  const textoBtnIncripcion = estaInscrito ? "Ya inscrito" : "Inscribirse";

  const leccionesFiltradas =
    selectedCourse && Number(user?.id) == Number(selectedCourse.id_docente)
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
          "/inscripcion",
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

  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setCalificacion((prevCalificacion) => ({
      ...prevCalificacion,
      calificacion: newRating, // Actualiza la calificación en `calificacion`
    }));
  };

  const [calificacion, setCalificacion] = useState({
    id_usuario: null,
    comentario: "Excelente curso.",
    calificacion: rating,
    commentable_type: "App\\Models\\Curso",
    commentable_id: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Aquí asegúrate de que `calificacion` esté actualizado
    setCalificacion((prevCalificacion) => ({
      ...prevCalificacion,
      id_usuario: user.id,
      commentable_id: selectedCourse.id,
    }));

    const formData = new FormData();
    Object.keys(calificacion).forEach((key) => {
      formData.append(key, calificacion[key]);
    });
    try {
      await createComentarioCourse(formData);
      getCourseById(selectedCourse.id);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading || !selectedCourse) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader"></span>
      </div>
    );
  }

  // Calcular el promedio de calificaciones
  const totalCalificaciones = selectedCourse.comentarios.reduce(
    (acc, comentario) => acc + comentario.calificacion,
    0
  );
  const promedioCalificaciones =
    selectedCourse.comentarios.length > 0
      ? totalCalificaciones / selectedCourse.comentarios.length
      : 0;

  return (
    <>
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
      {selectedCourse && (
        <>
          <div className="mx-auto px-2">
            <div className="border border-dotted my-2 px-4 md:px-10">
              <div className="my-4 flex gap-4 items-center">
                <Link to={`${user ? "/dashboard" : ""}/cursos`}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className="fa-regular fa-circle-left text-3xl text-green-800"></i>
                  </motion.button>
                </Link>

                {Number(user?.id) == Number(selectedCourse.id_docente) && (
                  <button
                    onClick={handleOpenCreateModal}
                    className="my-4 py-1 px-2 bg-purple-800 text-white transition-all ease-in-out hover:scale-105"
                  >
                    Agregar Lección
                  </button>
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
                      <p>
                        <span className="font-bold">
                          {promedioCalificaciones}/5
                        </span>
                      </p>
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
                      Creado: {moment(selectedCourse.created_at).fromNow()}
                    </p>
                    <p className="text-xs">
                      Actualizado: {moment(selectedCourse.updated_at).fromNow()}
                    </p>

                    {!estaInscrito &&
                      user &&
                      user?.id_rol != 1 &&
                      user?.id_rol != 3 && (
                        <div>
                          <button
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
                      Progreso: <span>{progresoCurso}%</span>
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
                        {promedioCalificaciones}/5
                        <Rating
                          initialRating={promedioCalificaciones}
                          readOnly={true}
                        />
                      </strong>
                    </div>
                    {!haComentado &&
                      estaInscrito &&
                      Number(user.id_rol) == 2 && (
                        <form
                          onSubmit={handleSubmit}
                          className="space-y-4 my-2 border-t border-dotted border-indigo-800"
                          noValidate
                        >
                          <div className="my-2">
                            <label
                              htmlFor="comentario"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Comentario
                            </label>
                            <textarea
                              id="comentario"
                              name="comentario"
                              value={calificacion.comentario}
                              onChange={handleChange}
                              required
                              rows={3}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Describe brevemente el curso"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            Calificación:
                            <Rating
                              initialRating={rating}
                              onRatingChange={handleRatingChange}
                            />
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Agregar Calificación
                            </button>
                          </div>
                        </form>
                      )}

                    {selectedCourse.comentarios &&
                      selectedCourse.comentarios.length > 0 && (
                        <>
                          <div>
                            <h2 className="flex gap-1 text-md font-bold text-gray-500">
                              <span>{selectedCourse.comentarios.length}</span>
                              {selectedCourse.comentarios.length == 1
                                ? "Valoración"
                                : "Valoraciones"}
                            </h2>

                            <ul>
                              {selectedCourse.comentarios.map((comentario) => (
                                <li
                                  className="shadow-md p-2 flex flex-col relative"
                                  key={comentario.id}
                                >
                                  <div className="flex border-b border-dotted border-indigo-800">
                                    <img
                                      loading="lazy"
                                      className="w-16"
                                      src={`${apiUrl}/storage/${comentario.user.imagen}`}
                                      alt={`Imagen ${comentario.user.name}`}
                                    />
                                    <div>
                                      <strong>{comentario.user.name}</strong>
                                      <strong className="text-indigo-800">
                                        <Rating
                                          initialRating={
                                            comentario.calificacion
                                          }
                                          readOnly={true}
                                        />
                                      </strong>
                                    </div>
                                  </div>
                                  <span>{comentario.comentario}</span>
                                  {haComentado &&
                                    Number(comentario.id_usuario) ==
                                      Number(user.id) && (
                                      <motion.button
                                        className="absolute top-0 right-0"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() =>
                                          handleOpenEditModal(comentario)
                                        }
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
    </>
  );
}
