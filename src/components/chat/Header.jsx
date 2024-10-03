import { useAuth } from "../../hooks/useAuth";
import useChat from "../../hooks/useChat";

export default function Header() {
  const { user, error } = useAuth({ middleware: "auth" });
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;

  const { selectedUser } = useChat();

  console.log(selectedUser)

/*   const { name } = user; */

  return (
    <div className="py-2 px-4 shadow-md flex justify-between items-center h-[10vh] bg-indigo-600">
      <div className="flex items-center gap-2">
        <img
          loading="lazy"
          src={`${apiUrl}/storage/${selectedUser?.imagen}`}
          alt={`Foto de perfil de ${selectedUser?.name} ${selectedUser?.apellido}`}
          className="w-12 object-cover"
        />
        <p className="font-bold text-white">{selectedUser.usuario}</p>
      </div>

      {/* Acciones */}
      <div className="flex text-gray-700">
        <i className="text-white border border-dotted p-2 transition-all ease-in-out duration-100 hover:scale-110 hover:cursor-pointer fa-solid fa-phone"></i>
        <i className="text-white border border-dotted p-2 transition-all ease-in-out duration-100 hover:scale-110 hover:cursor-pointer fa-solid fa-video"></i>
        <i className="text-white border border-dotted p-2 transition-all ease-in-out duration-100 hover:scale-110 hover:cursor-pointer fa-solid fa-magnifying-glass"></i>
      </div>
    </div>
  );
}
