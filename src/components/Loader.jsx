import "../styles/spinner.scss";

export default function Loader({ clase = "" }) {
  return (
    <div className={`${clase ? clase : "min-h-screen"} flex items-center justify-center`}>
      <span className="loader"></span>
    </div>
  );
}

