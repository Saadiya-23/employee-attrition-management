import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am RetentionAI. How can I help you analyze the workforce today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Send history for context (simplified)
            const history = messages.slice(-5); // Keep last 5 context
            const response = await sendChatMessage(userMsg.content, history);
            setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the AI." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: '#2563eb', color: 'white',
                        border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <MessageSquare size={28} />
                </button>
            )}

            {isOpen && (
                <div style={{
                    width: '350px', height: '500px', background: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                    display: 'flex', flexDirection: 'column',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{ padding: '1rem', background: '#0f172a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Bot size={20} />
                            <span style={{ fontWeight: 600 }}>RetentionAI Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((m, idx) => (
                            <div key={idx} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.75rem',
                                background: m.role === 'user' ? '#2563eb' : 'white',
                                color: m.role === 'user' ? 'white' : '#1e293b',
                                border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                                fontSize: '0.9rem',
                                boxShadow: m.role === 'assistant' ? '0 1px 2px 0 rgba(0,0,0,0.05)' : 'none'
                            }}>
                                {m.content}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', background: 'white', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
                                Thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about risk trends..."
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer' }}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
