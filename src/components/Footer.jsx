import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Información de la Empresa */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Talent.Co</h3>
            <p className="text-sm mb-4">
              Tu plataforma de cursos en línea para aprender y crecer profesionalmente.
            </p>
            <address className="text-sm">
              <p>Bogotá DC, Colombia</p>
              <p>Email: contacto@talentoscolombia.com</p>
              <p>Teléfono: +57 318 281 2005</p>
            </address>
          </div>

          {/* Enlaces Rápidos */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Enlaces Rápidos</h3>
            <ul className="text-sm">
              <li><Link to="/cursos" className="hover:underline">Cursos</Link></li>
              <li><Link to="/about" className="hover:underline">Sobre Nosotros</Link></li>
              <li><Link to="/contact" className="hover:underline">Contacto</Link></li>
              <li><Link to="/privacy" className="hover:underline">Política de Privacidad</Link></li>
              <li><Link to="/terms" className="hover:underline">Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-blue-600 hover:text-blue-800">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" className="text-blue-400 hover:text-blue-600">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" className="text-blue-700 hover:text-blue-900">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="https://instagram.com" className="text-pink-600 hover:text-pink-800">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Boletín Informativo */}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-bold mb-2">Suscríbete</h3>
            <p className="text-sm mb-4">
              Suscríbete a nuestro boletín para recibir las últimas actualizaciones y ofertas.
            </p>
            <form action="#" method="POST">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full px-3 py-2 mb-2 text-gray-800 rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-800"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-8 border-t border-gray-600 pt-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Talentos Colombia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
