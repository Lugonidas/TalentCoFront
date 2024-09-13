import useChat from "../../hooks/useChat";

export default function Sidebar() {
  const { users, selectedUser, handleUserClick } = useChat();

  return (
    <div className="w-1/4 bg-gray-200 p-2 h-screen overflow-hidden overflow-y-scroll">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar un empleado o chat"
          className="w-full p-2 border rounded"
        />
      </div>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => handleUserClick(user.id)}
            className={`mb-4 p-2 rounded cursor-pointer flex gap-2 transition-all ease-in-out duration-200 ${
              selectedUser == user.id ? "bg-blue-100 font-bold" : ""
            }`}
          >
            <img src="/vite.svg" alt="" loading="lazy"/>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
