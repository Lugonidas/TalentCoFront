import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export default function AuthLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="md:ms-16 flex-1 overflow-hidden min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
