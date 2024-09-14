import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";

export default function Registro() {
  const { registro, errores } = useAuth({
    middleware: "guest",
    url: "/dashboard",
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    id_tipo_documento: "",
    numero_documento: "",
    fecha_nacimiento: "",
    direccion: "",
    id_rol: 0,
    usuario: "",
    imagen: null,
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      imagen: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();

    Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });

    try {
      await registro(formData);
      // Mostrar el mensaje de confirmación de correo
      Swal.fire({
        title: "Registro Exitoso",
        text: "Hemos enviado un correo de verificación, por favor revisa tu bandeja de entrada.",
        icon: "success",
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        // Redirigir al login después de aceptar el mensaje
        window.location.href = "/login";
      });
    } catch (error) {
      console.error("Error creating user", error);
    } finally {
      setIsSubmitting(false); // Habilitar el botón nuevamente
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <>
      <div className="my-4 container mx-auto min-h-screen">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
          Registrarme
        </h2>
        <div className="flex items-center mb-4">
          <div
            className={`flex-1 border-t-2 ${
              step >= 1 ? "border-indigo-600" : "border-gray-300"
            }`}
          ></div>
          <div
            className={`px-4 py-2 rounded-full ${
              step >= 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            1
          </div>
          <div
            className={`flex-1 border-t-2 ${
              step >= 2 ? "border-indigo-600" : "border-gray-300"
            }`}
          ></div>
          <div
            className={`px-4 py-2 rounded-full ${
              step >= 2
                ? "bg-indigo-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            2
          </div>
          <div
            className={`flex-1 border-t-2 ${
              step >= 3 ? "border-indigo-600" : "border-gray-300"
            }`}
          ></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {step == 1 && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombres
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={user.nombre}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Introduce los nombres del usuario"
                  />
                  {errores && errores.nombre && (
                    <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                      {errores.nombre}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="apellido"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={user.apellido}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Introduce el apellido del usuario"
                  />
                  {errores && errores.apellido && (
                    <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                      {errores.apellido}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="usuario"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Usuario
                  </label>
                  <input
                    type="text"
                    id="usuario"
                    name="usuario"
                    value={user.usuario}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Introduce el nombre de usuario"
                  />
                  {errores && errores.usuario && (
                    <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                      {errores.usuario}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="imagen"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Imagen
                  </label>
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    onChange={handleImageChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errores && errores.imagen && (
                    <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                      {errores.imagen}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="id_tipo_documento"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tipo de Documento
                  </label>
                  <select
                    id="id_tipo_documento"
                    name="id_tipo_documento"
                    value={user.id_tipo_documento}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecciona el tipo de documento</option>
                    <option value="1">Cédula de ciudadanía</option>
                    <option value="2">Cédula de extranjería</option>
                    <option value="3">Tarjeta de identidad</option>{" "}
                  </select>
                  {errores && errores.id_tipo_documento && (
                    <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                      El tipo de documento es obligatorio
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="numero_documento"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    id="numero_documento"
                    name="numero_documento"
                    value={user.numero_documento}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Introduce el número de documento del usuario"
                  />
                  {errores && errores.numero_documento && (
                    <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                      {errores.numero_documento}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fecha_nacimiento"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    id="fecha_nacimiento"
                    name="fecha_nacimiento"
                    value={user.fecha_nacimiento}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errores && errores.fecha_nacimiento && (
                    <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                      {errores.fecha_nacimiento}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="direccion"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={user.direccion}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Introduce la dirección del usuario"
                  />
                  {errores && errores.direccion && (
                    <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                      {errores.direccion}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
          {step == 2 && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Introduce el email del usuario"
                  />
                  {errores && errores.email && (
                    <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                      {errores.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="id_tipo_documento"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tipo de usuario
                  </label>
                  <select
                    id="id_rol"
                    name="id_rol"
                    value={user.id_rol}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecciona el tipo de usuario</option>
                    <option value="3">Docente</option>
                    <option value="2">Estudiante</option>
                    {/* Agrega otros tipos de documento según sea necesario */}
                  </select>
                  {errores && errores.id_tipo_documento && (
                    <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                      El tipo de documento es obligatorio
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      className="mt-1 block w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      type={showPassword ? "text" : "password"} // Cambiar entre text y password
                      id="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      required
                      placeholder="Introduce la contraseña del usuario"
                    />
                    <button
                      type="button"
                      className="absolute right-0 rounded-r-md text-white bottom-0 top-0 bg-indigo-600 p-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <i className="fa-solid fa-eye-slash"></i>
                      ) : (
                        <i className="fa-solid fa-eye"></i>
                      )}
                    </button>
                  </div>
                  {errores && errores.password && (
                    <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                      {errores.password}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password_confirmation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirmar Contraseña
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password_confirmation"
                    name="password_confirmation"
                    value={user.password_confirmation}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirma la contraseña del usuario"
                  />
                  {errores && errores.password_confirmation && (
                    <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                      {errores.password_confirmation}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row md:justify-between gap-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Anterior
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : ""
                  } mt-2 md:mt-0 w-full md:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {isSubmitting ? "Registrando..." : "Registrarme"}
                </button>

                {/*                 <button
                  type="submit"
                  disabled={isSubmitting} // Deshabilitar el botón si isSubmitting es true
                  className={`py-2 px-4 text-white rounded ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isSubmitting ? "Registrando..." : "Registrar"}
                </button> */}
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
}
