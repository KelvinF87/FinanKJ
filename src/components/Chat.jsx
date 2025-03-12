import { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

// const URI_N8N = "https://0de3-94-248-105-51.ngrok-free.app/webhook-test/248b470a-e168-4e32-a206-130ef72feb7b";
const URI_N8N = import.meta.env.VITE_API_IA;

const ChatComponent = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatContainerRef = useRef(null);
  const userId = user?._id;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!userId) {
      setMessages(prev => [...prev, { sender: 'error', text: 'Usuario no autenticado. Inicie sesión.' }]);
      return;
    }

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const { data } = await axios.post(URI_N8N, { message: input, userId });
      const aiResponse = data[0]?.output;

      if (aiResponse) {
        setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      } else {
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error) {
      console.error('Error en la API:', error);
      setMessages(prev => [...prev, { sender: 'error', text: 'Error al conectar con el servidor.' }]);
    }
  };

  return (
    <div className="relative">
      {isChatOpen && (
        <div className="fixed bottom-4 left-13 bg-white border rounded-lg shadow-lg w-96 h-[60vh] overflow-hidden flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg font-semibold">FinanKBot</h2>
            <button onClick={() => setIsChatOpen(false)} className="hover:text-gray-200 focus:outline-none">
              &times;
            </button>
          </div>

          <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg py-2 px-3 max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`} style={{ color: 'black' }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-grow border text-black rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Escribe un mensaje..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600 focus:outline-none"
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 left-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        💬
      </button>
    </div>
  );
};

export default ChatComponent;
