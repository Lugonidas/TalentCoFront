import { useEffect, useRef } from "react";
import useChat from "../../hooks/useChat";

export default function Window() {
  const { conversacion, selectedUser } = useChat();
  const endOfMessagesRef = useRef(null);

  // Función para desplazar hacia abajo al nuevo mensaje
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Efecto que se activa cuando cambian las conversaciones
  useEffect(() => {
    scrollToBottom();
  }, [conversacion]); // Dependencia en la conversación para desplazarse al final al cargar nuevos mensajes

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleTimeString([], options); // Formato en 12 horas
  };

  return (
    <>
      {selectedUser && (
        <div className="flex-1 p-4 flex flex-col max-h-[80vh] overflow-y-scroll bg-white">
          {conversacion?.mensajes?.length ? (
            <>
              {conversacion.mensajes
                .slice() // Crear una copia del array para no modificar el estado original
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // Ordenar por fecha
                .map((mensaje, index) => (
                  <div key={`${mensaje.id}-${index}`} className="mb-2 flex">
                    {/* Compara el id del mensaje con el id del usuario autenticado */}
                    {mensaje.usuario?.id === selectedUser ? (
                      <div className="bg-gray-300 flex gap-4  justify-between items-end text-black p-2 rounded-lg max-w-full">
                        <div>{mensaje.mensaje}</div>
                        <small>{formatTime(mensaje.created_at)} </small>
                      </div>
                    ) : (
                      <div className="ml-auto bg-indigo-500 flex gap-4  justify-between items-end text-white p-2 rounded-lg max-w-full">
                        <div>{mensaje.mensaje}</div>
                        <small className="text-xs text-white">
                          {formatTime(mensaje.created_at)}{" "}
                        </small>
                      </div>
                    )}
                  </div>
                ))}
              {/* Elemento de referencia para desplazamiento */}
              <div ref={endOfMessagesRef} />
            </>
          ) : (
            <p>No hay mensajes en esta conversación.</p>
          )}
        </div>
      )}
    </>
  );
}
