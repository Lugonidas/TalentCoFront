import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";
import useSWR from "swr";

const fetcher = (url, token) =>
  clienteAxios
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data);

const CourseContext = createContext();

const CourseProvider = ({ children }) => {
  const [progreso, setProgreso] = useState(0);
  const [cursos, setCursos] = useState([]);
  const [misCursos, setMisCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [errores, setErrores] = useState(null);
  const [categoriasCursos, setCategoriasCursos] = useState([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("AUTH_TOKEN");

  // Fetch cursos
  const {
    data: cursosData,
    error: cursosError,
    mutate: mutateCursos,
  } = useSWR(`/cursos`, fetcher, { refreshInterval: 5000 });

/*   // Fetch categorías
  const { data: categoriasData, error: categoriasError } = useSWR(
    token ? `/categorias?token=${token}` : null,
    fetcher
  );
 */
  useEffect(() => {
    if (cursosData) {
      const categoriasSet = new Set(
        cursosData.cursos.map((curso) => curso.categoria.id)
      );
      const categoriasArray = Array.from(categoriasSet).map(
        (id) =>
          cursosData.cursos.find((curso) => curso.categoria.id == id).categoria
      );
      setCategoriasCursos(categoriasArray);
      setCategoriasDisponibles(categoriasArray);
    }
  }, [cursosData]);

  useEffect(() => {
    if (cursosError) {
      console.error("Error:", cursosError);
      setErrores(cursosError);
    }
  }, [cursosError]);

  const handleClickCategoria = (id) => {
    setSelectedCategoria(id);
  };

  const handleOpenCreateModal = () => {
    setSelectedCourse(null);
    setCreateModal(true);
  };

  const handleOpenEditModal = (course) => {
    setSelectedCourse(course);
    setEditModal(true);
  };

  const handleOpenViewModal = (course) => {
    setSelectedCourse(course);
    setViewModal(true);
  };

  const handleCloseModals = () => {
    setCreateModal(false);
    setViewModal(false);
    setEditModal(false);
    setErrores({});
  };

  const updateCourses = async () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      setLoading(true);
      const response = await clienteAxios.get("cursos", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCursos(response.data.cursos);

      const categoriasSet = new Set(
        response.data.cursos.map((curso) => curso.categoria.id)
      );
      const categoriasArray = Array.from(categoriasSet).map(
        (id) =>
          response.data.cursos.find((curso) => curso.categoria.id == id)
            .categoria
      );

      setCategoriasCursos(categoriasArray);
    } catch (errores) {
      console.error("Error:", errores);
      setErrores(errores);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await clienteAxios.get("categorias");
      setCategoriasDisponibles(response.data.categorias);
    } catch (errores) {
      console.error("Error:", errores);
      setErrores(errores);
    }
  };

  const handleCreateSuccess = () => {
    Swal.fire({
      title: "Curso creado",
      text: "El curso se ha creado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      handleCloseModals();
      updateCourses();
    });
  };

  const handleUpdateSuccess = () => {
    Swal.fire({
      title: "Curso actualizado",
      text: "El curso se ha actualizado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      handleCloseModals();
      updateCourses();
    });
  };

  const createCourse = async (courseData) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      await clienteAxios.post("cursos", courseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleCreateSuccess();
      setErrores({});
      mutateCursos();
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(errores.response.data.errors);
    }
  };

  const updateCourse = async (id, courseData) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      const response = await clienteAxios.put(`/cursos/${id}`, courseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleUpdateSuccess();
      obtenerMisCursos(response.data.curso.id_docente, "docente");
      /*       obtenerMisCursos(user.id, user.id_rol === 1 || user.id_rol === 3 ? "docente" : "estudiante"); */
      setErrores({});
      mutateCursos();
    } catch (errores) {
      if (errores.response && errores.response.status == 422) {
        console.error("Error:", Object.values(errores.response.data.errors));
        setErrores(errores.response.data.errors);
      } else {
        console.error("Error al actualizar el curso:", errores);
      }
      throw errores;
    }
  };

  const deleteCourse = async (id) => {
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
        await clienteAxios.delete(`cursos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire("Eliminado!", "El curso ha sido eliminado.", "success");

        // Actualiza la lista de cursos después de eliminar
        updateCourses();
        mutateCursos();
      }
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(Object.values(errores.response.data.errors));
    }
  };

  const getCourseById = async (courseId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      setLoading(true);
      const response = await clienteAxios.get(`/cursos/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedCourse(response.data.curso);
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(Object.values(errores.response.data.errors));
    } finally {
      setLoading(false);
    }
  };

  const obtenerMisCursos = async (userId, tipoUsuario) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    if (!token) {
      return;
    }

    try {
      const response = await clienteAxios.get(
        `/cursos/${tipoUsuario}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMisCursos(response.data.cursos);
      setLoading(false);
      mutateCursos();
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const obtenerProgresoCurso = async (cursoId) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const response = await clienteAxios.get(`/cursos/${cursoId}/progreso`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProgreso(response.data.progreso);
      /* setLoading(false); */
    } catch (error) {
      console.error("Error:", error);
      setErrores(error);
      /* setLoading(false); */
    }
  };

  useEffect(() => {
    updateCourses();
    fetchCategorias();
  }, []);

  return (
    <CourseContext.Provider
      value={{
        obtenerMisCursos,
        cursos,
        setCursos,
        loading,
        createModal,
        viewModal,
        editModal,
        selectedCourse,
        handleOpenCreateModal,
        handleOpenEditModal,
        handleOpenViewModal,
        handleCloseModals,
        handleClickCategoria,
        categoriasCursos,
        categoriasDisponibles,
        selectedCategoria,
        searchTerm,
        setSearchTerm,
        setSelectedCourse,
        errores,
        updateCourses,
        handleCreateSuccess,
        createCourse,
        updateCourse,
        deleteCourse,
        getCourseById,
        misCursos,
        cursosData,
        progreso,
        obtenerProgresoCurso,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export { CourseProvider, CourseContext };
export default CourseContext;
