import Admin from "./Admin";
import Teacher from "./Teacher";
import Student from "./Student";
import { useAuth } from "../../hooks/useAuth";

export default function Inicio() {
  const { user } = useAuth({ middleware: "auth" });

  return (
    <div className="p-2">
      {user?.id_rol === 1 && <Admin />}
      {user?.id_rol === 2 && <Student />}
      {user?.id_rol === 3 && <Teacher />}
    </div>
  );
}
