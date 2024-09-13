import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Navegacion() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const location = useLocation();

    const isActive = (path) => {
        return location.pathname == path;
    };

    return (
        <nav className={`${isOpen ? 'relative' : ' '} flex justify-between items-center gap-1 w-full p-4 border-b-2 border-dashed border-indigo-800 bg-white shadow-md`}>
            <div className="flex items-center">
                <Link to="/" className="flex items-center gap-1 ">
                    <img loading='lazy' src="/icon.png" alt="Imagen Logotipo Talentos Colombia" className="h-10 w-10" />
                    <span className="text-indigo-800 text-2xl font-bold">Talent<span className="text-pink-500">.</span>Co</span>
                </Link>
            </div>
            <div className="flex md:hidden">
                <button onClick={toggleMenu} className="text-indigo-800 focus:outline-none">
                    <i className="fa-solid fa-bars text-2xl"></i>
                </button>
            </div>
            <div className={`z-10 flex-col md:items-center md:flex md:flex-row gap-4 md:gap-10 ${isOpen ? 'flex absolute left-0 mt-1 top-full shadow-md bg-white w-full p-2' : 'hidden'}`}>

                <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                    <Link to="/" className="w-full nav-link flex items-center gap-1 text-gray-700 hover:text-indigo-800 transition-all ease-in-out duration-300">
                        <i className={`${isActive('/') ? 'active text-xl text-pink-500' : ''} fa-solid fa-chart-pie `}></i>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <span>Inicio</span>
                        </motion.div>
                    </Link>
                    <Link to="/cursos" className="nav-link flex items-center gap-1 text-gray-700 hover:text-indigo-800 transition-all ease-in-out duration-300">
                        <i className={`${isActive('/cursos') ? 'active text-xl text-pink-500' : ''} fa-solid fa-book `}></i>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <span>Cursos</span>
                        </motion.div>
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                    <Link to="/login" className="nav-link flex items-center gap-1 text-indigo-800 font-bold hover:text-pink-500 transition-all ease-in-out duration-300">
                        <i className={`${isActive('/login') ? 'active text-xl text-pink-500' : ''} fa-solid fa-sign-in-alt `}></i>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <span>Login</span>
                        </motion.div>
                    </Link>
                    <Link to="/registro" className="nav-link flex items-center gap-1 text-indigo-800 font-bold hover:text-pink-500 transition-all ease-in-out duration-300">
                        <i className={`${isActive('/registro') ? 'active text-xl text-pink-500' : ''} fa-solid fa-user-plus `}></i>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <span>Registro</span>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
