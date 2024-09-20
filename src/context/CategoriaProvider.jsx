import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";
/* import useSWR from "swr"; */

/* const fetcher = (url, token) =>
  clienteAxios
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data);
 */
const CategoriaContext = createContext();

const CategoriaProvider = ({ children }) => {
  const [lecciones, setLecciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [errores, setErrores] = useState(null);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenCreateModal = () => {
    setSelectedCategoria(null);
    setCreateModal(true);
  };

  const handleOpenEditModal = (categoria) => {
    setSelectedCategoria(categoria);
    setEditModal(true);
  };

  const handleOpenViewModal = (leccion) => {
    setSelectedCategoria(leccion);
    setViewModal(true);
  };

  const handleCloseModals = () => {
    setCreateModal(false);
    setViewModal(false);
    setEditModal(false);
    setErrores({});
  };

  const getArchivosLeccionById = async (leccionId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const response = await clienteAxios.get(`/categorias/${leccionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedCategoria(response.data.leccion);
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(Object.values(errores.response.data.errors));
    }
  };

  const obtenerCategorias = async () => {
    try {
      setLoading(true);
      const response = await clienteAxios.get("categorias");
      setCategorias(response.data.categorias);
    } catch (errores) {
      console.error("Error:", errores);
      setErrores(errores);
    } finally {
      setLoading(false);
    }
  };

  const getLeccionById = async (leccionId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const response = await clienteAxios.get(`/categorias/${leccionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedCategoria(response.data.leccion);
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(Object.values(errores.response.data.errors));
    }
  };

  const updateLecciones = async (cursoId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      setLoading(true);
      const response = await clienteAxios.get(`/categorias/curso/${cursoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLecciones(response.data.lecciones);
    } catch (error) {
      console.error("Error:", error);
      setErrores(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    Swal.fire({
      title: "Categoria creada",
      text: "La categoria se ha creado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      handleCloseModals();
    });
  };

  const createCategoria = async (categoriaData) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      setLoadingCreate(true);
      await clienteAxios.post("/categorias", categoriaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleCreateSuccess();
      obtenerCategorias();
      setErrores({});
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(errores.response.data.errors);
    } finally {
      setLoadingCreate(false);
    }
  };

  const updateCategoria = async (id, categoriaData) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      await clienteAxios.put(`/categorias/${id}`, categoriaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: "Categoria actualizada",
        text: "La categoria se ha actualizado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        handleCloseModals();
        obtenerCategorias();
      });
    } catch (error) {
      console.error("Error:", error);
      setErrores(error);
    }
  };

  /*   const deleteLeccion = async (id) => {
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
        await clienteAxios.delete(`/categorias/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire("Eliminado!", "La categoria ha sido eliminado.", "success");

        // Actualiza la lista de usuarios después de eliminar
        updateLecciones(selectedCourse.id);
      }
    } catch (error) {
      setErrores(error);
      Swal.fire("Error!", "Hubo un problema al eliminar el usuario.", "error");
    }
  }; */

  // Función para registrar que un archivo ha sido visto
  const registrarArchivoVisto = async (idArchivo) => {
    try {
      await clienteAxios.post(`/archivos/${idArchivo}/visto`);
      ("Archivo registrado como visto");
    } catch (error) {
      console.error("Error al registrar archivo como visto:", error);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  useEffect(() => {
    setFilteredCategorias(
      categorias.filter((categoria) =>
        categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, categorias]);

  return (
    <CategoriaContext.Provider
      value={{
        lecciones,
        createModal,
        viewModal,
        editModal,
        selectedCategoria,
        setSelectedCategoria,
        handleOpenCreateModal,
        handleOpenEditModal,
        handleOpenViewModal,
        handleCloseModals,
        errores,
        createCategoria,
        updateCategoria,
        getLeccionById,
        getArchivosLeccionById,
        updateLecciones,
        registrarArchivoVisto,
        obtenerCategorias,
        categorias: filteredCategorias,
        loading,
        loadingCreate,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </CategoriaContext.Provider>
  );
};

export { CategoriaProvider, CategoriaContext };
export default CategoriaContext;
