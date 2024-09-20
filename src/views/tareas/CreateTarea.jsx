import { useState, useContext } from "react";
import { CourseContext } from "../../context/CourseProvider";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import useTarea from "../../hooks/useTarea";

export default function CreateTarea() {
  const { user } = useAuth({ middleware: "auth" });
  const { selectedCourse } = useContext(CourseContext);
  const { createTarea, errores, handleCloseModals } = useTarea();

  const [tarea, setTarea] = useState({
    id_docente: user.id,
    id_curso: selectedCourse.id,
    tipo: "Tarea",
    titulo: "",
    descripcion: "",
    archivo: null,
    nota_maxima: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: 1,
  });

  const [filePreview, setFilePreview] = useState(null); // Para almacenar la URL del archivo

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarea((prevTarea) => ({
      ...prevTarea,
      [name]: value,
    }));
  };

  const handleFileChange = (file) => {
    setTarea((prevTarea) => ({
      ...prevTarea,
      archivo: file,
    }));

    // Verificamos si el archivo es una imagen o PDF y generamos la URL para vista previa
    const fileType = file.type;
    if (fileType.includes("image")) {
      setFilePreview(URL.createObjectURL(file)); // Para imágenes
    } else if (fileType === "application/pdf") {
      setFilePreview(URL.createObjectURL(file)); // Para PDFs
    } else {
      setFilePreview(null); // No soporta vista previa para otros tipos
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(tarea).forEach((key) => {
      formData.append(key, tarea[key]);
    });

    try {
      await createTarea(formData);
    } catch {
      console.log(errores);
    }
  };

  // Configuración de drag and drop usando react-dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileChange(acceptedFiles[0]); // Maneja el archivo seleccionado
      }
    },
  });

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Agregar Tarea</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Campo para el título */}
        <div>
          <label
            htmlFor="titulo"
            className="block text-sm font-medium text-gray-700"
          >
            Título de la tarea
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={tarea.titulo}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errores?.titulo && (
            <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
              {errores.titulo}
            </p>
          )}
        </div>

        {/* Campo para la descripción */}
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
            value={tarea.descripcion}
            onChange={handleChange}
            required
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errores?.descripcion && (
            <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
              {errores.descripcion}
            </p>
          )}
        </div>

        {/* Campo para la nota máxima */}
        <div>
          <label
            htmlFor="nota_maxima"
            className="block text-sm font-medium text-gray-700"
          >
            Nota máxima
          </label>
          <input
            type="number"
            id="nota_maxima"
            name="nota_maxima"
            value={tarea.nota_maxima}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errores?.nota_maxima && (
            <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
              {errores.nota_maxima}
            </p>
          )}
        </div>

        {/* Campo para la fecha de inicio */}
        <div>
          <label
            htmlFor="fecha_inicio"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha de inicio
          </label>
          <input
            type="date"
            id="fecha_inicio"
            name="fecha_inicio"
            value={tarea.fecha_inicio}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errores?.fecha_inicio && (
            <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
              {errores.fecha_inicio}
            </p>
          )}
        </div>

        {/* Campo para la fecha de fin */}
        <div>
          <label
            htmlFor="fecha_fin"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha de fin
          </label>
          <input
            type="date"
            id="fecha_fin"
            name="fecha_fin"
            value={tarea.fecha_fin}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errores?.fecha_fin && (
            <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
              {errores.fecha_fin}
            </p>
          )}
        </div>

        {/* Campo para el estado */}
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
            value={tarea.estado}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
          {errores?.estado && (
            <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
              {errores.estado}
            </p>
          )}
        </div>

        {/* Campo para la imagen */}
        <div>
          <label
            htmlFor="archivo"
            className="block text-sm font-medium text-gray-700"
          >
            Archivo - MAX:4MB
          </label>
          <div
            {...getRootProps({
              className:
                "mt-1 flex justify-center items-center w-full px-3 py-2 border-2 border-dashed border-gray-300 min-h-28 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
            })}
          >
            <input {...getInputProps()} />
            <p className="text-gray-600 font-bold">
              Arrastra y suelta un archivo aquí, o haz clic para seleccionar un
              archivo
            </p>
          </div>
          {/* Mostrar vista previa del archivo */}
          {filePreview && (
            <div className="mt-4">
              {tarea.archivo.type.includes("image") ? (
                <img
                  src={filePreview}
                  alt="Vista previa de la imagen"
                  className="max-w-xs max-h-xs"
                />
              ) : tarea.archivo.type === "application/pdf" ? (
                <iframe
                  src={filePreview}
                  title="Vista previa del PDF"
                  className="w-full h-64"
                ></iframe>
              ) : (
                <p>No se puede previsualizar este archivo</p>
              )}
            </div>
          )}
          {errores && errores.archivo && (
            <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
              {errores.archivo}
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <motion.button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={handleCloseModals}
            whileTap={{ scale: 0.95 }}
          >
            Cancelar
          </motion.button>
          <motion.button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            whileTap={{ scale: 0.95 }}
          >
            Agregar
          </motion.button>
        </div>
      </form>
    </>
  );
}
