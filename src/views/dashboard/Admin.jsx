import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import useUser from "../../hooks/useUser";
import useCourse from "../../hooks/useCourse";
import CreateUser from "../users/CreateUser";
import CreateCourse from "../courses/CreateCourse";
import { useAuth } from "../../hooks/useAuth";
import DynamicChart from "../../components/DynamicChart";
import { useEffect } from "react";

export default function Admin() {
  const { user } = useAuth({ middleware: "auth" });
  const { createModal, handleOpenCreateModal, users } = useUser();
  const {
    createModal: createModalCourse,
    handleOpenCreateModal: handleOpenCreateModalCourse,
    obtenerMisCursos,
    misCursos,
    cursosData,
    loading,
  } = useCourse();

  const adminCount = users.filter((user) => user.id_rol == 1).length;
  const studentCount = users.filter((user) => user.id_rol == 2).length;
  const teacherCount = users.filter((user) => user.id_rol == 3).length;

  const cursos = cursosData?.cursos || [];

  // Maneja el caso en que cursos es un array válido
  const categorias = Array.isArray(cursos)
    ? cursos.reduce((acc, curso) => {
        // Asegúrate de que curso.categoria y curso.categoria.nombre existan
        const nombreCategoria = curso.categoria?.nombre || "Desconocida";
        if (!acc[nombreCategoria]) {
          acc[nombreCategoria] = 0;
        }
        acc[nombreCategoria] += 1;
        return acc;
      }, {})
    : {};

  const labelsCategorias = Object.keys(categorias);
  const dataCategorias = Object.values(categorias);

  // Preparar datos para el gráfico
  const labels = cursos.map((curso) => curso.id);
  const data = cursos.map((curso) => curso.estudiantes.length);

  useEffect(() => {
    if (user) {
      obtenerMisCursos(user.id, "docente");
    }
  }, [user]);

  // Preparar datos para el gráfico
  const labelsMisCursos = misCursos.map((curso) => curso.titulo);
  const dataMisCursos = misCursos.map((curso) => curso.estudiantes.length);

  if (loading) {
    return <div>Cargando....</div>;
  }

  return (
    <>
      {createModal && (
        <Modal>
          <div className="relative w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <CreateUser />
          </div>
        </Modal>
      )}
      {createModalCourse && (
        <Modal>
          <div className="relative w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <CreateCourse />
          </div>
        </Modal>
      )}
      <div className="border-2 border-dotted">
        <h1 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
          Dashboard
        </h1>
        <div className="p-2">
          <p className="text-gray-600 text-xl">
            Hola <strong className="text-indigo-800">{user.usuario}</strong>,
            nos alegra tenerte de vuelta.
          </p>
        </div>
        <div className="">
          <div className="grid md:grid-cols-4 gap-8 m-8">
            <Link
              to="/dashboard/chat"
              className=" transition-all ease-in-out shadow-md flex flex-col p-2 font-bold text-indigo-800 text-xl hover:shadow-xl hover:bg-gray-200 items-center justify-center rounded"
            >
              <span>
                <img className="w-14" src="/img/chat.png" alt="Chat" />
              </span>
              Chat
            </Link>
            <button
              onClick={handleOpenCreateModal}
              className=" transition-all ease-in-out shadow-md flex flex-col p-2 font-bold text-indigo-800 text-xl hover:shadow-xl hover:bg-gray-200 items-center justify-center rounded"
            >
              <span>
                <img
                  className="w-14"
                  src="/img/agregarUsuario.png"
                  alt="Agregar Usuario"
                />
              </span>
              Agregar Usuario
            </button>
            <button
              onClick={handleOpenCreateModalCourse}
              className="transition-all ease-in-out shadow-md flex flex-col p-2 font-bold text-indigo-800 text-xl hover:shadow-xl hover:bg-gray-200 items-center justify-center rounded"
            >
              <span>
                <img
                  className="w-14"
                  src="/img/agregarCurso.png"
                  alt="Agregar Curso"
                />
              </span>
              Agregar Curso
            </button>
            <Link
              to="/dashboard/misCursos"
              className=" transition-all ease-in-out shadow-md flex flex-col p-2 font-bold text-indigo-800 text-xl hover:shadow-xl hover:bg-gray-200 items-center justify-center rounded"
            >
              <span>
                <img
                  className="w-14"
                  src="/img/misCursos.png"
                  alt="Mis Cursos"
                />
              </span>
              Mis Cursos
            </Link>
          </div>

          <div className="">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 m-8">
              <div className="shadow-md flex flex-col p-2 items-center justify-center rounded bg-gray-50 ">
                <p className="font-bold">Total de cursos</p>
                <div className="flex items-center gap-2 text-sky-900 text-5xl my-4">
                  <img
                    className="w-14"
                    src="/img/cursos.png"
                    alt="Mis Cursos"
                  />
                  <p className=" font-bold">{cursos.length}</p>
                </div>
              </div>
              <div className="shadow-md flex flex-col p-2 items-center justify-center rounded bg-gray-50">
                <p className="font-bold">Total Administradores</p>
                <div className="flex items-center gap-2 text-yellow-600 text-5xl my-4">
                <img className="w-14" src="/img/administrador.png" alt="Mis Cursos" />
                  <p className=" font-bold">{adminCount}</p>
                </div>
              </div>
              <div className="shadow-md flex flex-col p-2 items-center justify-center rounded bg-gray-50 ">
                <p className="font-bold">Total docentes</p>
                <div className="flex items-center gap-2 text-indigo-800 text-5xl my-4">
                <img className="w-14" src="/img/docente.png" alt="Mis Cursos" />
                  <p className="font-bold ">{teacherCount}</p>
                </div>
              </div>
              <div className="shadow-md flex flex-col p-2 items-center justify-center rounded bg-gray-50">
                <p className="font-bold">Total estudiantes</p>
                <div className="flex items-center gap-2 text-green-800 text-5xl my-4">
                <img className="w-14" src="/img/estudiante.png" alt="Mis Cursos" />
                  <p className="font-bold ">{studentCount}</p>
                </div>
              </div>
            </div>
            <div className="w-full sm:grid md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="max-h-full shadow-md m-2 p-2">
                <h2 className="text-center font-bold text-xl text-gray-600">
                  No. de estudiantes por curso
                </h2>
                <DynamicChart
                  labels={labels}
                  data={data}
                  title="No. de estudiantes por curso"
                  backgroundColor="rgba(255, 99, 132, 0.2)"
                  borderColor="rgba(255, 99, 132, 1)"
                  borderWidth={1}
                  chartType="radar"
                />
              </div>
              <div className="max-h-full shadow-md m-2 p-2">
                <h2 className="text-center font-bold text-xl text-gray-600">
                  No. de cursos por categoria
                </h2>
                <DynamicChart
                  labels={labelsCategorias}
                  data={dataCategorias}
                  title="No. de cursos por categoría"
                  backgroundColor="rgba(191, 219, 254, 0.2)" // Light blue
                  borderColor="rgba(191, 219, 254, 1)" // Light blue
                  borderWidth={1}
                  chartType="doughnut"
                />
              </div>
              <div className="max-h-full shadow-md m-2 p-2">
                <h2 className="text-center font-bold text-xl text-gray-600">
                  No. estudiantes en mis cursos
                </h2>
                <DynamicChart
                  labels={labelsMisCursos}
                  data={dataMisCursos}
                  title="No. de estudiantes en mis cursos"
                  backgroundColor="rgba(191, 219, 254, 0.2)" // Light blue
                  borderColor="rgba(191, 219, 254, 1)" // Light blue
                  borderWidth={1}
                  chartType="pie"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
