import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import useCourse from "../../hooks/useCourse";
import { useDropzone } from "react-dropzone";

export default function CreateCourse() {
  const { user, isAdmin } = useAuth({ middleware: "auth" });
  const [filePreview, setFilePreview] = useState(null); // Para almacenar la URL del archivo

  const { createCourse, categoriasDisponibles, handleCloseModals, errores } =
    useCourse();

  const [curso, setCurso] = useState({
    titulo: "",
    imagen: null,
    descripcion: "",
    duracion: 0,
    id_docente: user.id,
    id_categoria: "",
    estado: 0,
    fecha_inicio: "",
    fecha_fin: "",
  });

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    const formattedDate = `${year}-${month}-${day}`;
    setCurso((prevCurso) => ({
      ...prevCurso,
      fecha_inicio: formattedDate,
      fecha_fin: formattedDate,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurso((prevCurso) => ({
      ...prevCurso,
      [name]: value,
    }));
  };

  const handleImageChange = (file) => {
    setCurso((prevCurso) => ({
      ...prevCurso,
      imagen: file,
    }));

    // Verificamos si el archivo es una imagen o PDF y generamos la URL para vista previa
    const fileType = file.type;
    if (fileType.includes("image")) {
      setFilePreview(URL.createObjectURL(file)); // Para imágenes
    } else {
      setFilePreview(null); // No soporta vista previa para otros tipos
    }
  };

/*   const handleImageChange = (e) => {
    setCurso((prevCurso) => ({
      ...prevCurso,
      imagen: e.target.files[0],
    }));
  };
 */
  const handleSwitchChange = () => {
    setCurso((prevCurso) => ({
      ...prevCurso,
      estado: prevCurso.estado == 0 ? 1 : 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(curso).forEach((key) => {
      formData.append(key, curso[key]);
    });

    try {
      await createCourse(formData);
    } catch (error) {
      console.log(error);
    }
  };

  // Configuración de drag and drop usando react-dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageChange(acceptedFiles[0]); // Maneja el archivo seleccionado
      }
    },
  });

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Nuevo Curso</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="titulo"
              className="block text-sm font-medium text-gray-700"
            >
              Título del Curso
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={curso.titulo}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Título del curso"
            />
            {errores && errores.titulo && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.titulo}
              </p>
            )}
          </div>
          {/* <div>
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
              className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errores && errores.imagen && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.imagen}
              </p>
            )}
          </div> */}
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
            value={curso.descripcion}
            onChange={handleChange}
            required
            rows={3}
            className="resize-none mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Describe el curso"
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
              htmlFor="duracion"
              className="block text-sm font-medium text-gray-700"
            >
              Duración
            </label>
            <input
              type="number"
              id="duracion"
              name="duracion"
              value={curso.duracion}
              onChange={handleChange}
              min={1}
              required
              className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Duración del curso en horas"
            />
            {errores && errores.duracion && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.duracion}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="id_categoria"
              className="block text-sm font-medium text-gray-700"
            >
              Categoría
            </label>
            <select
              id="id_categoria"
              name="id_categoria"
              value={curso.id_categoria}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categoriasDisponibles.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {errores && errores.id_categoria && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.id_categoria}
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
              value={curso.fecha_inicio}
              onChange={handleChange}
              min={curso.fecha_inicio}
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
              value={curso.fecha_fin}
              onChange={handleChange}
              min={curso.fecha_inicio}
              required
              className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errores && errores.fecha_fin && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.fecha_fin}
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
              {curso.imagen.type.includes("image") ? (
                <img
                  src={filePreview}
                  alt="Vista previa de la imagen"
                  className="max-w-xs max-h-xs"
                />
              ) : curso.imagen.type === "application/pdf" ? (
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

          {user && isAdmin && (
            <div className="flex flex-col">
              <label htmlFor="">
                {curso.estado == 1 ? "Activo" : "Inactivo"}
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value={curso.estado}
                  className="sr-only peer"
                  checked={curso.estado == 1}
                  onChange={handleSwitchChange}
                />
                <div className="peer ring-0 bg-rose-400  rounded-full outline-none duration-300 after:duration-500 w-12 h-12  shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-['✖️'] after:rounded-full after:absolute after:outline-none after:h-10 after:w-10 after:bg-gray-50 after:top-1 after:left-1 after:flex after:justify-center after:items-center  peer-hover:after:scale-75 peer-checked:after:content-['✔️'] after:-rotate-180 peer-checked:after:rotate-0"></div>
              </label>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Agregar Curso
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
