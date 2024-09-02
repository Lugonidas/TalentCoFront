import { Link } from "react-router-dom";
import AnimatedBackground from "../../components/AnimatedBackground";
import { Swiper, SwiperSlide } from "swiper/react";
import useCourse from "../../hooks/useCourse";

/* Paleta de colores */

/* 003249
007ea7
80ced7
9ad1d4
ccdbdc */

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "../../styles/spinner.scss";

// import required modules
import { Pagination } from "swiper/modules";
import { Autoplay } from "swiper/modules";

export default function Inicio() {
  const { cursos, loading } = useCourse();
  const apiUrl = import.meta.env.VITE_API_URL;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center">
        {/*       <AnimatedBackground /> */}

        <div className=" shadow-lg backdrop-blur mx-auto p-2 md:min-h-[50vh] flex flex-col justify-center my-10">
          <div className="p-2 text-center">
            <span className="text-xs md:text-sm shadow p-2 text-center text-gray-700 rounded-full">
              Descubre tu próximo curso
              <Link
                to="/cursos"
                className="text-indigo-800 font-bold text-sm ml-4 transition-all inline-block ease-out hover:-translate-y-1 hover:scale-110 "
              >
                Ver más &rarr;
              </Link>
            </span>
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-center my-6">
              ¿Estás listo para transformar tu futuro?
            </h1>
            <p className="text-center text-gray-700">
              Comienza tu viaje de aprendizaje hoy mismo. Regístrate ahora para
              acceder a nuestra amplia gama de cursos y lleva tus habilidades al
              siguiente nivel.
            </p>
            <div className="my-5 flex justify-center items-center gap-2">
              <Link
                to="/registro"
                className="text-gray-700 border-2 border-dashed py-2 border-indigo-800 font-bold px-4 rounded-full transition-all ease hover:border-2 hover:border-solid hover:py-2 hover:border-indigo-800 hover:bg-indigo-800 hover:text-white"
              >
                Registrarme
              </Link>
              <Link
                to="/cursos"
                className="bg-indigo-800 text-white py-2 px-4 font-bold rounded-full border-2 border-indigo-800 transition-all ease hover:border-2 hover:border-dashed hover:py-2 hover:border-indigo-800 hover:bg-white hover:text-gray-700"
              >
                Ver cursos <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-4xl text-indigo-800 font-black my-6">
            Nuestros Cursos
          </h2>
          <Swiper
            spaceBetween={20}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            loop={true}
            autoplay={{ delay: 2500 }}
            className="my-8"
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              },
            }}
          >
            {cursos.map((course) => (
              <SwiperSlide key={course.id}>
                <Link
                  to={`/cursos/show/${course.id}`}
                  className="course-card shadow-md block bg-white mb-10"
                >
                  <div className="px-4 py-2 h-60">
                    <img
                      src={`${apiUrl}/storage/${course?.imagen}`}
                      alt={course.titulo}
                      className="course-image w-full h-auto"
                      
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-lg font-bold ">{course.titulo}</h3>
                    <span className="text-xs bg-yellow-500 text-black p-0.5 font-bold">
                      {course.categoria.nombre}
                    </span>
                    <p className="text-gray-700">
                      Duración: {course.duracion} horas
                    </p>
                    <p className="text-gray-700">
                      Docente: {course.docente.name}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="min-h-64 w-full grid md:grid-cols-3 justify-center items-center md:px-6">
        <div className="md:col-span-1 hidden md:block">
          <img
            src="../img/logoTalentCo.svg"
            alt="Imagen logotipo TalentCo"
            className="w-full mx-auto"
          />
        </div>
        <div className="col-span-3 md:col-span-2 bg-white/50 backdrop-blur-md mx-auto p-4 md:min-h-[50vh] flex flex-col justify-center my-10 rounded-lg text-center text-gray-800">
          <h2 className="text-2xl md:text-4xl font-black text-gray-400 text-center my-6">
            ¿Por qué estudiar y aprender en{" "}
            <span className="text-indigo-600">Talent.Co</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-white">
            <div className="bg-indigo-400 rounded-md shadow-md group relative flex items-center justify-center min-h-40 md:min-h-56">
              <h3 className="text-white text-xl font-bold px-1 transition-opacity duration-300 group-hover:opacity-0 absolute">
                Acceso a Cursos Exclusivos y Actualizados
              </h3>
              <p className=" opacity-0 group-hover:opacity-100 px-1 group-hover:translate-y-0 transform translate-y-4 transition-opacity duration-300 absolute">
                Nuestros cursos están constantemente actualizados para reflejar
                las últimas tendencias y tecnologías.
              </p>
            </div>
            <div className="bg-indigo-400 rounded-md shadow-md  group relative flex items-center justify-center min-h-40 md:min-h-56 ">
              <h3 className="text-white text-xl font-bold px-1 transition-opacity duration-300 group-hover:opacity-0 absolute">
                Flexibilidad para Aprender a tu Ritmo
              </h3>
              <p className=" opacity-0 group-hover:opacity-100 px-1 group-hover:translate-y-0 transform translate-y-4 transition-opacity duration-300 absolute">
                Puedes acceder a los cursos desde cualquier dispositivo y
                adaptar el aprendizaje a tu horario.
              </p>
            </div>
            <div className="bg-indigo-400 rounded-md shadow-md group relative flex items-center justify-center min-h-40 md:min-h-56 ">
              <h3 className="text-white text-xl font-bold px-1 transition-opacity duration-300 group-hover:opacity-0 absolute">
                Oportunidades de Crecimiento Profesional
              </h3>
              <p className=" opacity-0 group-hover:opacity-100 px-1 group-hover:translate-y-0 transform translate-y-4 transition-opacity duration-300 absolute">
                Te ayudamos a destacar en el mercado laboral.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
