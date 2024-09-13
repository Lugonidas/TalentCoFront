import CreateUser from "./CreateUser"; // Asegúrate de tener la ruta correcta
import ShowUser from "./ShowUser"; // Asegúrate de tener la ruta correcta
import Modal from "../../components/Modal"; // Asegúrate de tener la ruta correcta
import useUser from "../../hooks/useUser";
import UsersList from "./UsersList";
import { useAuth } from "../../hooks/useAuth";
import EditUser from "./EditUser";
import "../../styles/spinner.scss";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";

export default function Inicio() {
  const {
    createModal,
    viewModal,
    editModal,
    handleOpenCreateModal,
    loading,
    selectedUser,
  } = useUser();

  const { user } = useAuth({ middleware: "auth" });

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {createModal && (
        <Modal>
          <motion.div
            className="relative w-3/4 mx-auto my-4 p-6 bg-white shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <CreateUser />
          </motion.div>
        </Modal>
      )}

      {viewModal && selectedUser && (
        <Modal>
          <ShowUser />
        </Modal>
      )}

      {editModal && selectedUser && (
        <Modal>
          <motion.div
            className="relative w-3/4 mx-auto my-4 p-6 bg-white shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <EditUser />
          </motion.div>
        </Modal>
      )}

      <motion.div
        className="mx-auto px-2 h-screen overflow-hidden overflow-y-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {user && user.id_rol === 1 && (
          <div className="px-2 my-2">
            <h1 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
              Listado Usuarios
            </h1>
            <motion.button
              className="my-4 py-1 px-2 bg-indigo-800 text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenCreateModal}
            >
              <i className="fa-solid fa-user-plus"></i> Agregar Usuario
            </motion.button>
            <UsersList />
          </div>
        )}
      </motion.div>
    </>
  );
}
