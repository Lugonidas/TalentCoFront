import { useContext } from "react";
import TareaContext from "../context/TareaProvider";

const useTarea = () => {
  return useContext(TareaContext);
};

export default useTarea;
