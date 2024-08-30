import { createContext, useState } from "react";

const AccordionContext = createContext();

const AccordionProvider = ({ children }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <AccordionContext.Provider value={{ openIndex, toggleIndex }}>
      {children}
    </AccordionContext.Provider>
  );
};

export { AccordionProvider, AccordionContext };
export default AccordionContext;
