import { useContext } from "react";
import UserContext from "../../context/UserProvider";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";

export default function UsersList() {
  const { user: userAuth } = useAuth({ middleware: "auth" });
  

  const {
    handleOpenViewModal,
    deleteUser,
    users,
    selectedRol,
    handleClickRol,
    searchTerm,
    setSearchTerm,
  } = useContext(UserContext);

  const roles = {
    1: "Administrador",
    2: "Estudiante",
    3: "Docente",
  };

  const rolesArray = Object.keys(roles).map((id) => ({
    id: parseInt(id),
    nombre: roles[id],
  }));

  // Filtrado de usuarios
  let filteredUsers = users.filter((user) => user.id !== userAuth.id);

  filteredUsers = filteredUsers.filter((user) => {
    const matchesRol = selectedRol ? user.id_rol === selectedRol : true;
    const matchesSearchTerm = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesRol && matchesSearchTerm;
  });

  return (
    <>
      <div className="flex items-center mb-4 p-2 gap-2 border border-gray-300 rounded">
        <i className="fa-brands fa-searchengin"></i>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full focus:outline-none focus:border-indigo-800"
        />
      </div>
      <div className="flex items-center mb-4 p-2 gap-2 border border-gray-300 rounded">
        {rolesArray.length > 0 && (
          <>
            <strong>Filtros:</strong>
            <ul className="flex flex-wrap gap-1 items-start">
              <button
                onClick={() => handleClickRol(null)}
                className={`py-0.5 px-2 border border-dotted border-indigo-800 transition-all ease-linear hover:cursor-pointer ${
                  selectedRol === null
                    ? "bg-indigo-800 text-white"
                    : "hover:bg-indigo-800 hover:text-white"
                }`}
              >
                Mostrar Todos
              </button>
              {rolesArray.map((rol) => (
                <button
                  key={rol.id}
                  onClick={() => handleClickRol(rol.id)}
                  className={`py-0.5 px-2 border border-dotted border-indigo-800 transition-all ease-linear hover:cursor-pointer ${
                    selectedRol === rol.id
                      ? "bg-indigo-800 text-white"
                      : "hover:bg-indigo-800 hover:text-white"
                  }`}
                >
                  {rol.nombre}
                </button>
              ))}
            </ul>
          </>
        )}
      </div>
      <ul className="space-y-4 grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        {filteredUsers.map((user) => (
          <li
            onClick={() => handleOpenViewModal(user)}
            key={user.id}
            className="bg-white shadow-md rounded-md p-4 relative flex items-start transition ease-linear hover:cursor-pointer hover:-translate-y-1"
          >
            <img
              src={`/storage/${user?.imagen}`}
              alt={`Imagen de ${user?.usuario}`}
              className="w-24 h-24 object-cover"
            />
            <div>
              <h3 className="text-lg font-bold text-indigo-800 capitalize">
                {user.name} {user.apellido}
              </h3>
              <p className="text-xs capitalize">{user.usuario}</p>
              <strong className="text-xs text-gray-500">{user.email}</strong>
              <p className="font-bold text-gray-600 text-xs uppercase absolute bottom-1 right-2">
                {user && user.id_rol === 1 && <span>Administrador</span>}
                {user && user.id_rol === 2 && <span>Estudiante</span>}
                {user && user.id_rol === 3 && <span>Docente</span>}
              </p>
              <div className="py-2">
                {userAuth && userAuth.id_rol === 1 && (
                  <>
                    {/* <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteUser(user.id)}
                    >
                      <i className="fa-solid fa-trash bg-red-600 text-white p-2"></i>
                    </motion.button> */}
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
