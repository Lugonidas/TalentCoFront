import { useContext } from "react";
import ChatContext from "../context/ChatProvider";

export default function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat debe usarse dentro de un ChatProvider");
  }
  return context;
}
