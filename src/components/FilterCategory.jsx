import { useContext } from "react"
import CourseContext from "../context/CourseProvider"

export default function FilterCategory() {

    const { selectedCategoria, categoriasCursos, handleClickCategoria } = useContext(CourseContext)

    return (

        <>
            {categoriasCursos.length > 0 && (
                <>
                    <strong>Filtros por categoria:</strong>
                    <ul className='flex flex-wrap gap-1 items-start'>
                        <button
                            onClick={() => handleClickCategoria(null)}
                            className={`py-0.5 px-2 border border-dotted border-indigo-800 transition-all ease-linear hover:cursor-pointer ${selectedCategoria == null
                                ? 'bg-indigo-800 text-white'
                                : 'hover:bg-indigo-800 hover:text-white'
                                }`}
                        >
                            Mostrar Todos
                        </button>
                        {categoriasCursos.map((categoria) => (
                            <button
                                key={categoria.id}
                                onClick={() => handleClickCategoria(categoria.id)}
                                className={`py-0.5 px-2 border border-dotted border-indigo-800 transition-all ease-linear hover:cursor-pointer ${selectedCategoria == categoria.id
                                    ? 'bg-indigo-800 text-white'
                                    : 'hover:bg-indigo-800 hover:text-white'
                                    }`}
                            >
                                {categoria.nombre}
                            </button>
                        ))}
                    </ul>
                </>
            )
            }
        </>
    )
}
