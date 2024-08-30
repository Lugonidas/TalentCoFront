import Sidebar from "../../components/chat/Sidebar";
import Window from "../../components/chat/Window";
import Input from "../../components/chat/Input";
import Header from "../../components/chat/Header";
import useChat from "../../hooks/useChat";


export default function Inicio() {
  const {
    chats,
    selectedUser,
    handleSendMessage,
  } = useChat();

  return (
    <div className="flex overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden h-screen">
        {selectedUser && (
          <Header />
        )}
        <Window selectedUser={selectedUser} chats={chats} />
        {selectedUser && <Input onSendMessage={handleSendMessage} />}
      </div>
    </div>
  );
}
