import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Información de la Empresa */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">
              <Link to={"/"} className="text-yellow-600 font-black">
                TalentCo
              </Link>
            </h3>
            <p className="text-sm mb-4">
              Tu plataforma de cursos en línea para aprender y crecer
              profesionalmente.
            </p>
            <address className="text-sm">
              <p>Bogotá DC, Colombia</p>
              <p>Email: talentco@apitalentco.sociedad.la</p>
              <p>Teléfono: +57 318 281 2005</p>
            </address>
          </div>

          {/* Enlaces Rápidos */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2 text-yellow-600">
              Enlaces Rápidos
            </h3>
            <ul className="text-sm">
              <li>
                <Link
                  aria-label="Ir a los cursos"
                  to="/cursos"
                  className="hover:underline"
                >
                  Cursos
                </Link>
              </li>
              <li>
                <Link
                  aria-label="Ir a sobre nosotros"
                  to="/sobre-nosotros"
                  className="hover:underline"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  aria-label="Ir a contacto"
                  to="/contacto"
                  className="hover:underline"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  aria-label="Ir a privacidad"
                  to="/login"
                  className="hover:underline"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  aria-label="Ir a términos y condiciones"
                  to="/registro"
                  className="hover:underline"
                >
                  Registro
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2 text-yellow-600">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                aria-label="Ir a facebook"
                href="https://facebook.com"
                className="text-blue-600 hover:text-blue-800"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a
                aria-label="Ir a twitter"
                href="https://twitter.com"
                className="text-blue-400 hover:text-blue-600"
              >
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a
                aria-label="Ir a Linkedin"
                href="https://linkedin.com"
                className="text-blue-700 hover:text-blue-900"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a
                aria-label="Ir a instagram"
                href="https://instagram.com"
                className="text-pink-600 hover:text-pink-800"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 border-t border-gray-600 pt-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Talentos Colombia. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
