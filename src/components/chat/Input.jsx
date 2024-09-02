import { useState } from "react";

export default function Input({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleKeyPress = (e) => {
    if (e.key == 'Enter') {
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-2 bg-gray-200 flex gap-2 items-end">
      <div className="flex gap-2 border-r border-indigo-800 border-dotted pr-2">
        <i className="text-xl  transition-all ease-in-out hover:cursor-pointer fa-regular fa-face-smile"></i>
        <i className="text-xl  transition-all ease-in-out hover:cursor-pointer fa-solid fa-paperclip"></i>
      </div>
        <input
          type="text"
          name="mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="w-full bg-gray-200 border-b border-dotted border-indigo-800 outline-none"
          onKeyDown={handleKeyPress}
        />
      <button onClick={handleSend} className="bg-indigo-800 text-white transition-all ease-in-out hover:cursor-pointer hover:bg-indigo-700"><i className="fa-regular fa-paper-plane inline-block h-full p-2 transition-all ease-in-out hover:scale-110"></i></button>
    </div>
  );
}
