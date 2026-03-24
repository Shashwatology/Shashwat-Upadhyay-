import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const FAQ_SUGGESTIONS = [
  "Who is Shashwat?",
  "What are his projects?",
  "Tech stacks he uses?",
];

const PremiumAIBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  // Voice State
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(16).fill(0));
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isVoiceMode]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "Hey there! ✨ I'm Shashwat's AI assistant. Ask me anything via text or voice. I don't bite... much 😉"
      }]);
    }
  }, [isOpen, messages.length]);

  // -- Speech Recognition Initialization --
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognitionConstructor();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        stopVoiceMode();
        sendMessage(text, true);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        stopVoiceMode();
      };

      recognition.onend = () => {
        stopVoiceMode();
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      window.speechSynthesis.cancel();
      stopAudioVisualization();
    };
  }, []);

  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      const updateVisualization = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const levels = Array.from(dataArray).slice(0, 16).map(v => v / 255);
        setAudioLevels(levels);
        animationFrameRef.current = requestAnimationFrame(updateVisualization);
      };
      
      updateVisualization();
    } catch (err) {
      console.error('Audio visualization error:', err);
    }
  };

  const stopAudioVisualization = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    setAudioLevels(Array(16).fill(0));
  };

  const toggleVoiceMode = async () => {
    if (isVoiceMode) {
      stopVoiceMode();
    } else {
      setIsVoiceMode(true);
      window.speechSynthesis.cancel();
      await startAudioVisualization();
      try {
        if (recognitionRef.current) recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopVoiceMode = () => {
    setIsVoiceMode(false);
    if (recognitionRef.current) recognitionRef.current.stop();
    stopAudioVisualization();
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Choose a premium/natural voice if available
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(v => v.name.includes('Google US English Female') || v.name.includes('Samantha') || v.name.includes('Natural'));
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // -- Chat Logic --
  const createConversation = async () => {
    const { data, error } = await supabase.from('chat_conversations').insert({}).select('id').single();
    if (!error && data) {
      setConversationId(data.id);
      return data.id;
    }
    return null;
  };

  const saveMessage = async (convId: string, role: 'user' | 'assistant', content: string) => {
    await supabase.from('chat_messages').insert({ conversation_id: convId, role, content });
  };

  const sendMessage = async (messageText?: string, respondWithVoice: boolean = false) => {
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

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    await saveMessage(convId, 'user', text);

    try {
      const conversationHistory = messages.filter(m => m.id !== 'welcome').map(m => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: text, conversationHistory, isVoice: respondWithVoice }
      });

      if (error) throw error;

      const reply = data.reply;
      const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: reply };
      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(convId, 'assistant', reply);

      if (respondWithVoice) {
        speak(reply);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "Oops! Connection glitched. Try again? 💫" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Premium Orb */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-[0_0_40px_rgba(168,85,247,0.4)] group overflow-visible"
          >
            {/* Glowing halos */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute inset-0 bg-[#050505] rounded-full flex items-center justify-center overflow-hidden z-10">
              <Sparkles className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors" />
              {/* Internal gleam */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Premium Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 sm:w-[400px] w-[calc(100vw-3rem)] h-[600px] max-h-[80vh] z-50 flex flex-col rounded-3xl overflow-hidden bg-black/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 backdrop-blur-3xl"
          >
            {/* Dynamic Glass Gradient Background inside box */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5 bg-black/20">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-[1px]">
                  <div className="absolute inset-0 bg-black/50 rounded-full" />
                  <Sparkles className="w-5 h-5 text-white z-10" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-white/90 text-sm">Shashwat AI</h3>
                  <p className="text-xs text-white/40 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isSpeaking && <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-sm'
                        : 'bg-white/5 border border-white/10 text-white/80 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
                    <span className="text-sm text-white/40">Thinking...</span>
                  </div>
                </motion.div>
              )}

              {/* Initial Suggestions */}
              {messages.length === 1 && !isLoading && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {FAQ_SUGGESTIONS.map((faq, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      onClick={() => sendMessage(faq)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/60 hover:text-white transition-all"
                    >
                      {faq}
                    </motion.button>
                  ))}
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Premium Input Area */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="relative flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
                {/* Voice Visualizer Or Text Input */}
                {isVoiceMode ? (
                  <div className="flex-1 flex items-center justify-center h-[40px] gap-1 px-4">
                    {audioLevels.map((level, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-purple-500 rounded-full"
                        animate={{ height: 8 + level * 24 }}
                        transition={{ duration: 0.05 }}
                      />
                    ))}
                    <span className="ml-4 text-xs text-purple-400 animate-pulse">Listening...</span>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-white placeholder-white/30"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isLoading}
                  />
                )}

                {/* Mic Toggle Button */}
                <button
                  onClick={toggleVoiceMode}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isVoiceMode 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                      : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                  title={isVoiceMode ? "Stop listening" : "Use Voice"}
                >
                  {isVoiceMode ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                {/* Send Button */}
                {!isVoiceMode && (
                  <button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all pl-1"
                  >
                    <Send size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PremiumAIBot;
