import useChat from "../../hooks/useChat";

export default function Window() {
  const { conversacion, selectedUser } = useChat();

  return (
    <div>
      {selectedUser ? (
        <div className="flex-1 flex flex-col overflow-y-scroll">
          <div className="flex-1 p-4">
            {conversacion?.mensajes?.length ? (
              conversacion.mensajes.map((mensaje) => (
                <div key={mensaje.id} className="mb-2">
                  <div>
                    <strong>{mensaje.usuario?.name || "Usuario"}:</strong> {mensaje.mensaje}
                  </div>
                  <small>{new Date(mensaje.created_at).toLocaleTimeString()}</small>
                </div>
              ))
            ) : (
              <p>No hay mensajes en esta conversación.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="font-bold text-center text-xl text-gray-600">
          Selecciona un usuario para ver el chat.
        </p>
      )}
    </div>
  );
}
