import { useState, useEffect } from "react";
import useCourse from "../../hooks/useCourse";
import { useAuth } from "../../hooks/useAuth";

export default function EditCourse() {
  const { user, isAdmin } = useAuth({ middleware: "auth" });
  const {
    updateCourse,
    categoriasDisponibles,
    handleCloseModals,
    selectedCourse,
    errores,
  } = useCourse();

  const [curso, setCurso] = useState({
    id: null,
    titulo: "",
    imagen: null,
    descripcion: "",
    duracion: 0,
    id_categoria: "",
    estado: 0,
    fecha_inicio: "",
    fecha_fin: "",
  });

  useEffect(() => {
    if (selectedCourse) {
      setCurso({
        titulo: selectedCourse.titulo || "",
        imagen: selectedCourse.imagen || null,
        descripcion: selectedCourse.descripcion || "",
        duracion: selectedCourse.duracion || 0,
        id_categoria: selectedCourse.id_categoria || "",
        estado: selectedCourse.estado || 0,
        fecha_inicio: selectedCourse.fecha_inicio || "",
        fecha_fin: selectedCourse.fecha_fin || "",
      });
    }
  }, [selectedCourse]);

  const handleSwitchChange = () => {
    setCurso((prevCurso) => ({
      ...prevCurso,
      estado: prevCurso.estado === 0 ? 1 : 0,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurso((prevCurso) => ({
      ...prevCurso,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setCurso((prevCurso) => ({
      ...prevCurso,
      imagen: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

/*     const formData = new FormData();

    // Agregar todos los campos de courseData a formData
    Object.keys(curso).forEach((key) => {
      formData.append(key, curso[key]);
    }); */

/*     console.log("Curso");
    console.log(curso);
    console.log("FormData");
    console.log(...[formData]);
    formData.forEach((value, key) => console.log(`${key}: ${value}`)) */

    try {
      await updateCourse(selectedCourse.id, curso);
    } catch (error) {
      if (error.response) {
        console.error("Error de servidor:", error.message);
      } else {
        console.error("Error de servidor:", error.message);
      }
    }
  };

  // Si selectedCourse no está definido aún, podrías mostrar un mensaje o spinner de carga
  if (!selectedCourse) {
    return <p>Cargando curso...</p>;
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Editar Curso</h2>
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
              Título del Curso
            </label>
            <input
              type="text"
              name="titulo"
              value={curso.titulo}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Introduce el título del curso"
            />
            {errores && errores.titulo && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.titulo}
              </p>
            )}
          </div>
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
              name="duracion"
              value={curso.duracion}
              onChange={handleChange}
              min={1}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              name="id_categoria"
              value={curso.id_categoria}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

        <div>
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={curso.descripcion}
            onChange={handleChange}
            required
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Describe brevemente el curso"
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
              htmlFor="fecha_inicio"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha de inicio
            </label>
            <input
              type="date"
              name="fecha_inicio"
              value={curso.fecha_inicio}
              onChange={handleChange}
              min={curso.fecha_inicio}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              name="fecha_fin"
              value={curso.fecha_fin}
              onChange={handleChange}
              min={curso.fecha_inicio}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errores && errores.fecha_fin && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.fecha_fin}
              </p>
            )}
          </div>

          {user && isAdmin && (
            <div className="flex flex-col">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700"
              >
                {curso.estado === 1 ? "Activo" : "Inactivo"}
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value={curso.estado}
                  className="sr-only peer"
                  checked={curso.estado === 1}
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
            Guardar Cambios
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
