import React, { useState, useRef, useEffect } from 'react';
import { generateChatResponse } from '../services/geminiService';
import { BotIcon, CloseIcon, SendIcon, MicrophoneIcon } from './icons';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

interface ChatbotProps {
    language: string;
    t: {
        conversationalMode: string;
        conversationalModeTooltip: string;
    }
}

export const Chatbot: React.FC<ChatbotProps> = ({ language, t }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: "Hello! I'm EndoBot. How can I help you with questions about endometriosis today? Please remember, I'm an AI assistant, not a medical professional." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isConversational, setIsConversational] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(setInput, language);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isOpen]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        if (isListening) stopListening();
        
        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const historyForApi = messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: msg.text
        }));

        try {
            const botResponseText = await generateChatResponse(historyForApi, input, isConversational);
            const botMessage: Message = { sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = { sender: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 btn-gradient text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 z-50"
                aria-label="Open EndoBot Chat"
            >
                <BotIcon className="w-8 h-8" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
            <header className="flex items-center justify-between p-4 chatbot-header-gradient text-white rounded-t-2xl">
                <div className="flex items-center space-x-3">
                    <BotIcon className="w-6 h-6" />
                    <h2 className="font-semibold text-lg">EndoBot Assistant</h2>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2" title={t.conversationalModeTooltip}>
                        <span className="text-xs font-medium">{t.conversationalMode}</span>
                        <button
                            onClick={() => setIsConversational(!isConversational)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-500 ${isConversational ? 'bg-fuchsia-500' : 'bg-white/40'}`}
                            role="switch"
                            aria-checked={isConversational}
                        >
                            <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isConversational ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-black/20 p-1 rounded-full" aria-label="Close chat">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>
            
            <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white flex-shrink-0"><BotIcon className="w-5 h-5"/></div>}
                        <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'user-message-gradient text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white flex-shrink-0"><BotIcon className="w-5 h-5"/></div>
                        <div className="max-w-[80%] p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                           <div className="flex items-center space-x-1">
                               <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                               <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                               <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-3 border-t bg-white rounded-b-2xl">
                <div className="flex items-center bg-gray-100 rounded-lg">
                    {hasRecognitionSupport && (
                        <button
                            onClick={isListening ? stopListening : startListening}
                            className={`p-2 transition-colors ${isListening ? 'text-red-500' : 'text-fuchsia-600 hover:text-fuchsia-500'}`}
                            title="Use voice input"
                        >
                            <MicrophoneIcon className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} />
                        </button>
                    )}
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={isListening ? "Listening..." : "Ask about endometriosis..."}
                        className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-800 focus:outline-none"
                        disabled={isLoading || isListening}
                    />
                    <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="p-2 text-fuchsia-600 disabled:text-gray-400 hover:text-fuchsia-500 disabled:hover:text-gray-400 transition-colors">
                        <SendIcon className="w-6 h-6"/>
                    </button>
                </div>
            </footer>
        </div>
    );
};