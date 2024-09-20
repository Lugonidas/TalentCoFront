export default function Nosotros() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-black uppercase text-center mb-4 text-indigo-800">
            Sobre Nosotros
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Conoce más sobre nuestra historia, visión y propósito en TalentCo
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-black uppercase mb-4 text-gray-600">
            Quiénes Somos
          </h3>
          <p className="mt-4 text-gray-600">
            En TalentCo, somos una plataforma dedicada a proporcionar
            oportunidades de aprendizaje de alta calidad para personas de todo
            el mundo. Creemos en la educación accesible y en ayudar a nuestros
            usuarios a adquirir nuevas habilidades que les permitan crecer
            personal y profesionalmente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-black uppercase mb-4 text-gray-600">
              Nuestra Misión
            </h3>
            <p className="mt-4 text-gray-600">
              Nuestra misión es ofrecer educación en línea accesible y de alta
              calidad, empoderando a las personas a alcanzar sus metas
              académicas y profesionales desde cualquier lugar del mundo.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase mb-4 text-gray-600">
              Nuestra Visión
            </h3>
            <p className="mt-4 text-gray-600">
              Aspiramos a ser la plataforma educativa líder a nivel global,
              fomentando el aprendizaje continuo y ayudando a construir una
              comunidad que valore el conocimiento y la innovación.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-black text-center uppercase mb-4 text-indigo-800">
            Nuestros Valores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="p-6 shadow-indigo-200 rounded-lg shadow-md">
              <h4 className="text-2xl font-black uppercase mb-4 text-gray-600">Innovación</h4>
              <p className="mt-4 text-gray-600">
                Nos esforzamos por mejorar continuamente nuestra plataforma,
                integrando las últimas tecnologías para brindar una experiencia
                de aprendizaje única y eficiente.
              </p>
            </div>

            <div className="p-6 shadow-indigo-200 rounded-lg shadow-md">
              <h4 className="text-2xl font-black uppercase mb-4 text-gray-600">Calidad</h4>
              <p className="mt-4 text-gray-600">
                Todos nuestros cursos están cuidadosamente diseñados para
                garantizar que cada estudiante obtenga el máximo valor en su
                proceso de aprendizaje.
              </p>
            </div>

            <div className="p-6 shadow-indigo-200 rounded-lg shadow-md">
              <h4 className="text-2xl font-black uppercase mb-4 text-gray-600">
                Accesibilidad
              </h4>
              <p className="mt-4 text-gray-600">
                Creemos que la educación debe ser accesible para todos, sin
                importar la ubicación, el contexto o las circunstancias. Nuestra
                plataforma está diseñada para facilitar el acceso al
                conocimiento.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/contacto"
            className="bg-indigo-700 text-white py-3 px-6 rounded-full text-lg hover:bg-indigo-800"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </section>
  );
}
