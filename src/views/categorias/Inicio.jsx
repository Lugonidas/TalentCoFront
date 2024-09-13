import useCategoria from "../../hooks/useCategoria";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import CreateCategoria from "./CreateCategoria";
import Modal from "../../components/Modal";
import EditCategoria from "./EditCategoria";

export default function Inicio() {
  const { isAdmin } = useAuth({ middleware: "auth" });
  const { categorias, loading, handleOpenCreateModal, handleOpenEditModal, createModal, editModal, searchTerm, setSearchTerm} =
    useCategoria();

  if (loading || !isAdmin) {
    return <Loader />;
  }

  return (
    <>
      {createModal && (
        <Modal>
          <div className="relative md:w-2/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <CreateCategoria />
          </div>
        </Modal>
      )}
      {editModal && (
        <Modal>
          <div className="relative md:w-2/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <EditCategoria />
          </div>
        </Modal>
      )}

      <div className="mx-auto p-4 h-screen overflow-hidden overflow-y-scroll">
        <h1 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
          Categorias
        </h1>
        <button
          className="my-4 py-1 px-2 bg-indigo-800 text-white transition-all ease-in-out hover:scale-105"
          onClick={handleOpenCreateModal}
        >
          <i className="fa-solid fa-plus pe-2"></i>
          Agregar Categoria
        </button>

        <div className="flex items-center mb-4 gap-2 border border-gray-300">
          <i className="fa-brands fa-searchengin text-white text-xl bg-gray-600 px-3 py-2"></i>
          <input
            type="text"
            placeholder="Buscar categoria..."
            value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full focus:outline-none focus:border-indigo-800"
          />
        </div>

        {categorias.length > 0 ? (
          <ul className="grid md:grid-cols-3 gap-4">
            {categorias.map((categoria) => (
              <li
                key={categoria.id}
                className="flex items-center justify-between gap-2 p-2 shadow-md transition-all ease delay-75 hover:scale-105"
              >
                <strong>{categoria.nombre}</strong>
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleOpenEditModal(categoria)}
                  >
                    <i className="fa-solid fa-pen text-indigo-800 p-2"></i>
                  </motion.button>
                  {/* <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteCourse(categoria.id)}
                  >
                    <i className="fa-solid fa-trash text-red-600 p-2"></i>
                  </motion.button> */}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay categorías disponibles.</p>
        )}
      </div>
    </>
  );
}
