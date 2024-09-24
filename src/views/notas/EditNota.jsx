import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useTarea from "../../hooks/useTarea";

export default function EditNota({
  isOpen,
  onClose,
  estudiante,
  notaEstudiante,
  tarea,
}) {
  const [nota, setNota] = useState(notaEstudiante);

  const { updateNota, errores } = useTarea();

  const actulizarNota = {
    id_evaluacion: tarea.id,
    id_estudiante: estudiante.id,
    nota: nota,
  };

  useEffect(() => {
    if (estudiante) {
      setNota(notaEstudiante); // Usar la nota del estudiante que fue seleccionada
    }
  }, [estudiante, notaEstudiante]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nota < 0 || nota > 100) {
      alert("La nota debe estar entre 0 y 100.");
      return;
    }

    try {
      await updateNota(actulizarNota);
      onClose();
    } catch {
      console.log(errores);
    }
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="bg-[rgba(0,0,0,0.1)] backdrop-blur absolute top-0 w-full h-full p-2 flex items-center">
        <div className="modal-content p-2 bg-white w-full">
          <h2 className="text-base font-black uppercase text-center mb-4 text-indigo-800">
            Actualizar nota
          </h2>
          <div className="md:border-r-2">
            <strong className="text-xs">Nombre Completo</strong>
            <p className="capitalize">
              {estudiante.name} {estudiante.apellido}
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <label htmlFor="nota" className="font-bold">
                Nota:
              </label>
              <input
                className="border-b"
                type="number"
                name="nota"
                id="nota"
                value={nota}
                onChange={(e) => setNota(String(e.target.value))}
                placeholder="Nota trabajo"
                max="100"
                required
              />

              {/*             {errores?.nota && (
                  <p className="p-2 bg-red-100 text-red-800 font-bold border-l-2 border-red-800 mt-2 rounded-md">
                    {errores.nota}
                  </p>
                )} */}
            </div>
            <div className="my-2 flex flex-col gap-1">
              <motion.button
                type="submit" // Asegúrate de que solo se envíe la nota del estudiante en esta función
                className="py-1 px-2 bg-indigo-800 text-white font-bold text-xs rounded-sm hover:cursor-pointer"
                whileTap={{ scale: 0.95 }}
              >
                Actualizar
              </motion.button>
              <motion.button
                onClick={onClose}
                type="button" // Asegúrate de que solo se envíe la nota del estudiante en esta función
                className="py-1 px-2 bg-red-800 text-white font-bold text-xs rounded-sm hover:cursor-pointer"
                whileTap={{ scale: 0.95 }}
              >
                Cerrar
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
