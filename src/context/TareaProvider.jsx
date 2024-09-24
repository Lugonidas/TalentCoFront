import { createContext, useState } from "react";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";

const TareaContext = createContext();

const TareaProvider = ({ children }) => {
  /*   const { getCourseById, selectedCourse } = useCourse();
  const [lecciones, setLecciones] = useState([]); */
  /*   const [tareas, setTareas] = useState([]); */
  const [loading, setLoading] = useState(true);
  const [createModalTarea, setCreateModalTarea] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [tareas, setTareas] = useState(null);
  const [errores, setErrores] = useState(null);

  const handleOpenCreateModalTarea = () => {
    setSelectedTarea(null);
    setCreateModalTarea(true);
  };

  const handleOpenEditModal = (leccion) => {
    setSelectedTarea(leccion);
    setEditModal(true);
  };

  const handleOpenViewModal = async (tarea) => {
    setLoading(true); // Opcional: puedes manejar el loading aquí si es necesario
    try {
      await getTareaById(tarea.id); // Espera a que se complete la consulta
      setViewModal(true); // Abre el modal solo después de recibir la tarea
    } catch (error) {
      console.error("Error al obtener la tarea:", error);
    } finally {
      setLoading(false); // Opcional: restablece el loading
    }
  };

  const handleCloseModals = () => {
    setCreateModalTarea(false);
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
      setTareas(response.data.tareas);
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(Object.values(errores.response.data.errors));
    } finally {
      setLoading(false);
    }
  };

  const getTareaById = async (tareaId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      setLoading(true);
      const response = await clienteAxios.get(`/tareas/${tareaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedTarea(response.data.tarea);
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

  const handleUpdateSuccess = () => {
    Swal.fire({
      title: "Actualizado",
      text: "La nota se ha actualizado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      handleCloseModals();
    });
  };

  const handleCreateNotaSuccess = () => {
    Swal.fire({
      title: "Nota asignada",
      text: "La nota se ha asignado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      handleCloseModals();
    });
  };

  const handleCreateSuccess = () => {
    Swal.fire({
      title: "Tarea creada",
      text: "La tarea se ha creado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      handleCloseModals();
    });
  };

  const createTarea = async (tareaData) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      await clienteAxios.post("/tareas", tareaData, {
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

  const updateTarea = async (id, tareaData, cursoId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const response = await clienteAxios.put(`/tareas/${id}`, tareaData, {
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
        getTareasByCurso(cursoId)
        handleCloseModals();
        /*         updateLecciones(selectedTarea.id_curso); */
      });
    } catch (error) {
      console.error("Error:", error);
      setErrores(error);
    }
  };

  const createNota = async (notaData) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      await clienteAxios.post("/notas", notaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleCreateNotaSuccess();
      setErrores({});
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(errores.response.data.errors);
    }
  };

  const updateNota = async (notaData) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      await clienteAxios.put(`notas/actualizar`, notaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleUpdateSuccess();
      setErrores({});
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(errores.response.data.errors);
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
    <TareaContext.Provider
      value={{
        getTareasByCurso,
        createNota,
        updateNota,
        createModalTarea,
        viewModal,
        editModal,
        selectedTarea,
        setSelectedTarea,
        handleOpenCreateModalTarea,
        handleOpenEditModal,
        handleOpenViewModal,
        handleCloseModals,
        errores,
        createTarea,
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
    </TareaContext.Provider>
  );
};

export { TareaProvider, TareaContext };
export default TareaContext;
