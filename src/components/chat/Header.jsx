import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useChat from "../../hooks/useChat";

export default function Header() {
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;

  const { selectedUser } = useChat();

  return (
    <div className="py-2 px-4 shadow-md flex justify-between items-center h-[10vh] bg-indigo-600">
      <div className="flex items-center gap-2">
        <img
          loading="lazy"
          src={`${apiUrl}/storage/${selectedUser?.imagen}`}
          alt={`Foto de perfil de ${selectedUser?.name} ${selectedUser?.apellido}`}
          className="w-12 object-cover"
        />
        <div className="flex flex-col">
          <strong className="font-bold text-white capitalize">
            {selectedUser.usuario}
          </strong>
          <span className="text-xs text-white">{selectedUser.rol.nombre}</span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex text-gray-700">
        {/*  <i className="text-white border border-dotted p-2 transition-all ease-in-out duration-100 hover:scale-110 hover:cursor-pointer fa-solid fa-phone"></i> */}
        <Link aria-label="Ir a ver al chat" to="/dashboard/reuniones">
          <i className="text-white border border-dotted p-2 transition-all ease-in-out duration-100 hover:scale-110 hover:cursor-pointer fa-solid fa-video"></i>
        </Link>
        {/*         <i className="text-white border border-dotted p-2 transition-all ease-in-out duration-100 hover:scale-110 hover:cursor-pointer fa-solid fa-magnifying-glass"></i> */}
      </div>
    </div>
  );
}
