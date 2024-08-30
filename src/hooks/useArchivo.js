import { useContext } from "react"
import ArchivoContext from "../context/ArchivoProvider"

const useArchivo = () => {
    return useContext(ArchivoContext)
}

export default useArchivo