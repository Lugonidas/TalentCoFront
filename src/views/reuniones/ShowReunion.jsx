import { JitsiMeeting } from "@jitsi/react-sdk";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useRef } from "react";

export default function ShowReunion() {
  const { user } = useAuth({ middleware: "auth" });
  const apiRef = useRef();
  const { reunionId } = useParams();

  const handleApiReady = (apiObj) => {
    apiRef.current = apiObj;
    apiRef.current.on("videoConferenceJoined", () => {
      apiRef.current.executeCommand("password", "reunion-segura");
      apiRef.current.executeCommand("toggleLobby", true);
    }); 
  };

  const handleJitsiIFrameRef = (iframeRef) => {
    iframeRef.style.border = "none";
    iframeRef.style.background = "#f4f4f4";
    iframeRef.style.height = "100vh";
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full h-screen">
      <JitsiMeeting
        roomName={reunionId}
        /*           jwt={jwt} */
        onApiReady={handleApiReady}
        getIFrameRef={handleJitsiIFrameRef}
        userInfo={{
          displayName: `${user.name} ${user.apellido}`,
          email: user.email,
        }}
      />
    </div>
  );
}
