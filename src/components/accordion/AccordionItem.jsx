import useAccordion from "../../hooks/useAccordion";
import { useAuth } from "../../hooks/useAuth";
import useLeccion from "../../hooks/useLeccion";

export default function AccordionItem({ item }) {
  const { openIndex, toggleIndex } = useAccordion();
  const isOpen = Number(openIndex) == Number(item.id);
  const { handleOpenViewModal, handleOpenEditModal, deleteLeccion } =
    useLeccion();

  // Obtener la URL actual
  const url = window.location.pathname;

  // Dividir la URL en segmentos
  const segments = url.split("/");

  // Verificar si estás dentro del dashboard
  const isInDashboard = segments[1] === "dashboard";

  const { user } = useAuth({ middleware: "guest" });

  return (
    <div className="border-b">
      <button
        onClick={() => toggleIndex(item.id)}
        className="w-full flex justify-between text-left px-4 py-2"
      >
        <span className="font-semibold text-lg text-gray-700">
          {item.titulo}
        </span>
        <i className={`fa-solid fa-angles-${isOpen ? "up" : "down"}`}></i>
      </button>
      {isOpen && (
        <div className="px-4 pt-2 pb-8 relative">
          <p>{item.descripcion}</p>
          <div className="absolute right-0 bottom-0">
            {user &&
              Number(user.id) == Number(item.id_docente) &&
              isInDashboard && (
                <>
                  <button
                    onClick={() => deleteLeccion(item.id)}
                    className="p-1 text-red-800 transition-all ease-linear hover:scale-110"
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1 text-indigo-800 transition-all ease-linear hover:scale-110"
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </button>
                </>
              )}

            {user && isInDashboard && (
              <button
                onClick={() => handleOpenViewModal(item)}
                className="py-1 px-2 text-white bg-indigo-500 transition-all ease-linear hover:scale-110"
              >
                Ver
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
