import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Loader from "../../components/Loader";

const VerifyEmail = () => {
  const { id, hash } = useParams(); 
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const VerifyEmail = async () => {
      try {
        setLoading(true);
        const response = await clienteAxios.get(`/verify/${id}/${hash}`);

        setMessage(response.data.message);

        
        setTimeout(() => {
          navigate("login");
        }, 3000);
      } catch (error) {
        setMessage(
          "Error al verificar la cuenta, el enlace es inválido o ha expirado."
        );
        {
          setTimeout(() => {
            navigate("login");
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    VerifyEmail();
  }, [id, hash, navigate]);

  if (loading) {
    return (
      <div className="bg-indigo-300 min-h-screen w-full flex flex-col gap-4 justify-center items-center">
        <h1 className="text-indigo-600 font-bold text-6xl mb-4">TalentCo</h1>

        <p className="text-white font-black text-xl">
          Verificando la cuenta...
        </p>
        <Loader clase="h-full" />
      </div>
    );
  }

  return (
    <div className="bg-indigo-300 min-h-screen w-full flex flex-col gap-4 justify-center items-center">
      <h1 className="text-indigo-600 font-bold text-6xl mb-4">TalentCo</h1>
      <p className="text-white font-black text-2xl">{message}</p>
      <p className="text-indigo-500 font-black text-xl">
        Serás redirigido en unos momentos...
      </p>
      <Loader clase="h-full" />
    </div>
  );
};

export default VerifyEmail;
