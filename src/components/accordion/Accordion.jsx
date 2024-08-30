import AccordionItem from "./AccordionItem";
import { AccordionProvider } from "../../context/AccordionProvider";

export default function Accordion({ items }) {

  items.sort((a, b) => a.orden - b.orden);
  return (
    <AccordionProvider>
      <div className="rounded-lg shadow-md">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </AccordionProvider>
  );
}
