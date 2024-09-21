import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";
import useSWR from "swr";

const fetcher = (url, token) =>
  clienteAxios
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data);

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errores, setErrores] = useState(null);
  const [selectedRol, setSelectedRol] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch cursos
  const token = localStorage.getItem("AUTH_TOKEN");
  const {
    data: usuariosData,
    error: usuariosError,
    mutate: mutateUsuarios,
  } = useSWR(
    token ? ["/usuarios", token] : null, // Pasa la URL y el token correctamente
    ([url, token]) => fetcher(url, token), // Desestructura la clave y pásala al fetcher
    { refreshInterval: 5000 }
  );

  useEffect(() => {
    if (usuariosData) {
      setLoading(true);
      setUsers(usuariosData.usuarios); // Asignas los usuarios obtenidos al estado
    }
    setLoading(false);
  }, [usuariosData]);

  useEffect(() => {
    if (usuariosError) {
      console.error("Error:", usuariosError);
      setErrores(usuariosError);
    }
  }, [usuariosError]);

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
    setErrores({});
  };

  /*   const obtenerUsuarios = async () => {
    try {
      setLoading(true);
      const response = await clienteAxios.get("usuarios");
      setUsers(response.data.usuarios);
    } catch (errores) {
      console.error("Error:", errores);
      setErrores(errores);
    } finally {
      setLoading(false);
    }
  }; */

  const updateProfile = async (id, userData) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      setLoading(true);
      await clienteAxios.put(`/usuarios/perfil/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      /*       setUsers(response.data.usuario); */
      handleUpdateSuccess();
      mutateUsuarios();
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
      setErrores({});
      mutateUsuarios();
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
      mutateUsuarios();
    } catch (errores) {
      console.error("Error:", Object.values(errores.response.data.errors));
      setErrores(errores.response.data.errors);
    }
  };

  const updateUser = async (id, userData) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      setLoading(true);
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
      });
    } catch (errores) {
      console.error("Error:", errores);
      setErrores(errores);
    } finally {
      setLoading(false);
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
        await clienteAxios.delete(`/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire("Eliminado!", "El usuario ha sido eliminado.", "success");
        handleUpdateSuccess();
      }
    } catch (errores) {
      setErrores(errores);
      Swal.fire("Error!", "Hubo un problema al eliminar el usuario.", "error");
    }
  };

  const updatePassword = async (userId, passwordData) => {
    // Obtén el token desde localStorage
    const token = localStorage.getItem("AUTH_TOKEN");

    /*     await clienteAxios.put(`usuarios/${userId}/update-password`, passwordData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); */

    const response = await fetch(
      `http://localhost:8006/api/usuarios/${userId}/update-password`,
      {
        method: "PUT",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Aquí pasas el token
        },
        withCredentials: true,
        body: JSON.stringify(passwordData),
      }
    );

    console.error(response);

    // Verifica la respuesta
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar la contraseña");
    }

    // Si necesitas manejar la respuesta, puedes hacerlo aquí
    return await response.json(); // Devuelve la respuesta en caso de éxito
  };

  /*   useEffect(() => {
    obtenerUsuarios();
  }, []);
 */
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
        updateProfile,
        createUser,
        updateUser,
        deleteUser,
        searchTerm,
        setSearchTerm,
        updatePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
export default UserContext;
