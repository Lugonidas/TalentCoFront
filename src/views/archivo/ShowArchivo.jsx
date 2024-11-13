import "moment/locale/es";
import useArchivo from "../../hooks/useArchivo";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/Loader";

export default function ShowArchivo() {
  const { user } = useAuth({ middleware: "auth" });
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;

  const {
    selectedArchivo,
    handleCloseModals,
    archivoVisto,
    verificarArchivoVisto,
    visto,
  } = useArchivo();

  const [startTime, setStartTime] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const checkIfViewed = async () => {
      if (selectedArchivo && user) {
        await verificarArchivoVisto(user.id, selectedArchivo.id);
      }
    };

    checkIfViewed();
  }, [selectedArchivo, user]);

  useEffect(() => {
    if (selectedArchivo) {
      // Guardar el tiempo de inicio de visualización
      setStartTime(new Date());

      // Si es un video, añadir un evento para cuando se termine de reproducir
      if (selectedArchivo.tipo == "VIDEO" && videoRef.current) {
        videoRef.current.addEventListener("ended", () => {
          if (user && !visto) {
            archivoVisto(selectedArchivo.id);
          }
        });
      }
    }
  }, [selectedArchivo]); // Dependencias: el efecto se ejecuta cuando selectedArchivo cambia

  useEffect(() => {
    // Función para verificar si el tiempo de visualización ha pasado el umbral
    const checkViewingTime = () => {
      if (
        selectedArchivo &&
        (selectedArchivo.tipo === "IMG" || selectedArchivo.tipo === "PDF") &&
        startTime
      ) {
        const currentTime = new Date();
        const elapsedMinutes = (currentTime - startTime) / 1000 / 60;

        if (elapsedMinutes >= 1) {
          if (user && !visto) {
            archivoVisto(selectedArchivo.id);
          }
        }
      }
    };

    const interval = setInterval(checkViewingTime, 300);

    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, [selectedArchivo, startTime, visto, archivoVisto]);

  if (!selectedArchivo) {
    return <Loader />;
  }

  // Construir la URL del archivo
  const archivoUrl = `${apiUrl}/storage/${selectedArchivo.ubicacion}`;

  return (
    <>
      {selectedArchivo && (
        <section className="modal-content bg-red-100">
          <div className="relative p-6 bg-white shadow-md">
            <h4 className="text-lg md:text-2xl font-black uppercase mb-4 text-indigo-800 text-center">
              {selectedArchivo.nombre}
              {visto && (
                <i className="fa-regular fa-eye text-yellow-500 mx-2"></i>
              )}
            </h4>
            <span className="block mb-4 bg-yellow-600 text-white w-min px-2">
              {selectedArchivo.tipo}
            </span>

            {/* Mostrar contenido basado en el tipo de archivo */}
            {selectedArchivo.tipo === "VIDEO" && (
              <div className="video-container">
                <video ref={videoRef} controls className="lg:w-1/2">
                  <source src={archivoUrl} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            )}

            {selectedArchivo.tipo === "IMG" && (
              <div className="image-container">
                <img
                  loading="lazy"
                  src={archivoUrl}
                  alt={selectedArchivo.nombre}
                  className="w-full"
                />
              </div>
            )}

            {selectedArchivo.tipo === "PDF" && (
              <div className="pdf-container">
                <embed
                  src={archivoUrl}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                />
              </div>
            )}

            <button
              className="absolute top-0 right-0 text-sm transition-all duration-100 ease hover:cursor-pointer hover:scale-110 p-1 bg-red-500 text-white font-bold"
              onClick={handleCloseModals}
            >
              X Cerrar
            </button>
          </div>
        </section>
      )}
    </>
  );
}
