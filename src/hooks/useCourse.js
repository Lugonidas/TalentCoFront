import { useContext } from "react"
import CourseContext from "../context/CourseProvider"

const useCourse = () => {
    return useContext(CourseContext)
}

export default useCourse