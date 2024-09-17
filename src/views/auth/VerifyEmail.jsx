import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import clienteAxios from "../../config/axios";

export default function VerifyEmail() {
  const { id, hash } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await clienteAxios.get(`/verify-email/${id}/${hash}`, {
          params: {
            expires: new URLSearchParams(window.location.search).get("expires"),
            signature: new URLSearchParams(window.location.search).get(
              "signature"
            ),
          },
        });
        setStatus("Your email has been verified successfully!");
        navigate("/login");
      } catch (error) {
        setStatus("Verification failed. Please try again.");
      }
    };

    verifyEmail();
  }, [id, hash, navigate]);

  return (
    <div className="container">
      <h1>Correo verificado exitosamente</h1>
      <p>{status}</p>
    </div>
  );
}
