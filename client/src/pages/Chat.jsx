import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Send, LogOut } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
    const { user, setUser, backendUrl } = useContext(AppContext);
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || loading) return;

        const userMsg = prompt;
        setPrompt('');
        setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const { data } = await axios.post(`${backendUrl}/api/chat/send`, {
                userId: user?._id || 'guest',
                prompt: userMsg
            });

            if (data.success) {
                setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-950 text-white">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between p-4">
                <div>
                    <h1 className="text-xl font-bold mb-6 text-blue-400">ChatGPT Clone</h1>
                    <div className="text-sm text-gray-400 mb-2">Logged in as:</div>
                    <div className="font-medium truncate">{user ? user.name : 'Guest User'}</div>
                </div>
                <button 
                    onClick={() => setUser(null)} 
                    className="flex items-center gap-2 text-red-400 hover:bg-gray-800 p-2 rounded transition"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>

            {/* Main Chat Window */}
            <div className="flex-1 flex flex-col justify-between">
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <h2 className="text-3xl font-semibold mb-2">What can I help with today?</h2>
                            <p className="text-sm">Type a message below to start chatting with Groq AI.</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xl p-4 rounded-lg leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-800 p-4 rounded-lg text-gray-400 animate-pulse">
                                AI is thinking...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendMessage} className="p-4 bg-gray-900 border-t border-gray-800 flex gap-2">
                    <input 
                        type="text" 
                        value={prompt} 
                        onChange={(e) => setPrompt(e.target.value)} 
                        placeholder="Message ChatGPT..." 
                        className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-5 rounded-lg flex items-center justify-center transition">
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;