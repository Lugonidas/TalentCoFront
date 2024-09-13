import { useEffect, useState } from "react";
import useCategoria from "../../hooks/useCategoria";

export default function EditCategoria() {
  const {
    updateCategoria,
    loading,
    selectedCategoria,
    handleCloseModals,
    errores,
    loadingCreate,
  } = useCategoria();

  const [categoria, setCategoria] = useState({
    nombre: "",
  });

  useEffect(() => {
    if (selectedCategoria) {
      setCategoria({
        nombre: selectedCategoria.nombre || "",
      });
    }
  }, [selectedCategoria]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoria((prevCategoria) => ({
      ...prevCategoria,
      [name]: value,
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
      await updateCategoria(selectedCategoria.id, categoria);
    } catch (error) {
      if (error.response) {
        console.error("Error de servidor:", error.message);
      } else {
        console.error("Error de servidor:", error.message);
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Editar Categoría</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre de la categoría
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={categoria.nombre}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nombre de la categoría"
            />
            {errores && errores.nombre && (
              <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                {errores.nombre}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          {loadingCreate ? (
            <div className="flex justify-center">
              <svg
                className="animate-spin h-6 w-6 text-indigo-800"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM12 4a8 8 0 010 16v4c6.627 0 12-5.373 12-12h-4z"
                ></path>
              </svg>
            </div>
          ) : (
            <input
              type="submit"
              value="Editar Categoria"
              className="bg-indigo-800 text-white w-full p-2 transition-all ease-in hover:bg-indigo-700 hover:cursor-pointer uppercase font-bold"
            />
          )}
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
