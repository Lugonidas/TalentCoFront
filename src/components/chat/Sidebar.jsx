import { useAuth } from "../../hooks/useAuth";
import useChat from "../../hooks/useChat";

export default function Sidebar() {
  const { user: authUser } = useAuth({ middleware: "auth" });

  const { users, selectedUser, handleUserClick } = useChat();

  return (
    <div className="w-full lg:w-2/3 bg-gray-200 p-2 h-screen overflow-hidden overflow-y-scroll">
      <h1 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
        Chat
      </h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar un usuario"
          className="w-full p-2 border rounded"
        />
      </div>
      <ul className="lg:grid lg:grid-cols-2 gap-2">
        {users
          .filter((user) => user.id !== authUser.id) // Filtrar usuarios excluyendo al autenticado
          .map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserClick(user)}
              className={`shadow mb-4 p-2 rounded cursor-pointer flex gap-2 transition-all ease-in-out duration-200 ${ selectedUser &&
                Number(selectedUser.id) == Number(user.id)
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
