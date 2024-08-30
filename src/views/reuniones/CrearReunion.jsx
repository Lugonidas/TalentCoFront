import { useRef, useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

export default function CrearReunion() {
  const { user } = useAuth({ middleware: "auth" });
  const apiRef = useRef();
  const [modalOpen, setModalOpen] = useState(true);
  const { reunionId } = useParams();

  const handleApiReady = (apiObj) => {
    apiRef.current = apiObj;
    apiRef.current.on("videoConferenceJoined", () => {
      apiRef.current.executeCommand("password", "reunion-segura");
      apiRef.current.executeCommand("toggleLobby", true);
      setModalOpen(true); // Abrir el modal cuando la conferencia está lista
    });
  };

  const handleJitsiIFrameRef = (iframeRef) => {
    iframeRef.style.border = "none";
    iframeRef.style.background = "#3d3d3d";
    iframeRef.style.height = "100vh";
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(reunionId)
      .then(() =>
        Swal.fire({
          title: "Enlace Copiado",
          text: "El enlace ha sido copiado correctamente",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setModalOpen(false);
        })
      )
      .catch((err) => console.error("Error copying link: ", err));
  };

  const closeModal = () => setModalOpen(false);

  if (!user) {
    return <p>Loading...</p>;
  }

  if (!reunionId) {
    return <p>No meeting link available</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-full min-h-screen">
        <JitsiMeeting
          roomName={reunionId}
          onApiReady={handleApiReady}
          getIFrameRef={handleJitsiIFrameRef}
          userInfo={{
            displayName: `${user.name} ${user.apellido}`,
            email: user.email,
          }}
        />

        {modalOpen && (
          <div className="absolute p-4 inset-0 bg-gray-800 bg-opacity-50 flex items-end justify-start z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative z-50">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
              <h3 className="text-3xl font-extrabold text-indigo-800 mb-2">
                Reunión Creada
              </h3>
              <span className="text-xl font-semibold mb-8 inline-block">
                Por:{" "}
                <strong className="text-indigo-500">
                  {user.name} {user.apellido}
                </strong>
              </span>
              <p className="">Comparte este enlace:</p>
              <div className="flex items-center space-x-2">
                <span className="text-indigo-500 font-bold">{reunionId}</span>
                <button
                  onClick={copyToClipboard}
                  className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
