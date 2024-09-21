import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import "../../styles/spinner.scss";
import moment from "moment";
import "moment/locale/es";
import "moment-timezone";
import Loader from "../../components/Loader";

export default function Perfil() {
  const { user, mutate } = useAuth({ middleware: "auth" });
  const apiUrl = import.meta.env.VITE_ARCHIVOS_URL;

  // Verifica si los tres inputs tienen datos

  const { updateProfile, updatePassword, errores } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
    imagen: "",
    usuario: "",
  });

  const [passwordData, setPasswordData] = useState({
    password_actual: "",
    password: "",
    password_confirmation: "",
  });

  const isButtonEnabled =
    passwordData.password_actual &&
    passwordData.password &&
    passwordData.password_confirmation;

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
    return <Loader />;
  }

  const roles = {
    1: "Admin",
    2: "Estudiante",
    3: "Docente",
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user.id, formData);
      await mutate();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      await updatePassword(user.id, passwordData);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white shadow-lg rounded-lg max-w-2xl w-full p-6 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isEditing ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-0"
            onClick={() => setIsEditing(!isEditing)}
            aria-label="Cerrar edición"
          >
            <i className="fa-solid fa-xmark bg-indigo-800 text-white p-2"></i>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-0"
            onClick={() => setIsEditing(!isEditing)}
            aria-label="Editar perfil"
          >
            <i className="fa-solid fa-user-pen text-indigo-800 p-1 text-xl"></i>
          </motion.button>
        )}

        {isEditing ? (
          <motion.form
            onSubmit={handleProfileSubmit}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
              Editar Perfil
            </h2>
            <div className="grid md:grid-cols-2 items-center gap-4 my-4">
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
            <div className="grid md:grid-cols-2 items-center gap-4 my-4">
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
                  className="bg-indigo-800 text-white px-6 py-1 rounded-lg font-bold"
                >
                  Guardar
                </motion.button>
              </div>
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <motion.img
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                src={`${apiUrl}/storage/${user?.imagen}`}
                alt="user"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="ml-4">
                <h2 className="text-2xl font-semibold text-gray-800">{`${user?.name} ${user?.apellido}`}</h2>
                <p className="text-gray-600 text-sm">@{user?.usuario}</p>
                <p className="font-bold text-xs text-indigo-800">
                  {roles[user.id_rol] || "Unknown"}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid md:grid-cols-2">
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
                <div>
                  <span className="font-semibold text-indigo-800">
                    Dirección:
                  </span>
                  <p className="text-gray-800">{user?.direccion}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <h2 className="text-2xl font-black uppercase text-center my-4 text-indigo-800">
          Cambiar Contraseña
        </h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="grid gap-4">
            <input
              type="password"
              name="password_actual"
              value={passwordData.password_actual}
              onChange={handlePasswordChange}
              placeholder="Contraseña actual"
              className="w-full font-semibold text-gray-600 outline-none placeholder:text-indigo-800 border-b border-b-indigo-800"
            />
            {errores && errores.password_actual && (
              <p className="text-red-500">{errores.password_actual}</p>
            )}
            <input
              type="password"
              name="password"
              value={passwordData.password}
              onChange={handlePasswordChange}
              placeholder="Nueva contraseña"
              className="w-full font-semibold text-gray-600 outline-none placeholder:text-indigo-800 border-b border-b-indigo-800"
            />
            <input
              type="password"
              name="password_confirmation"
              value={passwordData.password_confirmation}
              onChange={handlePasswordChange}
              placeholder="Confirmar contraseña"
              className="w-full font-semibold text-gray-600 outline-none placeholder:text-indigo-800 border-b border-b-indigo-800"
            />
            {errores && errores.password && (
              <div className="text-red-500">
                {errores.password.map((error, index) => (
                  <div key={index}>
                    <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                      {error}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end">
              <button
                className={`${
                  isButtonEnabled
                    ? "bg-indigo-800 text-white"
                    : "disabled cursor-not-allowed bg-gray-300 text-gray-700"
                }  py-2 px-4 font-bold `}
                type="submit"
                disabled={!isButtonEnabled}
              >
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
