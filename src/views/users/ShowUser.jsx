import { useContext } from "react";
import UserContext from "../../context/UserProvider";
import { motion } from "framer-motion";

export default function ShowUser() {
  const { selectedUser, handleCloseModals } = useContext(UserContext);
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white shadow-xl rounded-lg w-full md:w-1/4 mx-2 p-4 relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          className="absolute top-4 right-4 text-2xl text-indigo-800 hover:scale-110 transition-transform duration-150 ease-in-out"
          onClick={handleCloseModals}
          aria-label="Cerrar"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className="fa-solid fa-rectangle-xmark"></i>
        </motion.button>
        <div className="flex justify-center mb-4">
          <motion.img
            className="w-32 h-32 rounded-full object-cover"
            src={`${selectedUser.imagen}`}
            alt={`Imagen de ${selectedUser.name} ${selectedUser.apellido}`}
            loading="lazy"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div>
          <h3 className="text-center text-xl text-gray-900 font-medium capitalize">
            {selectedUser.name} {selectedUser.apellido}
          </h3>
          <div className="text-center text-gray-400 text-xs font-semibold mb-3">
            <p>{selectedUser.rol.nombre}</p>
          </div>
          <table className="w-full text-xs">
            <tbody>
              <tr className="flex flex-col md:flex-row text-sm">
                <td className="px-2 py-1 text-indigo-800 font-semibold">
                  Usuario
                </td>
                <td className="px-2 py-1 capitalize">{selectedUser.usuario}</td>
              </tr>
              <tr className="flex flex-col md:flex-row text-sm">
                <td className="px-2 py-1 text-indigo-800 font-semibold">
                  Tipo de Documento
                </td>
                <td className="px-2 py-1 capitalize">
                  {selectedUser.id_tipo_documento == 1 && (
                    <span>Cédula de ciudadanía</span>
                  )}
                  {selectedUser.id_tipo_documento == 2 && (
                    <span>Cédula de extranjería</span>
                  )}
                  {selectedUser.id_tipo_documento == 3 && (
                    <span>Tarjeta de identidad</span>
                  )}
                </td>
              </tr>
              <tr className="flex flex-col md:flex-row text-sm">
                <td className="px-2 py-1 text-indigo-800 font-semibold">
                  Número de Documento
                </td>
                <td className="px-2 py-1 capitalize">
                  {selectedUser.numero_documento}
                </td>
              </tr>
              <tr className="flex flex-col md:flex-row text-sm">
                <td className="px-2 py-1 text-indigo-800 font-semibold">Email</td>
                <td className="px-2 py-1">{selectedUser.email}</td>
              </tr>
              <tr className="flex flex-col md:flex-row text-sm">
                <td className="px-2 py-1 text-indigo-800 font-semibold">
                  Fecha de Nacimiento
                </td>
                <td className="px-2 py-1">{selectedUser.fecha_nacimiento}</td>
              </tr>
              <tr className="flex flex-col md:flex-row text-sm">
                <td className="px-2 py-1 text-indigo-800 font-semibold">
                  Dirección
                </td>
                <td className="px-2 py-1">{selectedUser.direccion}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
