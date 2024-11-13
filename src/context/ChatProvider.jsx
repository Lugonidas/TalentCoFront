import { useEffect, useState, createContext } from "react";
import Pusher from "pusher-js";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";
import sonidoMensaje from "../assets/sounds/soundMessage.mp3";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingConversacion, setLoadingConversacion] = useState(false);
  const [errores, setErrores] = useState(null);
  const [conversacion, setConversacion] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("AUTH_TOKEN");

      if (!token) {
        return;
      }
      try {
        setLoading(true);
        const response = await clienteAxios.get("/usuarios", {
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
    if (selectedUser) {
      handleCreateConversation(selectedUser.id);
    }
  }, [selectedUser]);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    // Llama a fetchChats con el ID de la conversación correcto
    await handleCreateConversation(user.id);
  };

  const handleCreateConversation = async (userId) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      setLoadingConversacion(true);
      const response = await clienteAxios.post(
        `chat/conversaciones/crear/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    } finally {
      setLoadingConversacion(false);
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

    /*     const newMessage = {
      id: Date.now(), // Genera un ID temporal
      usuario: selectedUser?.name, // Nombre del usuario que envía el mensaje
      mensaje: message,
      created_at: new Date().toISOString(),
    }; */

    // Reproduce el sonido del mensaje
    /*     const audio = new Audio(sonidoMensaje);
    audio.play(); */

    // Actualiza 'conversacion' para añadir el nuevo mensaje
    /*     setConversacion((prevConversacion) => ({
      ...prevConversacion,
      mensajes: [...prevConversacion.mensajes, newMessage], // Añade el nuevo mensaje
    })); */

    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      await clienteAxios.post(
        `/chat/${conversacion.id}/enviar-mensaje`,
        { mensaje: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error enviando el mensaje:", error);
    }
  };

  useEffect(() => {
    if (!conversacion || !selectedUser) return;

    const pusher = new Pusher("a2dd7a88c32a22d60423", {
      cluster: "us2",
      encrypted: true,
    });

    const channel = pusher.subscribe(`chat.${conversacion.id}`);

    channel.bind("MensajeEnviado", (data) => {
      if (data.mensaje && data.usuario) {
        const newMessage = {
          id: data.mensaje.id, // Usa el ID del mensaje recibido
          usuario: data.usuario,
          mensaje: data.mensaje.mensaje, // Asegúrate de que el mensaje venga de la propiedad correcta
          created_at: data.mensaje.created_at, // Usa la fecha que venga desde el servidor
        };

        // Reproduce el sonido del mensaje
        const audio = new Audio(sonidoMensaje);
        audio.play();

        // Solo actualiza 'conversacion' si el mensaje no es del usuario que envía
        if (newMessage.usuario !== selectedUser.name) {
          setConversacion((prevConversacion) => ({
            ...prevConversacion,
            mensajes: [...prevConversacion.mensajes, newMessage],
          }));
        }
      } else {
        console.error("Formato de datos incorrecto:", data);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [conversacion, selectedUser]);

  return (
    <ChatContext.Provider
      value={{
        users,
        chats,
        selectedUser,
        loading,
        loadingConversacion,
        errores,
        handleUserClick,
        handleSendMessage,
        conversacion,
        setConversacion,
        setSelectedUser,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, ChatContext };
export default ChatContext;
