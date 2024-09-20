import { useContext } from "react";
import RespuestaEstudianteContext from "../context/RespuestaEstudianteProvider";

const useRespuestaEstudiante = () => {
  return useContext(RespuestaEstudianteContext);
};

export default useRespuestaEstudiante;
