import { useContext } from "react"
import LeccionContext from "../context/LeccionProvider"

const useLeccion = () => {
    return useContext(LeccionContext)
}

export default useLeccion