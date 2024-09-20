import { useState, useEffect, useContext } from "react";
import { useAuth } from "../../hooks/useAuth";
import useLeccion from "../../hooks/useLeccion";
import { motion } from "framer-motion";
import CourseContext from "../../context/CourseProvider";
import useTarea from "../../hooks/useTarea";
import { isToday } from "date-fns";
import { useDropzone } from "react-dropzone";

export default function EditTarea() {
  const { user } = useAuth({ middleware: "auth" });
  const { selectedCourse } = useContext(CourseContext);
  const { updateTarea, errores, handleCloseModals, selectedTarea } = useTarea();
  const [filePreview, setFilePreview] = useState(null); // Para almacenar la URL del archivo

  const [tarea, setTarea] = useState({
    tipo: "",
    titulo: "",
    descripcion: "",
    archivo: "",
    nota_maxima: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "",
  });

  useEffect(() => {
    if (selectedTarea) {
      setTarea({
        id: selectedTarea.id || "",
        tipo: selectedTarea.tipo || "",
        titulo: selectedTarea.titulo || "",
        descripcion: selectedTarea.descripcion || "",
        archivo: selectedTarea.archivo || "",
        nota_maxima: selectedTarea.nota_maxima || "",
        fecha_inicio: selectedTarea.fecha_inicio || "",
        fecha_fin: selectedTarea.fecha_fin || "",
        estado: selectedTarea.estado || "",
      });
    }
  }, [selectedTarea]);

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
    if (fileType === "application/pdf") {
      setFilePreview(URL.createObjectURL(file)); // Para PDFs
    } else {
      setFilePreview(null); // No soporta vista previa para otros tipos
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(tarea).forEach((key) => {
      if (key === "archivo" && tarea[key]) {
        formData.append(key, tarea[key]); // Solo agregar el archivo si está presente
      } else if (key !== "archivo") {
        formData.append(key, tarea[key]);
      }
    });

    try {
      await updateTarea(selectedTarea.id, formData);
    } catch (error) {
      console.log("Error al actualizar la tarea:", error);
    }
  };

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const todayDate = today.toISOString().split("T")[0];

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
      <h2 className="text-2xl font-bold mb-4">Editar Tarea</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid md:grid-cols-2 gap-4">
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
              placeholder="Introduce el título de la lección"
            />
            {errores && errores.titulo && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.titulo}
              </p>
            )}
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
              value={tarea.descripcion}
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
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="nota_maxima"
              className="block text-sm font-medium text-gray-700"
            >
              Nota máxima
            </label>
            <input
              type="text"
              id="nota_maxima"
              name="nota_maxima"
              value={tarea.nota_maxima}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nota para aprobar la tarea"
            />
            {errores && errores.nota_maxima && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.nota_maxima}
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
              value={tarea.estado}
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

        <div className="grid md:grid-cols-2 gap-4">
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
              value={
                tarea.fecha_inicio
                  ? new Date(tarea.fecha_inicio).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              min={todayDate}
              required
              className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            {errores && errores.fecha_inicio && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.fecha_inicio}
              </p>
            )}
          </div>
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
              value={
                tarea.fecha_fin
                  ? new Date(tarea.fecha_fin).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              min={
                tarea.fecha_inicio
                  ? new Date(tarea.fecha_inicio).toISOString().split("T")[0]
                  : ""
              }
              required
              className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errores && errores.fecha_fin && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.fecha_fin}
              </p>
            )}
          </div>
        </div>

        <div className="">
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
                Arrastra y suelta un archivo aquí, o haz clic para seleccionar
                un archivo
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Guardar
          </motion.button>
        </div>
      </form>
      <motion.button
        className="absolute -top-5 -right-5 bottom-full text-4xl transition-all duration-100 ease hover:tarear-pointer"
        onClick={handleCloseModals}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <i className="fa-solid fa-rectangle-xmark text-indigo-800"></i>
      </motion.button>
    </>
  );
}
