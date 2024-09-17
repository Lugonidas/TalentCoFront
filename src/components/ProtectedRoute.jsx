import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import Loader from "../components/Loader";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth({ middleware: "auth" });

  const token = localStorage.getItem("AUTH_TOKEN");

  useEffect(() => {
    // Redirigir solo si no hay token y el estado de carga ya ha terminado
    if (!loading && !token) {
      navigate("/login");
    }
  }, [loading, token, navigate]);

  // Si no hay usuario, pero aún estamos cargando, mostramos algo de carga
  if (loading || !user) {
    return <Loader />; // Indicador de carga mientras se resuelve la autenticación
  }

  // Si el token está presente pero el user aún no se ha cargado completamente
  if (token && !user) {
    return <Loader />; // Otra opción de visualización mientras se verifica el usuario
  }

  return children; // Devuelve el contenido protegido solo si todo está validado
}
