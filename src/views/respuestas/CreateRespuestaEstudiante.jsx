import { useState, useContext } from "react";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import useRespuestaEstudiante from "../../hooks/useRespuestaEstudiante";
import useTarea from "../../hooks/useTarea";

export default function CreateRespuestaEstudiante() {
  const { user } = useAuth({ middleware: "auth" });
  const { createRespuestaEstudiante, errores, handleCloseModals } =
    useRespuestaEstudiante();
  const { selectedTarea } = useTarea();

  const [respuesta, setRespuesta] = useState({
    id_evaluacion: selectedTarea.id,
    id_estudiante: user.id,
    archivo: null,
    texto_respuesta: "",
  });

  const [filePreview, setFilePreview] = useState(null); // Para la vista previa del archivo

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRespuesta((prevRespuesta) => ({
      ...prevRespuesta,
      [name]: value,
    }));
  };

  const handleFileChange = (file) => {
    setRespuesta((prevRespuesta) => ({
      ...prevRespuesta,
      archivo: file,
    }));

    if (file.type === "application/pdf") {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(respuesta).forEach((key) => {
      formData.append(key, respuesta[key]);
    });

    console.log([...formData]);
    // Envía el formulario a la API
    try {
      await createRespuestaEstudiante(formData);
    } catch {
      console.log(errores);
    }
  };

  // Configuración de dropzone para archivos
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileChange(acceptedFiles[0]);
      }
    },
  });

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Agregar Respuesta</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Campo para el texto de respuesta */}
        <div>
          <label
            htmlFor="texto_respuesta"
            className="block text-sm font-medium text-gray-700"
          >
            Respuesta
          </label>
          <textarea
            id="texto_respuesta"
            name="texto_respuesta"
            value={respuesta.texto_respuesta}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
          {errores?.texto_respuesta && (
            <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
              {errores.texto_respuesta}
            </p>
          )}
        </div>

        {/* Campo para subir archivo */}
        <div>
          <label
            htmlFor="archivo"
            className="block text-sm font-medium text-gray-700"
          >
            Archivo - MAX: 4MB
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
          {/* Vista previa del archivo */}
          {filePreview && (
            <div className="mt-4">
              <iframe
                src={filePreview}
                title="Vista previa del archivo"
                className="w-full h-64"
              ></iframe>
            </div>
          )}
          {errores?.archivo && (
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
            Enviar Entrega
          </motion.button>
        </div>
      </form>
    </div>
  );
}
