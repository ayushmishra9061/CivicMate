import { Bot, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { api } from '../services/api';

export default function AIChatbot() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/ai/chat/history').then(({ data }) => setMessages(data.messages));
  }, []);

  const send = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    const userMessage = { role: 'user', content: message };
    setMessages((current) => [...current, userMessage]);
    setMessage('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: userMessage.content });
      setMessages((current) => [...current, { role: 'assistant', content: data.reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-md bg-blue-50 text-civic-blue dark:bg-blue-950/50"><Bot /></span>
        <div>
          <h2 className="text-2xl font-bold">AI Chatbot</h2>
          <p className="text-sm text-slate-500">Complaint assistance, emergency guidance, civic information, and navigation help.</p>
        </div>
      </div>
      <div className="mt-6 grid max-h-[56vh] gap-3 overflow-y-auto rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
        {messages.map((item, index) => (
          <div key={`${item.role}-${index}`} className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${item.role === 'user' ? 'ml-auto bg-civic-blue text-white' : 'bg-white dark:bg-slate-900'}`}>
            {item.content}
          </div>
        ))}
        {loading ? <div className="max-w-[85%] rounded-lg bg-white px-4 py-3 text-sm dark:bg-slate-900">Thinking...</div> : null}
      </div>
      <form onSubmit={send} className="mt-4 flex gap-2">
        <input className="focus-ring min-h-11 flex-1 rounded-md border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-950" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask CivicMate..." />
        <Button><Send size={18} /></Button>
      </form>
    </Card>
  );
}
