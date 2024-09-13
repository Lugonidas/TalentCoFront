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
import CrearReunionPro from "./views/reuniones/CrearReunionPro";
import { UserProvider } from "./context/UserProvider";
import { ChatProvider } from "./context/ChatProvider";
import { CourseProvider } from "./context/CourseProvider";
import { ComentarioProvider } from "./context/ComentarioProvider";
import { LeccionProvider } from "./context/LeccionProvider";
import { ArchivoProvider } from "./context/ArchivoProvider";

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
        element: (
          <ComentarioProvider>
            <LeccionProvider>
              <ShowCourse />,
            </LeccionProvider>
          </ComentarioProvider>
        ),
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
    element: (
      <ProtectedRoute middleware="auth">
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,

        element: (
          <UserProvider>
            <InicioDashboard />
          </UserProvider>
        ),
      },
      {
        path: "chat",
        element: (
          <ChatProvider>
            <InicioChat />
          </ChatProvider>
        ),
      },
      {
        path: "cursos",
        element: (
          <CourseProvider>
            <InicioCourses />
          </CourseProvider>
        ),
      },
      {
        path: "cursos/show/:courseId",
        element: (
          <ComentarioProvider>
            <LeccionProvider>
              <ArchivoProvider>
                <ShowCourse />
              </ArchivoProvider>
            </LeccionProvider>
          </ComentarioProvider>
        ),
      },
      {
        path: "misCursos",
        element: (
          <ComentarioProvider>
            <LeccionProvider>
              <MisCursos />
            </LeccionProvider>
          </ComentarioProvider>
        ),
      },
      {
        path: "usuarios",
        element: (
          <UserProvider>
            <InicioUsers />
          </UserProvider>
        ),
      },
      {
        path: "perfil",
        element: (
          <UserProvider>
            <Perfil />
          </UserProvider>
        ),
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
        path: "reuniones/crear-reunion-pro/:reunionId",
        element: <CrearReunionPro />,
      },
      {
        path: "reuniones/obtener-reunion/:reunionId",
        element: <ShowReunion />,
      },
    ],
  },
]);

export default router;
