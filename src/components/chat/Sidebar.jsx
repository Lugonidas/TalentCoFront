import { useAuth } from "../../hooks/useAuth";
import useChat from "../../hooks/useChat";
import Loader from "../../components/Loader";

export default function Sidebar() {
  const { user: authUser } = useAuth({ middleware: "auth" });

  const {
    users,
    selectedUser,
    handleUserClick,
    searchTerm,
    setSearchTerm,
    loading,
  } = useChat();

  if (loading) {
    return <Loader />;
  }

  // Normalizamos el término de búsqueda para hacer comparaciones insensibles a mayúsculas/minúsculas
  const filteredUsers = users
    .filter((user) => user.id !== authUser.id) // Excluir al usuario autenticado
    .filter(
      (user) => user.usuario.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrar por nombre de usuario
    );

  return (
    <div className="w-full lg:w-2/3 bg-gray-200 p-2 h-screen overflow-hidden overflow-y-scroll">
      <h1 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
        Chat
      </h1>
      <div className="flex items-center mb-4 gap-2 border border-gray-300 rounded p-2">
        <i className="fa-brands fa-searchengin" aria-hidden="true"></i>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full focus:outline-none focus:border-indigo-800 bg-transparent"
          aria-label="Buscar usuario"
        />
      </div>
      <ul className="lg:grid lg:grid-cols-2 gap-2">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            onClick={() => handleUserClick(user)}
            className={`shadow mb-4 p-2 rounded cursor-pointer flex gap-2 transition-all ease-in-out duration-200 ${
              selectedUser && Number(selectedUser.id) === Number(user.id)
                ? "bg-blue-100 font-bold"
                : ""
            }`}
          >
            <div className="flex flex-col">
              <strong className="capitalize">{user.usuario}</strong>
              <span className="text-xs">{user.rol.nombre}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
