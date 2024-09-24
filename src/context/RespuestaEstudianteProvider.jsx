import { createContext, useState } from "react";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";

const RespuestaEstudianteContext = createContext();

const RespuestaEstudianteProvider = ({ children }) => {
  /*   const { getCourseById, selectedCourse } = useCourse();
  const [lecciones, setLecciones] = useState([]); */
  /*   const [tareas, setTareas] = useState([]); */
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedTarea, setSelectedRespuesta] = useState(null);
  const [tareas, setTareas] = useState(null);
  const [errores, setErrores] = useState(null);

  const handleOpenCreateModal = () => {
    setSelectedRespuesta(null);
    setCreateModal(true);
  };

  const handleOpenEditModal = (leccion) => {
    setSelectedRespuesta(leccion);
    setEditModal(true);
  };

  const handleOpenViewModal = (tarea) => {
    setSelectedRespuesta(tarea);
    setViewModal(true);
  };

  const handleCloseModals = () => {
    setCreateModal(false);
    setViewModal(false);
    setEditModal(false);
    setErrores({});
  };

  const getTareasByCurso = async (cursoId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      setLoading(true);
      const response = await clienteAxios.get(`/tareas/curso/${cursoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setTareas(response.data.tareas);
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(Object.values(errores.response.data.errors));
    } finally {
      setLoading(false);
    }
  };

  /*   const getLeccionById = async (leccionId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const response = await clienteAxios.get(`/lecciones/${leccionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedTarea(response.data.leccion);
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(Object.values(errores.response.data.errors));
    }
  }; */

  const handleCreateSuccess = () => {
    Swal.fire({
      title: "Respuesta enviada",
      text: "La respuesta se ha enviado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      handleCloseModals();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };

  const createRespuestaEstudiante = async (respuestaData) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      const response = await clienteAxios.post("respuestas", respuestaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleCreateSuccess();
      setErrores({});
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(errores.response.data.errors);
    }
  };

  const updateTarea = async (id, tareaData) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      await clienteAxios.patch(`/tareas/${id}`, tareaData, {
        headers: {
          "Content-Type": "application/json",
          /* "Content-Type": "multipart/form-data", */
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: "Tarea actualizada",
        text: "La tarea se ha actualizado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        handleCloseModals();
        /*         updateLecciones(selectedTarea.id_curso); */
      });
    } catch (error) {
      console.error("Error:", error);
      setErrores(error);
    }
  };

  /*   const updateTarea = async (tareaId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      setLoading(true);
      const response = await clienteAxios.put(`/tareas/${tareaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleCreateSuccess()
    } catch (error) {
      console.error("Error:", error);
      setErrores(error);
    } finally {
      setLoading(false);
    }
  }; */

  /* const deleteLeccion = async (id) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await clienteAxios.delete(`/lecciones/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire("Eliminado!", "La lección ha sido eliminado.", "success");

        // Actualiza la lista de usuarios después de eliminar
        updateLecciones(selectedCourse.id);
      }
    } catch (error) {
      setErrores(error);
      Swal.fire("Error!", "Hubo un problema al eliminar el usuario.", "error");
    }
  }; */

  /*   useEffect(() => {
    updateLecciones();
  }, [cursoId]); */

  return (
    <RespuestaEstudianteContext.Provider
      value={{
        getTareasByCurso,
        createModal,
        viewModal,
        editModal,
        selectedTarea,
        setSelectedRespuesta,
        handleOpenCreateModal,
        handleOpenEditModal,
        handleOpenViewModal,
        handleCloseModals,
        errores,
        createRespuestaEstudiante,
        tareas,
        loading,
        updateTarea,
        /*         updateLeccion,
        deleteLeccion,
        getLeccionById,
        getArchivosLeccionById,
        registrarArchivoVisto */
      }}
    >
      {children}
    </RespuestaEstudianteContext.Provider>
  );
};

export { RespuestaEstudianteProvider, RespuestaEstudianteContext };
export default RespuestaEstudianteContext;
