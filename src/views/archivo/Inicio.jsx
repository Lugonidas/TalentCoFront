import CreateCourse from "./CreateLeccion";
import EditCourse from "./EditCourse";
import Modal from "../../components/Modal";
import CoursesList from "./CoursesList";
import ShowCourse from "./ShowCourse";
import FilterCategory from "../../components/FilterCategory";
import useCourse from "../../hooks/useCourse";
import { useAuth } from "../../hooks/useAuth";

export default function Inicio() {
  const { user } = useAuth({ middleware: "guest" });
  const {
    createModal,
    viewModal,
    editModal,
    handleOpenCreateModal,
    loading,
    selectedCourse,
  } = useCourse();

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
            <CreateCourse />
          </div>
        </Modal>
      )}

      {viewModal && selectedCourse && (
        <Modal>
          <div className="relative mx-auto my-4 p-6 bg-white shadow-md text-center opacity-100">
            <ShowCourse />
          </div>
        </Modal>
      )}

      {editModal && selectedCourse && (
        <Modal>
          <div className="relative w-3/4 mx-auto my-4 p-6 bg-white shadow-md opacity-100">
            <EditCourse />
          </div>
        </Modal>
      )}

      <div className="mx-auto px-2 h-screen overflow-hidden overflow-y-scroll">
        <div className="px-2 border border-dotted my-2">
          <h1 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
            Listado Cursos
          </h1>

          {/* Filtrado Categorias */}
          <FilterCategory />

          {user && (user.id_rol == 1 || user.id_rol == 2) && (
            <>
              <button
                className="my-4 py-1 px-2 bg-purple-800 text-white transition-all ease-in-out hover:scale-105"
                onClick={handleOpenCreateModal}
              >
                Agregar Curso
              </button>

              <CoursesList />
            </>
          )}

          {user && user.id_rol == 3 && <CoursesList />}
        </div>
      </div>
    </>
  );
}
