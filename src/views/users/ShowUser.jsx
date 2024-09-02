import { useContext } from "react";
import UserContext from "../../context/UserProvider";

export default function ShowUser() {

  const { selectedUser, handleCloseModals } = useContext(UserContext);
  const apiUrl = import.meta.env.VITE_API_URL;


  return (
    <div>

      <div className="flex items-center h-screen w-full justify-center">

        <div className="max-w-xl">
          <div className="bg-white shadow-xl rounded-lg py-3">
            <div className="photo-wrapper p-2">
              <img className="w-32 h-32 rounded-full mx-auto object-cover" src={`/storage/${selectedUser.imagen}`} alt="John Doe" />
            </div>
            <div className="p-2">
              <h3 className="text-center text-xl text-gray-900 font-medium leading-8 capitalize">{selectedUser.name} {selectedUser.apellido}</h3>
              <div className="text-center text-gray-400 text-xs font-semibold">
                <p>{selectedUser.rol.nombre}</p>
              </div>
              <table className="text-xs my-3">
                <tbody className="text-left">
                  <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">Usuario</td>
                    <td className="px-2 py-2 capitalize">{selectedUser.usuario}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">Tipo de Documento</td>
                    <td className="px-2 py-2 capitalize">{selectedUser.id_tipo_documento}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">Numero de Documento</td>
                    <td className="px-2 py-2 capitalize">{selectedUser.numero_documento}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">Email</td>
                    <td className="px-2 py-2">{selectedUser.email}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">Fecha de Nacimiento</td>
                    <td className="px-2 py-2">{selectedUser.fecha_nacimiento}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">Direccion</td>
                    <td className="px-2 py-2">{selectedUser.direccion}</td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        </div>

      </div>

      <button
        className="absolute -top-5 -right-5 bottom-full text-4xl transition-all duration-100 ease hover:cursor-pointer hover:scale-110"
        onClick={handleCloseModals}
      >
        <i className="fa-solid fa-rectangle-xmark text-indigo-800"></i>
      </button>
    </div>
  )
}
