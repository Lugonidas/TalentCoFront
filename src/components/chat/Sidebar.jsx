import useChat from "../../hooks/useChat";

export default function Sidebar() {
  const { users, selectedUser, handleUserClick } = useChat();

  return (
    <div className="w-full bg-gray-200 p-2 h-screen overflow-hidden overflow-y-scroll">
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
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => handleUserClick(user.id)}
            className={`mb-4 p-2 rounded cursor-pointer flex gap-2 transition-all ease-in-out duration-200 ${
              Number(selectedUser) == Number(user.id)
                ? "bg-blue-100 font-bold"
                : ""
            }`}
          >
            <img src="/vite.svg" alt="" loading="lazy" />
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
