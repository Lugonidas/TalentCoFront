import "../styles/spinner.scss";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <span className="loader">Cargando...</span>
    </div>
  );
}
