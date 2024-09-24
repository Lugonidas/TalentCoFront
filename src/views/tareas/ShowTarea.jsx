import "moment/locale/es";
import { formatDistanceToNow } from "date-fns";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";
import useTarea from "../../hooks/useTarea";
import useCourse from "../../hooks/useCourse";
import { useAuth } from "../../hooks/useAuth";
import useRespuestaEstudiante from "../../hooks/useRespuestaEstudiante";
import Modal from "../../components/Modal";
import CreateRespuestaEstudiante from "../respuestas/CreateRespuestaEstudiante";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EditNota from "../notas/EditNota";

export default function ShowTarea() {
  const { user, isStudent } = useAuth({
    middleware: "auth",
  });
  const [notas, setNotas] = useState({});
  const [modalEstudianteAbierto, setModalEstudianteAbierto] = useState(null);

  const { selectedTarea, handleCloseModals, createNota, errores } = useTarea();
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;

  const { selectedCourse } = useCourse();
  const { handleOpenCreateModal, createModal } = useRespuestaEstudiante();
  const { estudiantes } = selectedCourse;
  const { respuestas } = selectedTarea;

  const cierreFecha = new Date(selectedTarea.fecha_fin);
  const ahora = new Date();

  // Ajustar la hora de cierre a la medianoche del día siguiente
  const cierreAjustado = new Date(cierreFecha.setHours(23, 59, 59, 999));

  const handleChange = (e, id_estudiante) => {
    const { name, value } = e.target;

    setNotas((prevNotas) => ({
      ...prevNotas,
      [id_estudiante]: {
        ...prevNotas[id_estudiante],
        [name]: value,
      },
    }));
  };

  const handleOpenModal = (estudianteId) => {
    setModalEstudianteAbierto(estudianteId); // Abrir el modal solo para este estudiante
  };

  const handleCloseModal = () => {
    setModalEstudianteAbierto(null); // Cerrar el modal
  };

  // Construir la URL del archivo
  const archivoUrl = `${apiUrl}/storage/${selectedTarea.archivo}`;

  const handleSubmit = async (e, id_estudiante) => {
    e.preventDefault();

    const formData = new FormData();
    const notaEstudiante = notas[id_estudiante] || { nota: 0 }; // Default nota 0 si no está definida

    formData.append("id_evaluacion", selectedTarea.id);
    formData.append("id_estudiante", id_estudiante);
    formData.append("nota", notaEstudiante.nota);

    try {
      await createNota(formData);
    } catch {
      console.log(errores);
    }
  };

  return (
    <>
      {createModal && (
        <Modal>
          <div className="   w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <CreateRespuestaEstudiante />
          </div>
        </Modal>
      )}
      <h1 className="text-2xl text-center font-black uppercase mb-4 text-indigo-800">
        Tarea
      </h1>
      <div className="grid grid-cols-1 gap-2 mb-4">
        <div
          key={selectedTarea.id}
          className="p-2 flex flex-col mb-4 border-dotted border-b border-indigo-800"
        >
          <strong className="text-xs">Título</strong>
          <p>{selectedTarea.titulo}</p>
          <strong className="text-xs">Descripción</strong>
          <p>{selectedTarea.descripcion}</p>
          <p className="capitalize text-xs">
            <strong>Habilitada:</strong>{" "}
            {formatDistanceToNow(new Date(selectedTarea.fecha_inicio), {
              locale: es,
              addSuffix: true,
            })}
          </p>

          <p className="text-xs">
            <strong className="capitalize">Cierre:</strong>{" "}
            {cierreAjustado > ahora
              ? `Cierra en ${formatDistance(ahora, cierreAjustado, {
                  locale: es,
                  addSuffix: false,
                })}`
              : "La tarea ya ha cerrado"}
          </p>

          <p className="capitalize text-xs">
            <strong>Estado:</strong>
            <span
              className={`${
                new Date() >
                new Date(selectedTarea.fecha_fin).setHours(23, 59, 59, 999)
                  ? "bg-red-600" // Si la fecha actual es mayor que la fecha de cierre, está cerrada
                  : "bg-green-600" // De lo contrario, está activa
              } m-2 px-2 py-1 inline-block text-white font-bold`}
            >
              {new Date() >
              new Date(selectedTarea.fecha_fin).setHours(23, 59, 59, 999)
                ? "Cerrada"
                : "Activa"}{" "}
            </span>
          </p>

          <div className="pdf-container">
            <strong className="text-xs">Archivo: </strong>
            {selectedTarea.archivo ? (
              <embed
                src={archivoUrl}
                type="application/pdf"
                width="100%"
                height="600px"
              />
            ) : (
              <span>Aún no han agregado archivos para esta tarea</span>
            )}
          </div>
        </div>

        {user?.id == selectedCourse.id_docente && (
          <div>
            <h3 className="text-xl font-black uppercase mb-4 text-yellow-600">
              Estudiantes
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {estudiantes.map((estudiante) => {
                const respuestaEstudiante = respuestas.find(
                  (respuesta) => respuesta.id_estudiante == estudiante.id
                );

                const haEntregado = !!respuestaEstudiante;

                return (
                  <div
                    key={estudiante.id}
                    className="relative shadow-lg p-2 gap-4 mb-4 flex flex-col justify-between"
                  >
                    <div className="flex flex-col justify-between">
                      {/* Información del estudiante */}
                      <div className="grid md:grid-cols-2">
                        <div className="md:border-r-2">
                          <strong className="text-xs">Nombre Completo</strong>
                          <p className="capitalize">
                            {estudiante.name} {estudiante.apellido}
                          </p>
                          <strong className="text-xs">Email</strong>
                          <p className="">{estudiante.email}</p>
                        </div>

                        {haEntregado && (
                          <div className="px-2">
                            <strong className="text-xs">Respuesta:</strong>
                            <p className="capitalize">
                              {respuestaEstudiante.texto_respuesta}
                            </p>
                            {respuestaEstudiante.archivo && (
                              <div className="mt-2 flex flex-col">
                                <strong className="text-xs">
                                  Archivo Entregado:
                                </strong>
                                <a
                                  href={`${apiUrl}/storage/${respuestaEstudiante.archivo}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Ver Archivo
                                </a>
                              </div>
                            )}
                            <div className="absolute right-0 bottom-0">
                              <p className="p-1 text-xs font-bold text-white bg-green-600">
                                Entregado
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {respuestaEstudiante?.nota && (
                        <div className="mt-2">
                          <strong className="text-xs">Nota:</strong>
                          <p className="capitalize">
                            {respuestaEstudiante.nota.nota}
                          </p>
                          <motion.button
                            onClick={() => handleOpenModal(estudiante.id)}
                            className="py-1 px-2 bg-indigo-800 text-white font-bold text-xs rounded-sm hover:cursor-pointer"
                            whileTap={{ scale: 0.95 }}
                          >
                            Actualizar
                          </motion.button>

                          {/* Mostrar modal solo si el estudiante coincide con modalEstudianteAbierto */}
                          {modalEstudianteAbierto == estudiante.id && (
                            <EditNota
                              isOpen={modalEstudianteAbierto == estudiante.id}
                              onClose={handleCloseModal}
                              estudiante={estudiante}
                              notaEstudiante={respuestaEstudiante.nota.nota}
                              tarea={selectedTarea}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {haEntregado && !respuestaEstudiante?.nota && (
                      <div className="border-t-2 py-2">
                        <form
                          onSubmit={(e) => handleSubmit(e, estudiante.id)} // Asegúrate de pasar solo el id del estudiante
                          className="space-y-4"
                          noValidate
                        >
                          <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <label
                              htmlFor={`nota-${estudiante.id}`}
                              className="font-bold text-sm uppercase"
                            >
                              Calificar
                            </label>
                            <input
                              className="border-b"
                              type="number"
                              name="nota"
                              id={`nota-${estudiante.id}`}
                              value={notas[estudiante.id]?.nota || ""}
                              onChange={(e) => handleChange(e, estudiante.id)}
                              placeholder="Nota trabajo"
                              min="0"
                              max="100"
                              required
                            />
                            {errores?.nota && (
                              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                                {errores.nota}
                              </p>
                            )}
                          </div>

                          <motion.button
                            type="submit" // Asegúrate de que solo se envíe la nota del estudiante en esta función
                            className="py-1 px-2 bg-indigo-800 text-white font-bold text-xs rounded-sm hover:cursor-pointer"
                            whileTap={{ scale: 0.95 }}
                          >
                            Calificar
                          </motion.button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isStudent && (
          <div>
            {respuestas.map((respuesta) => {
              if (respuesta.id_estudiante == user.id) {
                console.log(respuesta);
                return (
                  <div key={respuesta.id}>
                    <strong className="text-indigo-800 text-2xl">
                      Tu Respuesta:
                    </strong>
                    <p>{respuesta.texto_respuesta}</p>
                    {respuesta.archivo && (
                      <div className="mt-2 flex flex-col">
                        <strong className="text-xs">Archivo Entregado:</strong>
                        <a
                          href={`${apiUrl}/storage/${respuesta.archivo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          Ver Archivo
                        </a>
                      </div>
                    )}
                    <div className="border-t mt-2 py-2">
                      <strong className="text-base">
                        Nota:{" "}
                        <span className="text-2xl text-indigo-800 font-bold">
                          {respuesta.nota?.nota ? respuesta.nota.nota : 0}
                        </span>{" "}
                      </strong>
                    </div>
                  </div>
                );
              }
              return null; // Para los casos donde no coincide
            })}
            {respuestas.find(
              (respuesta) => respuesta.id_estudiante == user.id
            ) ? null : new Date().setHours(0, 0, 0, 0) >
              new Date(selectedTarea.fecha_fin).setHours(23, 59, 59, 999) ? (
              <p className="text-red-800 bg-red-200 p-2 font-bold text-base">
                La tarea ya ha sido cerrada
              </p>
            ) : (
              <button
                onClick={handleOpenCreateModal}
                className="my-4 py-1 px-2 bg-purple-800 text-white transition-all ease-in-out hover:scale-105"
                aria-label="Agregar Entrega"
              >
                Agregar Entrega
              </button>
            )}
          </div>
        )}

        <button
          className="absolute top-2 right-2 text-2xl transition-all duration-100 ease hover:cursor-pointer hover:scale-110"
          onClick={handleCloseModals}
          aria-label="Cerrar modal"
        >
          <i className="fa-solid fa-rectangle-xmark text-indigo-800"></i>
        </button>
      </div>
    </>
  );
}
