import "moment/locale/es";
import useLeccion from "../../hooks/useLeccion";
import useArchivo from "../../hooks/useArchivo";
import moment from "moment";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../../components/Modal";
import CreateArchivo from "../archivo/CreateArchivo";
import ShowArchivo from "../archivo/ShowArchivo";

export default function ShowLeccion() {
  const { user } = useAuth({ middleware: "guest" });
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;

  const {
    handleCloseModals,
    selectedLeccion,
    getArchivosLeccionById,
    handleOpenEditModal,
  } = useLeccion();
  const {
    createModal,
    viewModal,
    handleOpenViewModal,
    handleOpenCreateModal,
    deleteArchivo,
    obtenerProgresoLeccion,
    progreso,
  } = useArchivo();

  useEffect(() => {
    getArchivosLeccionById(selectedLeccion.id);
    obtenerProgresoLeccion(selectedLeccion.id);
  }, [selectedLeccion.id, progreso]);

  // Agrupa archivos por tipo
  const archivosPorTipo = selectedLeccion.archivos.reduce((acc, archivo) => {
    if (!acc[archivo.tipo]) acc[archivo.tipo] = [];
    acc[archivo.tipo].push(archivo);
    return acc;
  }, {});


  const progresoLeccion = progreso != null ? progreso.toFixed(0) : null;

  return (
    <>
      {viewModal && (
        <Modal>
          <ShowArchivo />
        </Modal>
      )}
      {createModal && (
        <Modal>
          <div className="relative md:w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <CreateArchivo />
          </div>
        </Modal>
      )}
      {selectedLeccion && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-dotted border-b border-indigo-800 mb-4">
            <div className="text-center">
              <img
                className="max-h-[300px] block mx-auto"
                src={`${apiUrl}/storage/${selectedLeccion.imagen}`}
                alt={`Imagen ${selectedLeccion.titulo}`}
              />
            </div>
            <div>
              <h4 className="text-xl md:text-2xl font-black uppercase mb-4 text-indigo-800">
                {selectedLeccion.titulo}
              </h4>
              <p>{selectedLeccion.descripcion}</p>

              <div className="my-2">
                <p className="text-xs">
                  Creado: {moment(selectedLeccion.created_at).fromNow()}
                </p>
                <p className="text-xs">
                  Actualizado: {moment(selectedLeccion.updated_at).fromNow()}
                </p>
              </div>
              {user && user.id == selectedLeccion.id_docente && (
                <div className="flex gap-2">
                  <button
                    onClick={handleOpenCreateModal}
                    className="my-4 py-1 px-2 bg-purple-800 text-white transition-all ease-linear hover:scale-105"
                  >
                    Agregar archivo
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(selectedLeccion)}
                    className="p-1 my-4 bg-yellow-500 text-black transition-all ease-linear hover:scale-105"
                  >
                    <i className="fa-regular fa-pen-to-square"></i>Editar
                    Lección
                  </button>
                </div>
              )}
            </div>

            <span className="absolute right-2 bottom-1 text-4xl text-gray-600 font-bold">
              {selectedLeccion.orden}
            </span>

            <button
              className="absolute -top-5 -right-5 bottom-full text-4xl transition-all duration-100 ease hover:cursor-pointer hover:scale-110"
              onClick={handleCloseModals}
            >
              <i className="fa-solid fa-rectangle-xmark text-indigo-800"></i>
            </button>
          </div>

          <div>
            <h4 className="text-left font-bold text-xl flex flex-col">
              Contenido de la lección
              <strong className="text-xs text-gray-400">
                Total Archivos {selectedLeccion.archivos.length}
              </strong>
            </h4>
            {user && user.id_rol == 2 && (
              <strong className="text-xs text-indigo-800">
                Progreso: <span>{progresoLeccion}%</span>
              </strong>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {/* Columna de PDFs */}
              <div className="md:border-r">
                <h5 className="font-bold text-lg mb-2">PDFs</h5>
                {archivosPorTipo["PDF"] && archivosPorTipo["PDF"].length > 0 ? (
                  archivosPorTipo["PDF"].map((archivo, index) => {
                    return (
                      <div
                        key={index}
                        className="archivo-item flex gap-4 items-center"
                      >
                        <h4 className="font-bold text-indigo-500">
                          {archivo.nombre}
                        </h4>

                        <div className="flex gap-2 items-center">
                          <button onClick={() => handleOpenViewModal(archivo)}>
                            Ver
                          </button>
                          {/*  <a
                            href={archivoUrl}
                            target="_blank"
                            download={archivo.nombre}
                          >
                            <i className="fa-solid fa-download text-blue-600 transition-all ease-linear hover:scale-110"></i>
                          </a> */}
                          {user && user.id == selectedLeccion.id_docente && (
                            <button
                              onClick={() => deleteArchivo(archivo.id)}
                              className="py-1 text-red-800 transition-all ease-linear hover:scale-110"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No hay archivos PDF.</p>
                )}
              </div>

              {/* Columna de Imágenes */}
              <div className="md:border-r">
                <h5 className="font-bold text-lg mb-2">Imágenes</h5>
                {archivosPorTipo["IMG"] && archivosPorTipo["IMG"].length > 0 ? (
                  archivosPorTipo["IMG"].map((archivo, index) => {
                    return (
                      <div
                        key={index}
                        className="archivo-item flex gap-4 items-center"
                      >
                        <h4 className="font-bold text-indigo-500">
                          {archivo.nombre}
                        </h4>

                        <div className="flex gap-2 items-center">
                          <button onClick={() => handleOpenViewModal(archivo)}>
                            Ver
                          </button>

                          {/* <a
                            href={archivoUrl}
                            target="_blank"
                            download={archivo.nombre}
                          >
                            <i className="fa-solid fa-download text-blue-600 transition-all ease-linear hover:scale-110"></i>
                          </a> */}
                          {user && user.id == selectedLeccion.id_docente && (
                            <button
                              onClick={() => deleteArchivo(archivo.id)}
                              className="py-1 text-red-800 transition-all ease-linear hover:scale-110"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No hay imágenes.</p>
                )}
              </div>

              {/* Columna de Videos */}
              <div className="">
                <h5 className="font-bold text-lg mb-2">Videos</h5>
                {archivosPorTipo["VIDEO"] &&
                archivosPorTipo["VIDEO"].length > 0 ? (
                  archivosPorTipo["VIDEO"].map((archivo, index) => {
                    return (
                      <div
                        key={index}
                        className="archivo-item flex gap-4 items-center"
                      >
                        <h4 className="font-bold text-indigo-500">
                          {archivo.nombre}
                        </h4>

                        <div className="flex gap-2 items-center">
                          <button onClick={() => handleOpenViewModal(archivo)}>
                            <i className="fa-regular fa-eye text-green-600 transition-all ease-linear hover:scale-110"></i>
                          </button>
                          {/* <a
                            href={archivoUrl}
                            target="_blank"
                            download={archivo.nombre}
                          >
                            <i className="fa-solid fa-download text-blue-600 transition-all ease-linear hover:scale-110"></i>
                          </a> */}
                          {user && user.id == selectedLeccion.id_docente && (
                            <button
                              onClick={() => deleteArchivo(archivo.id)}
                              className="py-1 text-red-800 transition-all ease-linear hover:scale-110"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No hay videos.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
