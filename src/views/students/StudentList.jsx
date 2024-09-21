export default function StudentList({ students = [] }) {
    return (
      <div className="overflow-hidden overflow-x-scroll md:overflow-auto">
        <h2 className="text-2xl font-black uppercase text-center mb-4 text-white">Lista de Estudiantes</h2>
        {students.length === 0 ? (
          <p>No hay estudiantes inscritos.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="p-2 border border-gray-300">Nombre Completo</th>
                <th className="p-2 border border-gray-300">Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="bg-white shadow-md">
                  <td className="p-2 border border-gray-300">{student.name} {student.apellido}</td>
                  <td className="p-2 border border-gray-300">{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
  