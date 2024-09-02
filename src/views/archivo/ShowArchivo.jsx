import "moment/locale/es";
import useArchivo from "../../hooks/useArchivo";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function ShowArchivo() {
  const { user } = useAuth({ middleware: "auth" });
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;

  const { selectedArchivo, handleCloseModals, archivoVisto, verificarArchivoVisto } = useArchivo();

  const [startTime, setStartTime] = useState(null);
  const [hasViewed, setHasViewed] = useState(false);
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
      setHasViewed(false);

      // Si es un video, añadir un evento para cuando se termine de reproducir
      if (selectedArchivo.tipo == "VIDEO" && videoRef.current) {
        videoRef.current.addEventListener("ended", () => {
          if (user) {
            archivoVisto(selectedArchivo.id);
            setHasViewed(true);
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

        if (elapsedMinutes >= 1 && !hasViewed) {
          if (user) {
            archivoVisto(selectedArchivo.id);
            setHasViewed(true);
          }
        }
      }
    };

    const interval = setInterval(checkViewingTime, 300);

    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, [selectedArchivo, startTime, hasViewed, archivoVisto]);

  if (!selectedArchivo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader"></span>
      </div>
    );
  }

  // Construir la URL del archivo
  const archivoUrl = `${apiUrl}/storage/${selectedArchivo.ubicacion}`;

  return (
    <>
      {selectedArchivo && (
        <section className="modal-content bg-red-100">
          <div className="relative p-6 bg-white shadow-md">
            <h4 className="text-xl md:text-2xl font-black uppercase mb-4 text-indigo-800 text-center">
              {selectedArchivo.nombre}
            </h4>
            <span className="block mb-4 bg-yellow-600 text-white w-min px-2">{selectedArchivo.tipo}</span>

            {/* Mostrar contenido basado en el tipo de archivo */}
            {selectedArchivo.tipo === "VIDEO" && (
              <div className="video-container">
                <video ref={videoRef} controls className="w-full">
                  <source src={archivoUrl} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            )}

            {selectedArchivo.tipo === "IMG" && (
              <div className="image-container">
                <img
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
              className="absolute top-2 right-2 text-2xl transition-all duration-100 ease hover:cursor-pointer hover:scale-110"
              onClick={handleCloseModals}
            >
              <i className="fa-solid fa-rectangle-xmark text-indigo-800"></i>
            </button>
          </div>
        </section>
      )}
    </>
  );
}
