import { useState, useContext } from "react";
import { CourseContext } from "../../context/CourseProvider";
import { useAuth } from "../../hooks/useAuth";
import useLeccion from "../../hooks/useLeccion";

export default function CreateLeccion() {
  const { user } = useAuth({ middleware: "auth" });
  const { selectedCourse } = useContext(CourseContext);
  const { handleCloseModals, createLeccion, errores } = useLeccion();

  const [leccion, setLeccion] = useState({
    titulo: "",
    descripcion: "",
    estado: 1,
    orden: 0,
    imagen: null,
    id_docente: user?.id || "",
    id_curso: selectedCourse?.id || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeccion((prevLeccion) => ({
      ...prevLeccion,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setLeccion((prevLeccion) => ({
      ...prevLeccion,
      imagen: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(leccion).forEach((key) => {
      formData.append(key, leccion[key]);
    });

    await createLeccion(formData);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Agregar lección</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid md:grid-cols-2 gap-4">
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errores && errores.imagen && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.imagen}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="titulo"
              className="block text-sm font-medium text-gray-700"
            >
              Título de la lección
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={leccion.titulo}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Introduce el título de la lección"
            />
            {errores && errores.titulo && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.titulo}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={leccion.descripcion}
            onChange={handleChange}
            required
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Describe brevemente la lección"
          />
          {errores && errores.descripcion && (
            <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
              {errores.descripcion}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="orden"
              className="block text-sm font-medium text-gray-700"
            >
              Orden
            </label>
            <input
            min={0}
              type="number"
              id="orden"
              name="orden"
              value={leccion.orden}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Duración de la lección en horas"
            />
            {errores && errores.orden && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.orden}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="estado"
              className="block text-sm font-medium text-gray-700"
            >
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              value={leccion.estado}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
            {errores && errores.estado && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.estado}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Agregar lección
          </button>
        </div>
      </form>
      <button
        className="absolute -top-5 -right-5 bottom-full text-4xl transition-all duration-100 ease hover:cursor-pointer hover:scale-110"
        onClick={handleCloseModals}
      >
        <i className="fa-solid fa-rectangle-xmark text-indigo-800"></i>
      </button>
    </>
  );
}
