import { useEffect, useState } from "react";
import clienteAxios from "../../config/axios";

export default function StudentList({ cursoId, students = [] }) {
  const [progresoEstudiantes, setProgresoEstudiantes] = useState([]); // Aseguramos que sea un array vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Realizar la solicitud GET para obtener el progreso de los estudiantes en este curso
    const fetchProgresoEstudiantes = async () => {
      const token = localStorage.getItem("AUTH_TOKEN");
      try {
        const response = await clienteAxios.get(
          `cursos/${cursoId}/progreso-estudiantes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProgresoEstudiantes(response.data.progreso_estudiantes || []); // Aseguramos que sea un array
      } catch (err) {
        setError("Error al obtener el progreso de los estudiantes");
      } finally {
        setLoading(false);
      }
    };

    if (cursoId) {
      fetchProgresoEstudiantes();
    }
  }, [cursoId]); // Realizar la solicitud solo cuando cambie el cursoId

  // Función para obtener el progreso de un estudiante por ID
  const getProgresoPorEstudiante = (studentId) => {
    // Verificamos si progresoEstudiantes tiene datos antes de usar find
    if (progresoEstudiantes && progresoEstudiantes.length > 0) {
      const estudiante = progresoEstudiantes.find(
        (progreso) => progreso.estudiante_id === studentId
      );
      return estudiante ? estudiante.progreso : "0";
    }

    return "0"; // Si no hay progreso disponible
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="overflow-hidden overflow-x-scroll md:overflow-auto">
      <h2 className="text-2xl font-black uppercase text-center mb-4 text-white">
        Lista de Estudiantes
      </h2>
      {students.length === 0 ? (
        <p>No hay estudiantes inscritos.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="p-2 border border-gray-300">Nombre Completo</th>
              <th className="p-2 border border-gray-300">Email</th>
              <th className="p-2 border border-gray-300">Progreso (%)</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="bg-white shadow-md">
                <td className="p-2 border border-gray-300">
                  {student.name} {student.apellido}
                </td>
                <td className="p-2 border border-gray-300">{student.email}</td>
                <td className="p-2 border border-gray-300">
                  {getProgresoPorEstudiante(student.id)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
