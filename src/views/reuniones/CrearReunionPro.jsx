import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function CrearReunionPro() {
  const { user } = useAuth({ middleware: "auth" });

  if (!user) {
    return <p>Loading...</p>;
  }

  useEffect(() => {
    // Load the Jitsi Meet API script
    const script = document.createElement('script');
    script.src = 'https://8x8.vc/vpaas-magic-cookie-8abc5c7b7e6b43beba8c92e05c2a13ec/external_api.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const api = new window.JitsiMeetExternalAPI("8x8.vc", {
        roomName:
          `vpaas-magic-cookie-8abc5c7b7e6b43beba8c92e05c2a13ec/${user?.name}`,
        parentNode: document.querySelector("#jaas-container"),
        // Uncomment and replace with your JWT if needed
        // jwt: "YOUR_JWT_HERE"
      });
    };

    // Cleanup script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ height: '100%' }}>
      <div id="jaas-container" style={{ height: '100%' }}></div>
    </div>
  );
}
