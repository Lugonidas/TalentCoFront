import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./context/UserProvider";
import { ChatProvider } from "./context/ChatProvider";
import { CourseProvider } from "./context/CourseProvider";
import { ComentarioProvider } from "./context/ComentarioProvider";
import { LeccionProvider } from "./context/LeccionProvider";
import { ArchivoProvider } from "./context/ArchivoProvider";
import { CategoriaProvider } from "./context/CategoriaProvider";
import Loader from "./components/Loader";
const InicioDashboard = lazy(() => import("./views/dashboard/Inicio"));
const InicioChat = lazy(() => import("./views/chat/Inicio"));
const InicioCourses = lazy(() => import("./views/courses/Inicio"));
const InicioCategorias = lazy(() => import("./views/categorias/Inicio"));
const InicioUsers = lazy(() => import("./views/users/Inicio"));
const Perfil = lazy(() => import("./views/users/Perfil"));
const Login = lazy(() => import("./views/auth/Login"));
const Registro = lazy(() => import("./views/auth/Registro"));
const Home = lazy(() => import("./views/home/Inicio"));
const Cursos = lazy(() => import("./views/home/Cursos"));
const ShowCourse = lazy(() => import("./views/courses/ShowCourse"));
const MisCursos = lazy(() => import("./views/courses/MisCursos"));
const CrearReunion = lazy(() => import("./views/reuniones/CrearReunion"));
const Inicio = lazy(() => import("./views/reuniones/Inicio"));
const ShowReunion = lazy(() => import("./views/reuniones/ShowReunion"));
const CrearReunionPro = lazy(() => import("./views/reuniones/CrearReunionPro"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <CourseProvider>
          <Layout />
        </CourseProvider>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "cursos",
        element: <Cursos />,
      },
      {
        path: "cursos/show/:courseId",
        element: (
          <Suspense fallback={<Loader />}>
            <ComentarioProvider>
              <LeccionProvider>
                <ShowCourse />,
              </LeccionProvider>
            </ComentarioProvider>
          </Suspense>
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
      <Suspense fallback={<Loader />}>
        <ProtectedRoute middleware="auth">
          <AuthLayout />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <UserProvider>
              <CourseProvider>
                <InicioDashboard />
              </CourseProvider>
            </UserProvider>
          </Suspense>
        ),
      },
      {
        path: "chat",
        element: (
          <Suspense fallback={<Loader />}>
            <ChatProvider>
              <InicioChat />
            </ChatProvider>
          </Suspense>
        ),
      },
      {
        path: "cursos",
        element: (
          <Suspense fallback={<Loader />}>
            <CourseProvider>
              <InicioCourses />
            </CourseProvider>
          </Suspense>
        ),
      },
      {
        path: "categorias",
        element: (
          <Suspense fallback={<Loader />}>
            <CategoriaProvider>
              <InicioCategorias />
            </CategoriaProvider>
          </Suspense>
        ),
      },
      {
        path: "cursos/show/:courseId",
        element: (
          <Suspense fallback={<Loader />}>
            <CourseProvider>
              <ComentarioProvider>
                <LeccionProvider>
                  <ArchivoProvider>
                    <ShowCourse />
                  </ArchivoProvider>
                </LeccionProvider>
              </ComentarioProvider>
            </CourseProvider>
          </Suspense>
        ),
      },
      {
        path: "misCursos",
        element: (
          <Suspense fallback={<Loader />}>
            <CourseProvider>
              <ComentarioProvider>
                <LeccionProvider>
                  <MisCursos />
                </LeccionProvider>
              </ComentarioProvider>
            </CourseProvider>
          </Suspense>
        ),
      },
      {
        path: "usuarios",
        element: (
          <Suspense fallback={<Loader />}>
            <UserProvider>
              <InicioUsers />
            </UserProvider>
          </Suspense>
        ),
      },
      {
        path: "perfil",
        element: (
          <Suspense fallback={<Loader />}>
            <UserProvider>
              <Perfil />
            </UserProvider>
          </Suspense>
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
