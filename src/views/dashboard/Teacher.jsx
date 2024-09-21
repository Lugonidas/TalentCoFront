import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import BarChart from "../../components/DynamicChart";
import useCourse from "../../hooks/useCourse";
import DynamicChart from "../../components/DynamicChart";
import { useState } from "react";

export default function Teacher() {
  const { user } = useAuth({ middleware: "auth" });

  const { cursos } = useCourse();

  const [itemsToShowEstudiantes, setItemsToShowEstudiantes] = useState(4); // Para el gráfico de estudiantes por curso

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

  // Filtrar los cursos que tienen estudiantes
  const cursosConEstudiantes = cursos
    .filter((curso) => curso.estudiantes.length > 0) // Solo cursos con estudiantes
    .sort((a, b) => b.estudiantes.length - a.estudiantes.length) // Ordenar por cantidad de estudiantes de mayor a menor
    .slice(0, itemsToShowEstudiantes); // Limitar a los primeros 8 cursos

  // Preparar datos para el gráfico
  const labels = cursosConEstudiantes.map((curso) => curso.titulo); // Usar los cursos filtrados y ordenados
  const data = cursosConEstudiantes.map((curso) => curso.estudiantes.length); // Cantidad de estudiantes

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
          {user.email === "hansduerte@gmail.com" && (
            <div className="text-indigo-800 font-black uppercase text-center text-4xl">
              Hola Gay, todos sabemos que eres gay y te gusta el pene
            </div>
          )}
          {user.email === "dannylaverde95@gmail.com" && (
            <div className="text-indigo-800 font-black uppercase text-center text-4xl">
              Hola Gay, todos sabemos que eres gay y te gusta el pene
            </div>
          )}
          {user.email === "danielbelmont98@gmail.com" && (
            <div className="text-indigo-800 font-black uppercase text-center text-4xl">
              Hola Gay, todos sabemos que eres gay y te gusta el pene
            </div>
          )}
          {user.email === "danielasilvabenavides@gmail.com" && (
            <div className="text-indigo-800 font-black uppercase text-center text-4xl">
              Te amo, apenas acabe TalentCo ya no me vuelvo a acostar tarde
            </div>
          )}
        </div>
        <div className="">
          <div className="grid md:grid-cols-4 gap-8 m-8">
            <Link
              to="/dashboard/chat"
              className=" transition-all ease-in-out shadow-md flex flex-col p-2 font-bold text-indigo-800 text-xl hover:shadow-xl hover:bg-gray-200 items-center justify-center rounded"
            >
              <span>
                <img
                  loading="lazy"
                  className="w-14"
                  src="/img/chat.png"
                  alt="Chat"
                />
              </span>
              Chat
            </Link>
            <Link
              to="/dashboard/misCursos"
              className=" transition-all ease-in-out shadow-md flex flex-col p-2 font-bold text-indigo-800 text-xl hover:shadow-xl hover:bg-gray-200 items-center justify-center rounded"
            >
              <span>
                <img
                  loading="lazy"
                  className="w-14"
                  src="/img/misCursos.png"
                  alt="Mis Cursos"
                />
              </span>
              Mis Cursos
            </Link>
          </div>
        </div>
        <div className="w-full sm:grid md:grid-cols-2 gap-2">
          <div className="max-h-full shadow-md m-2 p-2">
            <div className="my-4 text-center">
              <label
                htmlFor="itemsToShowEstudiantes"
                className="text-center font-bold text-xl text-gray-600 me-2"
              >
                No. de estudiantes por curso:
              </label>
              <select
                id="itemsToShowEstudiantes"
                value={itemsToShowEstudiantes}
                onChange={(e) =>
                  setItemsToShowEstudiantes(Number(e.target.value))
                }
                className="border rounded p-1 bg-indigo-800 text-white"
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={12}>12</option>
              </select>
            </div>
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
        </div>
      </div>
    </>
  );
}
