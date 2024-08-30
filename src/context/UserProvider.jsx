import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";
import useCourse from "../hooks/useCourse";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { updateCourses } = useCourse();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errores, setErrores] = useState(null);
  const [selectedRol, setSelectedRol] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClickRol = (id) => {
    setSelectedRol(id);
  };

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setCreateModal(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setEditModal(true);
  };

  const handleOpenViewModal = (user) => {
    setSelectedUser(user);
    setViewModal(true);
  };

  const handleCloseModals = () => {
    setCreateModal(false);
    setViewModal(false);
    setEditModal(false);
  };

  const updateUsers = async () => {
    const token = localStorage.getItem("AUTH_TOKEN");

    // Asume que el token debería existir siempre en este punto.
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      const response = await clienteAxios.get("/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.usuarios);
    } catch (error) {
      setErrores(error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (id, userData) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      const response = await clienteAxios.put(
        `/usuarios/perfil/${id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      /*       setUsers(response.data.usuario); */
      handleUpdateSuccess();
      updateCourses();
      setLoading(false);
    } catch (errores) {
      console.error("Error:", errores);
      setErrores(errores);
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    Swal.fire({
      title: "Usuario creado",
      text: "El usuario se ha creado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      handleCloseModals();
      updateUsers();
    });
  };
  const handleUpdateSuccess = () => {
    Swal.fire({
      title: "Usuario actualizado",
      text: "El usuario se ha actualizado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      handleCloseModals();
      updateUsers();
    });
  };

  const createUser = async (userData) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      await clienteAxios.post("/usuarios", userData, {
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

  const updateUser = async (id, userData) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      await clienteAxios.put(`/usuarios/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: "Usuario actualizado",
        text: "El usuario se ha actualizado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        handleCloseModals();
        updateUsers();
      });
    } catch (errores) {
      console.error("Error:", errores);
      setErrores(errores);
    }
  };

  const deleteUser = async (id) => {
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
        const response = await clienteAxios.delete(`/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire("Eliminado!", "El usuario ha sido eliminado.", "success");

        // Actualiza la lista de usuarios después de eliminar
        updateUsers();
      }
    } catch (errores) {
      setErrores(errores);
      Swal.fire("Error!", "Hubo un problema al eliminar el usuario.", "error");
    }
  };

  useEffect(() => {
    updateUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        createModal,
        viewModal,
        editModal,
        selectedUser,
        selectedRol,
        handleOpenCreateModal,
        handleOpenEditModal,
        handleOpenViewModal,
        handleCloseModals,
        handleClickRol,
        errores,
        updateUsers,
        updateProfile,
        createUser,
        updateUser,
        deleteUser,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
export default UserContext;
