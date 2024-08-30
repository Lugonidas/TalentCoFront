import { Outlet } from "react-router-dom";
import Navegacion from "../components/Navegacion";
import Footer from "../components/Footer";



export default function Layout() {
  return (
    <>
      <main className="w-[90%] mx-auto">
        <Navegacion />

        <div className="">
          <Outlet />
        </div>
      </main>
      <div>
        <Footer></Footer>
      </div>
    </>
  );
}
