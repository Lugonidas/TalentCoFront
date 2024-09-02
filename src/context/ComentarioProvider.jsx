import { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";
import useCourse from "../hooks/useCourse";

const ComentarioContext = createContext();

const ComentarioProvider = ({ children }) => {
  const [comentarios, setComentarios] = useState([]);
  const [haComentado, setHaComentado] = useState(false);
  const [errores, setErrores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedComentario, setSelectedComentario] = useState(null);

  const { selectedCourse } = useCourse();

  const handleOpenCreateModal = () => {
    setSelectedComentario(null);
    setCreateModal(true);
  };

  const handleOpenEditModal = (comentario) => {
    setSelectedComentario(comentario);
    setEditModal(true);
  };

  const handleOpenViewModal = (comentario) => {
    setSelectedComentario(comentario);
    setViewModal(true);
  };

  const handleCloseModals = () => {
    setCreateModal(false);
    setViewModal(false);
    setEditModal(false);
    setErrores({});
  };

  const handleCreateSuccess = () => {
    Swal.fire({
      title: "Comentario creado",
      text: "El comentario se ha creado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      handleCloseModals();
    });
  };

  const handleUpdateSuccess = () => {
    Swal.fire({
      title: "Comentario actualizado",
      text: "El comentario se ha actualizado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      handleCloseModals();
    });
  };

  const createComentario = async (comentarioData) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      setLoading(true);
      // Realiza la solicitud POST para crear un nuevo comentario
      const response = await clienteAxios.post(
        "/comentarios/",
        comentarioData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Maneja el éxito de la creación
      handleCreateSuccess();

      // Limpia los errores si existen
      setErrores({});

      // Actualiza el estado con el nuevo comentario
      setComentarios((prevComentarios) => [
        ...prevComentarios,
        response.data.comentario, // Asegúrate de acceder a la propiedad correcta
      ]);
      setHaComentado(true);
    } catch (error) {
      console.error("Error:", Object.values(error.response.data.errors));
      setErrores(Object.values(error.response.data.errors));
    } finally {
      setLoading(false);
    }
  };
  

  /* Actualizar comentario */
  const updateComentario = async (id, comentarioData) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      setLoading(true);
      // Realiza la solicitud PUT para actualizar el comentario
      const response = await clienteAxios.put(
        `/comentarios/${id}`,
        comentarioData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Maneja el éxito de la actualización
      handleUpdateSuccess();

      // Actualiza el estado con la respuesta correcta
      setComentarios((prevComentarios) =>
        prevComentarios.map((comentario) =>
          comentario.id == id ? response.data.comentario : comentario
        )
      );

      // Limpia los errores si existen
      setErrores({});
    } catch (error) {
      console.error("Error al actualizar el comentario:", error);
      if (error.response && error.response.status == 422) {
        setErrores(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      setComentarios(selectedCourse.comentarios);
    }
  }, [selectedCourse]);

  return (
    <ComentarioContext.Provider
      value={{
        loading,
        comentarios,
        createModal,
        viewModal,
        editModal,
        selectedComentario,
        handleOpenCreateModal,
        handleOpenEditModal,
        handleOpenViewModal,
        handleCloseModals,
        createComentario,
        updateComentario,
        haComentado,
        setHaComentado,
      }}
    >
      {children}
    </ComentarioContext.Provider>
  );
};

export { ComentarioProvider, ComentarioContext };
export default ComentarioContext;
