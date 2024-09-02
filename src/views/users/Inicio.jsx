import CreateUser from "./CreateUser"; // Asegúrate de tener la ruta correcta
import ShowUser from "./ShowUser"; // Asegúrate de tener la ruta correcta
import Modal from "../../components/Modal"; // Asegúrate de tener la ruta correcta
import useUser from "../../hooks/useUser";
import UsersList from "./UsersList";
import { useAuth } from "../../hooks/useAuth";
import EditUser from "./EditUser";
import "../../styles/spinner.scss";

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

  // Dentro de tu componente ShowCourse
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <>
      {createModal && (
        <Modal>
          <div className="relative w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <CreateUser />
          </div>
        </Modal>
      )}

      {viewModal && selectedUser && (
        <Modal>
          <div className="relative mx-auto my-4 p-6 bg-white shadow-md text-center opacity-100">
            <ShowUser />
          </div>
        </Modal>
      )}

      {editModal && selectedUser && (
        <Modal>
          <div className="relative w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <EditUser />
          </div>
        </Modal>
      )}

      <div className="mx-auto px-2 h-screen overflow-hidden overflow-y-scroll">
        {user && user.id_rol == 1 && (
          <div className="px-2 my-2">
            <h1 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
              Listado Usuarios
            </h1>
            <button
              className="my-4 py-1 px-2 bg-indigo-800 text-white"
              onClick={handleOpenCreateModal}
            >
              <i className="fa-solid fa-user-plus"></i> Agregar Usuario
            </button>
            <UsersList />
          </div>
        )}
      </div>
    </>
  );
}
