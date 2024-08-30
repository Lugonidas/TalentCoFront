import { createContext, useState } from "react";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";
import useCourse from "../hooks/useCourse";
import useLeccion from "../hooks/useLeccion";

const ArchivoContext = createContext();

const ArchivoProvider = ({ children }) => {
  const [archivos, setArchivos] = useState([]);
  const [progreso, setProgreso] = useState(0);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedArchivo, setSelectedArchivo] = useState(null);
  const [errores, setErrores] = useState(null);
  const [visto, setVisto] = useState(false);

  const { setSelectedLeccion, selectedLeccion } = useLeccion();

  const handleOpenCreateModal = () => {
    setSelectedArchivo(null);
    setCreateModal(true);
  };

  const handleOpenEditModal = (archivo) => {
    setSelectedArchivo(archivo);
    setEditModal(true);
  };

  const handleOpenViewModal = (archivo) => {
    setSelectedArchivo(archivo);
    setViewModal(true);
  };

  const handleCloseModals = () => {
    setCreateModal(false);
    setViewModal(false);
    setEditModal(false);
  };

  const handleCreateSuccess = () => {
    Swal.fire({
      title: "Archivo creado",
      text: "El archivo se ha creado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      handleCloseModals();
    });
  };

  const createArchivo = async (archivoData) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const response = await clienteAxios.post(
        "/archivo-leccion/",
        archivoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedLeccion(response.data.leccion);
      handleCreateSuccess();
      setErrores({});
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(errores.response.data.errors);
    }
  };

  const verificarArchivoVisto = async (userId, archivoId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const response = await clienteAxios.get(
        `/archivos/${userId}/${archivoId}/visto`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVisto(response.data.hasViewed); // Devuelve true o false según si el archivo ha sido visto
    } catch (error) {
      console.error("Error:", error);
      setErrores(error);
      return false; // Devuelve false en caso de error
    }
  };

  const deleteArchivo = async (id) => {
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
        const response = await clienteAxios.delete(`/archivo-leccion/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSelectedLeccion(response.data.leccion);
        Swal.fire("Eliminado!", "El archivo ha sido eliminado.", "success");
        setErrores({});
      }
    } catch (error) {
      setErrores(error);
      Swal.fire("Error!", "Hubo un problema al eliminar el archivo.", "error");
    }
  };

  const archivoVisto = async (archivoId) => {
    if (!visto) {
      const token = localStorage.getItem("AUTH_TOKEN");
      try {
        const response = await clienteAxios.post(
          `/archivos/${archivoId}/visto`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          title: "Documento Visto",
          text: "El documento ha sido visto correctamente.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (errores) {
        console.error("Error:", Object.values(errores.response));
        setErrores(errores.response);
      }
    }
  };

  const obtenerProgresoLeccion = async (leccionId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      setLoading(true);
      const response = await clienteAxios.get(
        `/lecciones/${leccionId}/progreso`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProgreso(response.data.progreso);
    } catch (error) {
      console.error("Error:", error);
      setErrores(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ArchivoContext.Provider
      value={{
        archivos,
        loading,
        createModal,
        viewModal,
        editModal,
        selectedArchivo,
        handleOpenCreateModal,
        handleOpenEditModal,
        handleOpenViewModal,
        handleCloseModals,
        errores,
        createArchivo,
        deleteArchivo,
        archivoVisto,
        obtenerProgresoLeccion,
        verificarArchivoVisto,
        progreso,
        visto,
        /*         updateLeccion,
        getLeccionById,
        getArchivosLeccionById,
        updateLecciones, */
      }}
    >
      {children}
    </ArchivoContext.Provider>
  );
};

export { ArchivoProvider, ArchivoContext };
export default ArchivoContext;
