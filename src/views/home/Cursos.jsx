import FilterCategory from "../../components/FilterCategory";
import CoursesList from "../courses/CoursesList";
export default function Cursos() {
  return (
    <>
      <div className="mx-auto min-h-screen">
        <div className=" my-2">
          <h1 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
            Cursos
          </h1>

          <div className="pb-4">
            <FilterCategory />
          </div>

          <CoursesList />
        </div>
      </div>
    </>
  );
}
