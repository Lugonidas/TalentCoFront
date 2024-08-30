import { useEffect, useState, createContext } from "react";
import Pusher from "pusher-js";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState({});
  const [loading, setLoading] = useState(true);
  const [errores, setErrores] = useState(null);
  const [conversacion, setConversacion] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("AUTH_TOKEN");

      if (!token) {
        return;
      }
      try {
        const response = await clienteAxios.get("/chat/usuarios-cursos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.usuarios);
      } catch (error) {
        setErrores(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!conversacion || !selectedUser) return;

    const pusher = new Pusher("a2dd7a88c32a22d60423", {
      cluster: "us2",
    });

    const channel = pusher.subscribe(`chat.${conversacion.id}`);

    
    console.log(channel)
    channel.bind("MensajeEnviado", (data) => {
      console.log("Mensaje recibido:", data); // Verifica los datos del mensaje
      setChats((prevChats) => {
        const { usuario, mensaje } = data.mensaje;
        const newMessage = {
          time: new Date(mensaje.created_at).toLocaleTimeString(),
          user: usuario.name,
          message: mensaje.mensaje,
        };

        return {
          ...prevChats,
          [conversacion.id]: [
            ...(prevChats[conversacion.id] || []),
            newMessage,
          ],
        };
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [conversacion, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      handleCreateConversation(selectedUser);
    }
  }, [selectedUser]);

  const handleUserClick = async (userId) => {
    setSelectedUser(userId);
    // Llama a fetchChats con el ID de la conversación correcto
    await handleCreateConversation(userId);
  };

  const handleCreateConversation = async (userId) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      const response = await clienteAxios.post(
        `chat/conversaciones/crear/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Asegúrate de usar el ID de la conversación creado
      const idConversacion = response.data.conversacion.id;
      setConversacion(response.data.conversacion);
      fetchChats(idConversacion);
    } catch (error) {
      console.error("Error obteniendo o creando conversación:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al obtener o crear la conversación.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const fetchChats = async (idConversacion) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const response = await clienteAxios.get(`/chat/${idConversacion}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mensajes = response.data.conversacion.mensajes.map((mensaje) => ({
        time: new Date(mensaje.created_at).toLocaleTimeString(),
        user: mensaje.usuario.name,
        message: mensaje.mensaje,
      }));

      setChats((prevChats) => ({
        ...prevChats,
        [idConversacion]: mensajes,
      }));
    } catch (error) {
      console.error("Error obteniendo el chat", error);
    }
  };

  const handleSendMessage = async (message) => {
    if (!selectedUser || !conversacion) return;

    const newMessage = {
      time: new Date().toLocaleTimeString(),
      user: "You", // Ajusta según sea necesario
      message: message,
    };

    setChats((prevChats) => {
      const updatedChats = {
        ...prevChats,
        [conversacion.id]: [...(prevChats[conversacion.id] || []), newMessage],
      };
      return updatedChats;
    });

    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      await clienteAxios.post(
        `/chat/${conversacion.id}/enviar-mensaje`,
        { mensaje: message }, // Enviar el mensaje en el formato correcto
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error enviando el mensaje:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        users,
        chats,
        selectedUser,
        loading,
        errores,
        handleUserClick,
        handleSendMessage,
        conversacion,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, ChatContext };
export default ChatContext;
