import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Inicio() {
  const navigate = useNavigate();
  const [reunionId, setReunionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isJoinButtonDisabled, setIsJoinButtonDisabled] = useState(true);

  const generarEnlaceReunion = () => {
    return `talentco${Date.now()}${Math.floor(Math.random() * 10000)}`;
  };

  const handleCreateMeetingJitsiPro = () => {
    setLoading(true);
    const link = generarEnlaceReunion();
    navigate(`/dashboard/reuniones/crear-reunion-pro/${link}`);
    setLoading(false);
  };
  const handleCreateMeeting = () => {
    setLoading(true);
    const link = generarEnlaceReunion();
    navigate(`/dashboard/reuniones/crear-reunion/${link}`);
    setLoading(false);
  };

  const handleJoinMeeting = () => {
    if (reunionId && reunionId.startsWith("talentco")) {
      navigate(`/dashboard/reuniones/obtener-reunion/${reunionId}`);
    } else {
      Swal.fire({
        title: "Enlace no válido",
        text: "El enlace debe comenzar con 'talentco'.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    // Validar si el botón debe estar habilitado o deshabilitado
    setIsJoinButtonDisabled(!reunionId.startsWith("talentco"));
  }, [reunionId]);

  const cameraStyle = {
    position: "absolute",
    width: "8rem",
    left: "-8rem",
    top: "-4rem",
    animation: "cameraShake 5s infinite",
  };

  const keyframes = `
    @keyframes cameraShake {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      10%, 30%, 50%, 70%, 90% {
        transform: translate(-2px, -2px) rotate(-2deg);
      }
      20%, 40%, 60%, 80% {
        transform: translate(2px, 2px) rotate(1deg);
      }
    }
  `;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 bg-gray-100 p-6 relative">
      <style>{keyframes}</style>
      <h1 className="text-3xl font-extrabold text-indigo-800">Reuniones</h1>
      <p className="text-xl text-gray-700 text-center max-w-2xl relative">
        ¡Bienvenido a nuestro espacio de reuniones! Puedes crear una nueva
        reunión para comenzar una conversación o unirte a una existente
        introduciendo el código de reunión. ¡Estamos emocionados de que formes
        parte de esta experiencia!
        <img
          loading="lazy"
          src="/img/camara.png"
          alt="Cámara"
          style={cameraStyle}
        />
      </p>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* <div>
          <button
            onClick={handleCreateMeetingJitsiPro}
            className="bg-indigo-600 text-white font-semibold py-2 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
            disabled={loading}
          >
            <i className="fa-solid fa-video me-2"></i>
            {loading ? "Creando..." : "Crear Nueva Reunión Pro"}
          </button>
        </div> */}
        <div>
          <button
            onClick={handleCreateMeeting}
            className="bg-indigo-600 text-white font-semibold py-2 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
            disabled={loading}
          >
            <i className="fa-solid fa-video me-2"></i>
            {loading ? "Creando..." : "Crear Nueva Reunión"}
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Introduce el código de la reunión"
            value={reunionId}
            onChange={(e) => setReunionId(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-4 text-lg w-64 focus:outline-none focus:ring-0"
          />
          <button
            onClick={handleJoinMeeting}
            className={`${
              isJoinButtonDisabled
                ? " text-gray-500 cursor-not-allowed"
                : " text-indigo-800 hover:text-white hover:bg-indigo-700"
            } font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300`}
            disabled={isJoinButtonDisabled}
          >
            Unirse a la Reunión
          </button>
        </div>
      </div>
    </div>
  );
}
