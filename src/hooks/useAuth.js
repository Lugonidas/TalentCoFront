import { useEffect, useState } from "react";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";

export const useAuth = ({ middleware, url }) => {
  const [errores, setErrores] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("AUTH_TOKEN");

  const navigate = useNavigate();
  const fetcher = (url) =>
    clienteAxios(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw Error(error?.response?.data?.errors);
      });

  const {
    data: user,
    error,
    mutate,
  } = useSWR(
    token ? "/user" : null, // Solo se ejecuta si el token existe
    fetcher
  );

  const login = async (datos) => {
    try {
      setLoading(true);
      const { data } = await clienteAxios.post("login", datos);
      localStorage.setItem("AUTH_TOKEN", data.token);
      mutate();
    } catch (errores) {
      setErrores(errores.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  const registro = async (datos) => {
    try {
      const { data } = await clienteAxios.post("registrarse", datos);
      localStorage.setItem("AUTH_TOKEN", data.token);
      // Solo mostrar el mensaje de éxito si no hay errores
      Swal.fire({
        title: "Registro Exitoso",
        text: "Hemos enviado un correo de verificación, por favor revisa tu bandeja de entrada.",
        icon: "success",
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        // Redirigir al login después de aceptar el mensaje
        navigate("/login");
      });
      setErrores([]);
      mutate();
    } catch (error) {
      setErrores(error.response.data.errors);
    }
  };

  const logout = async () => {
    try {
      await clienteAxios.post("/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("AUTH_TOKEN");
      navigate("/login");
      mutate(null, false);
    } catch (error) {
      console.error("Error:", Object.values(error.response.data.errors));
    }
  };

  useEffect(() => {
    if (middleware == "guest" && user) {
      navigate(url); // Redirige al dashboard si el usuario está autenticado como invitado
    }
    if (middleware == "auth" && error) {
      navigate("/login"); // Redirige al login si hay un error de autenticación
    }
  }, [user, error]);

  return {
    login,
    registro,
    logout,
    mutate,
    user,
    error,
    errores,
    isAdmin: Number(user?.id_rol) == 1,
    isTeacher: Number(user?.id_rol) == 3,
    isStudent: Number(user?.id_rol) == 2,
    loading,
  };
};
