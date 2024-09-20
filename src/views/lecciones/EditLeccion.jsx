import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import useLeccion from "../../hooks/useLeccion";
import { motion } from "framer-motion";

export default function EditLeccion() {
  const { user } = useAuth({ middleware: "auth" });
  const { handleCloseModals, selectedLeccion, errores, updateLeccion } =
    useLeccion();

  const [leccion, setLeccion] = useState({
    id: null,
    titulo: "",
    descripcion: "",
    estado: 0,
    orden: 0,
    imagen: null,
  });

  useEffect(() => {
    if (selectedLeccion) {
      setLeccion({
        titulo: selectedLeccion.titulo,
        imagen: selectedLeccion.imagen,
        descripcion: selectedLeccion.descripcion,
        estado: selectedLeccion.estado,
        orden: selectedLeccion.orden,
      });
    }
  }, [selectedLeccion]);

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

    /*     const formData = new FormData();
    formData.append("titulo", leccion.titulo);
    formData.append("descripcion", leccion.descripcion);
    formData.append("estado", leccion.estado);
    formData.append("orden", leccion.orden);
    if (leccion.imagen) {
      formData.append("imagen", leccion.imagen);
    } */

    await updateLeccion(selectedLeccion.id, leccion);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Editar lección</h2>
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
              type="number"
              id="orden"
              name="orden"
              value={leccion.orden}
              onChange={handleChange}
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

        <div className="flex justify-end gap-4">
          <motion.button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            onClick={handleCloseModals}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
          >
            Cancelar
          </motion.button>
          <motion.button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
          >
            Editar
          </motion.button>
        </div>
      </form>
      <motion.button
        className="absolute -top-5 -right-5 bottom-full text-4xl transition-all duration-100 ease hover:cursor-pointer"
        onClick={handleCloseModals}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        type="submit"
      >
        <i className="fa-solid fa-rectangle-xmark text-indigo-800"></i>
      </motion.button>
    </>
  );
}
