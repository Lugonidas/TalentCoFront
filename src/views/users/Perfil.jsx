import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import "../../styles/spinner.scss";
import moment from "moment";
import "moment/locale/es";
import "moment-timezone";
import Swal from "sweetalert2";

export default function Perfil() {
  const { user, mutate } = useAuth({ middleware: "auth" });
  const apiUrl = import.meta.env.VITE_API_URL;


  const { updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
    imagen: "",
    usuario: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.name || "",
        apellido: user.apellido || "",
        email: user.email || "",
        direccion: user.direccion || "",
        imagen: user.imagen || "",
        usuario: user.usuario || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const roles = {
    1: "Admin",
    2: "Estudiante",
    3: "Docente",
  };

  const tiposDocumentos = {
    1: "Cédula de ciudadanía",
    2: "Tarjeta de identidad",
    3: "Cedula de extranjeria",
  };

  const formattedBirthDate = moment(user.fecha_nacimiento)
    .tz("America/Bogota")
    .locale("es")
    .format("DD [de] MMMM [de] YYYY");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user.id, formData);
      await mutate();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full p-6 relative">
        {isEditing ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-0"
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className="fa-solid fa-xmark bg-indigo-800 text-white p-2  "></i>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-0"
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className="fa-solid fa-user-pen text-indigo-800 p-1 text-xl"></i>
          </motion.button>
        )}
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
              Editar Perfil
            </h2>
            <div className="grid grid-cols-2 items-center gap-4 my-4">
              <div>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full font-semibold text-gray-600 outline-none placeholder:text-indigo-800 border-b border-b-indigo-800"
                  placeholder="Nombre"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className="w-full font-semibold text-gray-600 outline-none placeholder:text-indigo-800 border-b border-b-indigo-800"
                  placeholder="Apellido"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 items-center gap-4 my-4">
              <div>
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleInputChange}
                  className="w-full font-semibold text-gray-600 outline-none placeholder:text-indigo-800 border-b border-b-indigo-800"
                  placeholder="Usuario"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full font-semibold text-gray-600 outline-none placeholder:text-indigo-800 border-b border-b-indigo-800"
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="grid items-center gap-4 my-4">
              <div>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="w-full font-semibold text-gray-600 outline-none placeholder:text-indigo-800 border-b border-b-indigo-800"
                  placeholder="Dirección"
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  className="bg-indigo-800 text-white px-6 py-1 rounded-lg font-bold "
                >
                  Guardar
                </motion.button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex items-center">
              <img
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                src={`${apiUrl}/api/storage/${user?.imagen}`}
                alt="user"
              />
              <div className="ml-4">
                <h2 className="text-2xl font-semibold text-gray-800">{`${user?.name} ${user?.apellido}`}</h2>
                <p className="text-gray-600 text-sm">@{user?.usuario}</p>
                <p className=" font-bold text-xs text-indigo-800">
                  {roles[user.id_rol] || "Unknown"}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2">
                  <div>
                    <span className="font-semibold text-indigo-800">
                      Email:
                    </span>
                    <p className="text-gray-800">{user?.email}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-indigo-800">
                      Fecha de Nacimiento:
                    </span>
                    <p className="text-gray-800">{formattedBirthDate}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div>
                    <span className="font-semibold text-indigo-800">
                      Tipo de Documento:
                    </span>
                    <p className="text-gray-800">
                      {tiposDocumentos[user.id_tipo_documento] || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-indigo-800">
                      No. de Documento:
                    </span>
                    <p className="text-gray-800">{user?.numero_documento}</p>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-indigo-800">
                    Dirección:
                  </span>
                  <p className="text-gray-800">{user?.direccion}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
