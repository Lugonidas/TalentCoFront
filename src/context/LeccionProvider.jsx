import { createContext, useState } from "react";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";
import useCourse from "../hooks/useCourse";

const LeccionContext = createContext();

const LeccionProvider = ({ children }) => {
  const { getCourseById, selectedCourse } = useCourse();
  const [lecciones, setLecciones] = useState([]);
  const [loadingLecciones, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedLeccion, setSelectedLeccion] = useState(null);
  const [errores, setErrores] = useState(null);

  const handleOpenCreateModal = () => {
    setSelectedLeccion(null);
    setCreateModal(true);
  };

  const handleOpenEditModal = (leccion) => {
    setSelectedLeccion(leccion);
    setEditModal(true);
  };

  const handleOpenViewModal = (leccion) => {
    setSelectedLeccion(leccion);
    setViewModal(true);
  };

  const handleCloseModals = () => {
    setCreateModal(false);
    setViewModal(false);
    setEditModal(false);
  };

  const getArchivosLeccionById = async (leccionId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const response = await clienteAxios.get(`/lecciones/${leccionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedLeccion(response.data.leccion);
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(Object.values(errores.response.data.errors));
    }
  };

  const getLeccionById = async (leccionId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const response = await clienteAxios.get(`/lecciones/${leccionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedLeccion(response.data.leccion);
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(Object.values(errores.response.data.errors));
    }
  };

  const updateLecciones = async (cursoId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      setLoading(true);
      const response = await clienteAxios.get(`/lecciones/curso/${cursoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLecciones(response.data.lecciones);
    } catch (error) {
      console.error("Error:", error);
      setErrores(error);
    }finally{
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    Swal.fire({
      title: "Lección creada",
      text: "La lección se ha creado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      handleCloseModals();
    });
  };

  const createLeccion = async (leccionData) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      await clienteAxios.post("/lecciones", leccionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getCourseById(leccionData.get("id_curso"));
      handleCreateSuccess();
      updateLecciones(leccionData.get("id_curso"));
      setErrores({});
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(errores.response.data.errors);
    }
  };

  const updateLeccion = async (id, leccionData) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      await clienteAxios.put(`/lecciones/${id}`, leccionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: "Lección actualizada",
        text: "La lección se ha actualizado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        handleCloseModals();
        updateLecciones(selectedLeccion.id_curso);
      });
    } catch (error) {
      console.error("Error:", error);
      setErrores(error);
    }
  };

  const deleteLeccion = async (id) => {
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
  };

  // Función para registrar que un archivo ha sido visto
  const registrarArchivoVisto = async (idArchivo) => {
    try {
      await clienteAxios.post(`/archivos/${idArchivo}/visto`);
      ("Archivo registrado como visto");
    } catch (error) {
      console.error("Error al registrar archivo como visto:", error);
    }
  };

  /*   useEffect(() => {
    updateLecciones();
  }, [cursoId]); */

  return (
    <LeccionContext.Provider
      value={{
        lecciones,
        loadingLecciones,
        createModal,
        viewModal,
        editModal,
        selectedLeccion,
        setSelectedLeccion,
        handleOpenCreateModal,
        handleOpenEditModal,
        handleOpenViewModal,
        handleCloseModals,
        errores,
        createLeccion,
        updateLeccion,
        deleteLeccion,
        getLeccionById,
        getArchivosLeccionById,
        updateLecciones,
        registrarArchivoVisto
      }}
    >
      {children}
    </LeccionContext.Provider>
  );
};

export { LeccionProvider, LeccionContext };
export default LeccionContext;
