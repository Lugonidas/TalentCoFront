import { useContext } from "react";
import AccordionContext from "../context/AccordionProvider";

const useAccordion = () => {
  return useContext(AccordionContext);
};

export default useAccordion;
