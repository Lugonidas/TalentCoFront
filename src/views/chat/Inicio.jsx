import Sidebar from "../../components/chat/Sidebar";
import Window from "../../components/chat/Window";
import Input from "../../components/chat/Input";
import Header from "../../components/chat/Header";
import useChat from "../../hooks/useChat";
import Modal from "../../components/Modal";

export default function Inicio() {
  const { chats, selectedUser, handleSendMessage, setSelectedUser } = useChat();

  return (
    <div className="flex overflow-hidden h-screen relative">
      <Sidebar />

      {selectedUser && (
        <div className="fixed flex items-end h-screen right-0 bottom-0">
          <div className=" relative flex-1">
            <Header />

            <Window selectedUser={selectedUser} chats={chats} />

            <div className="bg-white border-t border-gray-200">
              <Input onSendMessage={handleSendMessage} />
            </div>
            <button
              className="absolute text-white top-0 right-full"
              onClick={() => setSelectedUser(false)}
            >
              <i className="fa-solid fa-xmark bg-indigo-600 px-2 text-2xl"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
