import "moment/locale/es";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import useTarea from "../../hooks/useTarea";
import useCourse from "../../hooks/useCourse";
import { useAuth } from "../../hooks/useAuth";
import useRespuestaEstudiante from "../../hooks/useRespuestaEstudiante";
import Modal from "../../components/Modal";
import CreateRespuestaEstudiante from "../respuestas/CreateRespuestaEstudiante";

export default function ShowTarea() {
  const { user, isAdmin, isStudent, isTeacher } = useAuth({
    middleware: "auth",
  });
  const { selectedTarea, handleCloseModals, tareas } = useTarea();
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;

  const { selectedCourse } = useCourse();
  const { handleOpenCreateModal, createModal } = useRespuestaEstudiante();
  const { estudiantes } = selectedCourse;
  const { respuestas } = selectedTarea;

  // Construir la URL del archivo
  const archivoUrl = `${apiUrl}/storage/${selectedTarea.archivo}`;

  return (
    <>
      {createModal && (
        <Modal>
          <div className="relative w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
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
          <p className="capitalize text-xs">
            <strong>Cierre:</strong>{" "}
            {formatDistanceToNow(new Date(selectedTarea.fecha_fin), {
              locale: es,
              addSuffix: true,
            })}
          </p>
          <p className="capitalize text-xs">
            <strong>Estado:</strong>
            <span
              className={`${
                selectedTarea.estado == 1 ? "bg-green-600" : "bg-red-600"
              } m-2 px-2 py-1 inline-block text-white font-bold`}
            >
              {selectedTarea.estado == 1 ? "Activa" : "Cerrada"}
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
            <div className="grid grid-cols-2 gap-4">
              {estudiantes.map((estudiante) => {
                // Buscar la respuesta del estudiante
                const respuestaEstudiante = respuestas.find(
                  (respuesta) => respuesta.id_estudiante === estudiante.id
                );

                // Verificar si el estudiante ha entregado
                const haEntregado = !!respuestaEstudiante;

                return (
                  <div
                    key={estudiante.id}
                    className="relative shadow-lg p-2 grid grid-cols-2 gap-4 mb-4 transition-all ease-in hover:shadow-lg"
                  >
                    <div className="border-r-2">
                      <div className="">
                        <strong className="text-xs">Nombre Completo </strong>
                        <p className="capitalize">
                          {estudiante.name} {estudiante.apellido}
                        </p>
                      </div>
                      <div className="">
                        <strong className="text-xs">Email </strong>
                        <p className="capitalize">{estudiante.email}</p>
                      </div>
                    </div>

                    {haEntregado && (
                      <div className="">
                        <strong className="text-xs">Respuesta: </strong>
                        <p className="capitalize">
                          {respuestaEstudiante.texto_respuesta}
                        </p>

                        {respuestaEstudiante.archivo && (
                          <div className="mt-2">
                            <strong className="text-xs">
                              Archivo Entregado:{" "}
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
                      </div>
                    )}
                    <div
                      className={`${
                        haEntregado ? "bg-green-600" : "bg-red-600"
                      } absolute right-0 bottom-0`}
                    >
                      <p className="p-1 text-xs font-bold text-white">{haEntregado ? "Entregado" : "No entregado"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          {isStudent && (
            <button
              onClick={handleOpenCreateModal}
              className="my-4 py-1 px-2 bg-purple-800 text-white transition-all ease-in-out hover:scale-105"
              aria-label="Agregar Lección"
            >
              Agregar Entrega
            </button>
          )}
        </div>

        <button
          className="absolute top-2 right-2 text-2xl transition-all duration-100 ease hover:cursor-pointer hover:scale-110"
          onClick={handleCloseModals}
        >
          <i className="fa-solid fa-rectangle-xmark text-indigo-800"></i>
        </button>
      </div>
    </>
  );
}
