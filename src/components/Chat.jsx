import { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

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
        // Formatear la respuesta antes de mostrarla
        const formattedResponse = formatApiResponse(aiResponse);
        setMessages(prev => [...prev, { sender: 'ai', text: formattedResponse }]);
      } else {
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error) {
      console.error('Error en la API:', error);
      setMessages(prev => [...prev, { sender: 'error', text: 'Error al conectar con el servidor.' }]);
    }
  };

  // Función para formatear la respuesta de la API
  const formatApiResponse = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Detectar títulos
      if (line.startsWith('###')) {
        return <h3 key={index} className="font-semibold mt-2">{line.replace('###', '')}</h3>;
      }
      // Detectar elementos de lista (ingresos y gastos)
      if (line.match(/^\d+\.\s*\*\*(.+?)\*\*\s*-\s*Detalles:/)) {
        const match = line.match(/^\d+\.\s*\*\*(.+?)\*\*\s*-\s*Detalles:\s*(.+)/);
          if (match) {
              const amount = match[1].trim();
              const details = match[2].trim();
              return (
                  <div key={index} className="mb-1">
                      <b>{amount}</b> - {details}
                  </div>
              );
          }
      }

      // Detectar fechas
      if (line.startsWith('   Fecha:')) {
        const dateString = line.replace('   Fecha:', '').trim();
        const formattedDate = formatDate(dateString);
        return <div key={index} className="text-gray-500 ml-4">Fecha: {formattedDate}</div>;
      }

       // Detectar totales y balance
       if (line.startsWith('- **Total Ingresos:**') || line.startsWith('- **Total Gastos:**') || line.startsWith('🔹 **Balance total:**')) {
           return <p key={index} className="font-medium">{line}</p>;
       }

      // Para el resto, simplemente devolver el texto
      return <p key={index}>{line}</p>;
    });
  };

  // Función auxiliar para formatear fechas (opcional, pero mejora la legibilidad)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }); // Formato: DD de Mes de AAAA
  };

  return (
    <div className="relative">
      {isChatOpen && (
        <div className="fixed bottom-15 sm:fixed bottom-4 lg:fixed lg:bottom-4 lg:left-13 bg-white border rounded-lg shadow-lg w-full sm:w-90 lg:w-90 h-[60vh] overflow-hidden flex flex-col">
          <div className="bg-gray-800 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg font-semibold">FinanKBot</h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="hover:text-gray-200 focus:outline-none"
            >
              ×
            </button>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-4 space-y-2"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg py-2 px-3 max-w-[80%] ${
                    msg.sender === "user" ? "bg-blue-200" : "bg-gray-200"
                  }`}
                  style={{ color: "black" }}
                >
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
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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
        className="fixed bottom-2 w-12 h-12 left-4 bg-blue-400 transition-all duration-300 ease-in-out hover:bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        🤖
      </button>
    </div>
  );
};

export default ChatComponent;