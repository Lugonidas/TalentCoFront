import CreateCourse from "./CreateCourse";
import EditCourse from "./EditCourse";
import Modal from "../../components/Modal";
import CoursesList from "./CoursesList";
import FilterCategory from "../../components/FilterCategory";
import useCourse from "../../hooks/useCourse";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/Loader";

export default function Inicio() {
  const { user } = useAuth({ middleware: "guest" });
  const {
    createModal,
    editModal,
    handleOpenCreateModal,
    loading,
    selectedCourse,
  } = useCourse();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {createModal && (
        <Modal>
          <div className="relative w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <CreateCourse />
          </div>
        </Modal>
      )}

      {/*       {
        viewModal && selectedCourse && (
          <Modal>
            <div className="relative mx-auto my-4 p-6 bg-white shadow-md text-center opacity-100">
              <ShowCourse />
            </div>
          </Modal>
        )
      } */}

      {editModal && selectedCourse && (
        <Modal>
          <div className="relative w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <EditCourse />
          </div>
        </Modal>
      )}

      <div className="mx-auto px-2 h-screen overflow-hidden overflow-y-scroll">
        <div className="px-2">
          <h1 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
            Listado Cursos
          </h1>
          {user && (user.id_rol == 1 || user.id_rol == 3) && (
            <>
              <button
                className="my-4 py-1 px-2 bg-purple-800 text-white transition-all ease-in-out hover:scale-105"
                onClick={handleOpenCreateModal}
              >
                Agregar Curso
              </button>
            </>
          )}

          <div>
            <FilterCategory />
          </div>

          <div className="my-2">
            <CoursesList />
          </div>
        </div>
      </div>
    </>
  );
}
