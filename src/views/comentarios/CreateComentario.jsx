import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import useComentario from "../../hooks/useComentario";
import Rating from "../../components/Rating";
import useCourse from "../../hooks/useCourse";

export default function CreateComentario() {
  const { user, isAdmin } = useAuth({ middleware: "auth" });
  const { createComentario, handleCloseModals, selectedComentario, errores } =
    useComentario();
  const { selectedCourse } = useCourse();

  const [rating, setRating] = useState(0);

  const [comentario, setComentario] = useState({
    id_usuario: user.id,
    comentario: "Excelente curso.",
    calificacion: rating,
    commentable_type: "App\\Models\\Curso",
    commentable_id: selectedCourse.id,
  });

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setComentario((prevCalificacion) => ({
      ...prevCalificacion,
      calificacion: newRating, // Actualiza la calificación en `calificacion`
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComentario((prevCurso) => ({
      ...prevCurso,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Agregar todos los campos de courseData a formData
    Object.keys(comentario).forEach((key) => {
      formData.append(key, comentario[key]);
    });

    /*     console.log("Curso");
    console.log(curso);
    console.log("FormData");
    console.log(...[formData]);
    formData.forEach((value, key) => console.log(`${key}: ${value}`)) */

    try {
      await createComentario(formData);
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
      <h2 className="text-2xl font-bold mb-4">Editar Comentario</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 my-2 border-t border-dotted border-indigo-800"
        noValidate
      >
        <div className="my-2">
          <label
            htmlFor="comentario"
            className="block text-sm font-medium text-gray-700"
          >
            Comentario
          </label>
          <textarea
            id="comentario"
            name="comentario"
            value={comentario.comentario}
            onChange={handleChange}
            required
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Describe brevemente el curso"
          />
        </div>
        <div className="flex items-center gap-1">
          Calificación:
          <Rating
            initialRating={comentario.calificacion}
            onRatingChange={handleRatingChange}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Agregar Comentario
          </button>
        </div>
      </form>
    </>
  );
}
