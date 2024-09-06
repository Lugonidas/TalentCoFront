import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {

  const navigate = useNavigate(); // Hook para la navegación

  const { user } = useAuth({ middleware: "auth" });
  
  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redireccionar si no hay usuario
    }
  }, [user, navigate]); 

  return children;
}
