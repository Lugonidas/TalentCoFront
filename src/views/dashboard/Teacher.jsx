import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import BarChart from "../../components/DynamicChart";
import useCourse from "../../hooks/useCourse";
import DynamicChart from "../../components/DynamicChart";

export default function Teacher() {
  const { user } = useAuth({ middleware: "auth" });

  const { cursos } = useCourse();

  // Dentro de tu componente ShowCourse
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  // Preparar datos para el gráfico
  const categorias = cursos.reduce((acc, curso) => {
    const { nombre } = curso.categoria;
    if (!acc[nombre]) {
      acc[nombre] = 0;
    }
    acc[nombre] += 1;
    return acc;
  }, {});

  const labelsCategorias = Object.keys(categorias);
  const dataCategorias = Object.values(categorias);

  // Preparar datos para el gráfico
  const labels = cursos.map((curso) => curso.titulo);
  const data = cursos.map((curso) => curso.estudiantes.length);

  return (
    <>
      <div className="border-2 border-dotted min-h-screen">
        <h1 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
          Dashboard
        </h1>
        <div className="p-2">
          <p className="text-gray-600">
            Hola{" "}
            <strong className="text-indigo-800 capitalize">
              {user.usuario}
            </strong>
            , nos alegra tenerte de vuelta.
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
        </div>
        <div className="w-full md:flex md:justify-center gap-2">
          <div className="md:w-1/3">
            <DynamicChart
              labels={labels}
              data={data}
              title="No. de estudiantes por curso"
              backgroundColor="rgba(255, 99, 132, 0.2)"
              borderColor="rgba(255, 99, 132, 1)"
              borderWidth={20}
              chartType="bar"
            />
          </div>
          <div className="md:w-1/3">
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
        </div>
      </div>
    </>
  );
}
