import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { user, error } = useAuth({ middleware: "auth" });

  const { name } = user;


  return (
    <div className="py-2 px-4 shadow-md flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src="/vite.svg" alt="Imagen Usuario" />
        <p className="font-bold text-gray-600">{name}</p>
      </div>

      {/* Acciones */}
      <div className="flex text-gray-700">
        <i className="text-indigo-800 border border-dotted p-2 transition-all ease-in-out duration-100 hover:scale-110 hover:cursor-pointer fa-solid fa-phone"></i>
        <i className="text-indigo-800 border border-dotted p-2 transition-all ease-in-out duration-100 hover:scale-110 hover:cursor-pointer fa-solid fa-video"></i>
        <i className="text-indigo-800 border border-dotted p-2 transition-all ease-in-out duration-100 hover:scale-110 hover:cursor-pointer fa-solid fa-magnifying-glass"></i>
      </div>

    </div>
  )
}
