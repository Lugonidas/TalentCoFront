import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import InicioDashboard from "./views/dashboard/Inicio";
import InicioChat from "./views/chat/Inicio";
import InicioCourses from "./views/courses/Inicio";
import InicioUsers from "./views/users/Inicio";
import Perfil from "./views/users/Perfil";
import Login from "./views/auth/Login";
import Registro from "./views/auth/Registro";
import Home from "./views/home/Inicio";
import Cursos from "./views/home/Cursos";
import ShowCourse from "./views/courses/ShowCourse";
import MisCursos from "./views/courses/MisCursos";
import CrearReunion from "./views/reuniones/CrearReunion";
import Inicio from "./views/reuniones/Inicio";
import ShowReunion from "./views/reuniones/ShowReunion";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "cursos",
        element: <Cursos />,
      },
      {
        path: "cursos/show/:courseId",
        element: <ShowCourse />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "registro",
        element: <Registro />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <ProtectedRoute middleware="auth"><AuthLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <InicioDashboard />,
      },
      {
        path: "chat",
        element: <InicioChat />,
      },
      {
        path: "cursos",
        element: <InicioCourses />,
      },
      {
        path: "cursos/show/:courseId",
        element: <ShowCourse />,
      },
      {
        path: "misCursos",
        element: <MisCursos />,
      },
      {
        path: "usuarios",
        element: <InicioUsers />,
      },
      {
        path: "perfil",
        element: <Perfil />,
      },
      {
        path: "reuniones",
        element: <Inicio />,
      },
      {
        path: "reuniones/crear-reunion/:reunionId",
        element: <CrearReunion />,
      },
      {
        path: "reuniones/obtener-reunion/:reunionId",
        element: <ShowReunion />,
      },
    ],
  },
]);

export default router;
