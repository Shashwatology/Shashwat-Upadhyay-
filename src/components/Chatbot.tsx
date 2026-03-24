import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const FAQ_SUGGESTIONS = [
  "Who is Shashwat?",
  "What are his projects?",
  "How can I contact him?",
  "Is he available for work?"
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorInfo, setVisitorInfo] = useState({ name: '', email: '' });
  const [showInfoForm, setShowInfoForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "Hey there! ✨ I'm Shashwat's AI assistant. Ask me anything about his work, projects, or just say hi! I don't bite... much 😉"
      }]);
    }
  }, [isOpen]);

  const createConversation = async () => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({})
      .select('id')
      .single();
    
    if (!error && data) {
      setConversationId(data.id);
      return data.id;
    }
    return null;
  };

  const saveMessage = async (convId: string, role: 'user' | 'assistant', content: string) => {
    await supabase
      .from('chat_messages')
      .insert({ conversation_id: convId, role, content });
  };

  const updateVisitorInfo = async (convId: string) => {
    if (visitorInfo.name || visitorInfo.email) {
      await supabase
        .from('chat_conversations')
        .update({ visitor_name: visitorInfo.name, visitor_email: visitorInfo.email })
        .eq('id', convId);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    setInput('');
    setIsLoading(true);

    let convId = conversationId;
    if (!convId) {
      convId = await createConversation();
      if (!convId) {
        setIsLoading(false);
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };
    setMessages(prev => [...prev, userMessage]);
    await saveMessage(convId, 'user', text);

    // After 3 messages, prompt for contact info
    if (messages.filter(m => m.role === 'user').length === 2 && !showInfoForm) {
      setShowInfoForm(true);
    }

    try {
      const conversationHistory = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: text, conversationHistory }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply
      };
      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(convId, 'assistant', data.reply);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Oops! I got a little flustered there. Mind trying again? 💫"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfoSubmit = async () => {
    if (conversationId) {
      await updateVisitorInfo(conversationId);
    }
    setShowInfoForm(false);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <Sparkles size={20} className="text-blue-400" />
                <div>
                  <h3>Chat with Shashwat's AI</h3>
                  <span className="chatbot-status">Always here for you ✨</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`chatbot-message ${msg.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {msg.content}
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  className="chatbot-message assistant"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="chatbot-typing">
                    <span></span><span></span><span></span>
                  </span>
                </motion.div>
              )}

              {/* FAQ Suggestions */}
              {messages.length === 1 && (
                <div className="chatbot-suggestions">
                  {FAQ_SUGGESTIONS.map((faq, i) => (
                    <button key={i} onClick={() => sendMessage(faq)} className="chatbot-faq">
                      {faq}
                    </button>
                  ))}
                </div>
              )}

              {/* Visitor Info Form */}
              {showInfoForm && (
                <motion.div 
                  className="chatbot-info-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p>Want Shashwat to know who's chatting? 💕</p>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={visitorInfo.name}
                    onChange={(e) => setVisitorInfo(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <input
                    type="email"
                    placeholder="Your email (optional)"
                    value={visitorInfo.email}
                    onChange={(e) => setVisitorInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <div className="chatbot-form-actions">
                    <button onClick={() => setShowInfoForm(false)}>Skip</button>
                    <button onClick={handleInfoSubmit} className="primary">Share</button>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
              />
              <button onClick={() => sendMessage()} disabled={isLoading || !input.trim()}>
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
