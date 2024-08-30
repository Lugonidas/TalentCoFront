import { useState } from "react";
import useArchivo from "../../hooks/useArchivo";
import useLeccion from "../../hooks/useLeccion";

export default function CreateArchivo() {
  const { createArchivo, errores } = useArchivo();
  const { selectedLeccion } = useLeccion();
  const { handleCloseModals } = useArchivo();

  const [archivo, setArchivo] = useState({
    nombre: "",
    tipo: "",
    ubicacion: null,
    id_leccion: selectedLeccion.id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArchivo((prevArchivo) => ({
      ...prevArchivo,
      [name]: value,
    }));
  };

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    let tipo = "";

    // Determina el tipo de archivo basado en el MIME type
    if (file) {
      if (file.type.startsWith("image/")) {
        tipo = "IMG";
      } else if (file.type === "application/pdf") {
        tipo = "PDF";
      } else if (file.type.startsWith("video/")) {
        tipo = "VIDEO";
      }
    }

    setArchivo((prevArchivo) => ({
      ...prevArchivo,
      ubicacion: file,
      tipo: tipo,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(archivo).forEach((key) => {
      formData.append(key, archivo[key]);
    });

    await createArchivo(formData);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Agregar archivo</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={archivo.nombre}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Introduce el nombre del archivo"
          />
          {errores && errores.nombre && (
            <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
              {errores.nombre}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="ubicacion"
            className="block text-sm font-medium text-gray-700"
          >
            Archivo:Imagen,Video,PDF
          </label>
          <input
            type="file"
            id="ubicacion"
            name="ubicacion"
            onChange={handleArchivoChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errores && errores.ubicacion && (
            <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
              {errores.ubicacion}
            </p>
          )}
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
