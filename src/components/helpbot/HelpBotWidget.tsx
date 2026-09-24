import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePin } from '../../core/context/PinContext';
import { useLanguage } from '../../core/context/LanguageContext';
import { queryHelpBot, type HelpBotMessage } from '../../core/services/helpbotService';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  Bot,
} from 'lucide-react';

export function HelpBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { selectedPin } = usePin();
  const { tr } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activePin = selectedPin || '110001';

  const [messages, setMessages] = useState<HelpBotMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Namaste! I am the JantaX Civic Assistant. Ask me anything about public facilities, schools, road projects, or elected representatives in PIN ${activePin}.`,
      textHi: `नमस्ते! मैं JantaX नागरिक सहायक हूँ। पिन ${activePin} के सरकारी स्कूलों, सड़कों, अस्पतालों या जनप्रतिनिधियों के बारे में कुछ भी पूछें।`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: `View PIN ${activePin} Overview`, url: `/pin/${activePin}` },
        { label: `Check Elected Representatives`, url: `/pin/${activePin}/people` },
      ],
      sources: [{ name: 'JantaX Locality Public Data Engine', freshness: 'Verified Sources' }],
    },
  ]);

  const quickPrompts = [
    `Who is the MP for ${activePin}?`,
    `What schools are in ${activePin}?`,
    `Check road projects & contractors`,
    `Where does JantaX data come from?`,
  ];

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q) return;

    const userMsg: HelpBotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Query grounded response
    setTimeout(() => {
      const reply = queryHelpBot(q, { activePin, currentPath: location.pathname });
      setMessages((prev) => [...prev, reply]);
    }, 200);
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #0f2d59 0%, #1e40af 100%)',
            color: '#ffffff',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 9999,
            padding: '0.65rem 1.15rem',
            boxShadow: '0 8px 24px rgba(15, 45, 89, 0.3)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Sparkles size={16} style={{ color: '#f97316' }} />
          <span>{tr('Civic HelpBot', 'नागरिक सहायक')}</span>
        </button>
      )}

      {/* HelpBot Drawer / Modal Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 10000,
            width: '92vw',
            maxWidth: 420,
            height: '75vh',
            maxHeight: 560,
            background: '#ffffff',
            borderRadius: 20,
            border: '1px solid #e2e8f0',
            boxShadow: '0 12px 40px rgba(15, 23, 42, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.85rem 1.1rem',
              background: 'linear-gradient(135deg, #0f2d59 0%, #1e3a8a 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={18} style={{ color: '#f97316' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>JantaX HelpBot</span>
                  <span style={{ fontSize: '0.65rem', background: '#10b981', color: '#ffffff', padding: '0.1rem 0.4rem', borderRadius: 9999 }}>
                    Grounded
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                  Answers strictly from official public records
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Conversation Body */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              background: '#f8fafc',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '86%',
                    padding: '0.75rem 1rem',
                    borderRadius: 16,
                    fontSize: '0.85rem',
                    lineHeight: 1.45,
                    background: msg.sender === 'user' ? '#2563eb' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                    boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(37,99,235,0.2)' : '0 2px 6px rgba(0,0,0,0.03)',
                  }}
                >
                  <p style={{ margin: 0 }}>{msg.text}</p>

                  {/* Actions & Links */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            navigate(action.url);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.35rem 0.65rem',
                            borderRadius: 6,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <span>{action.label}</span>
                          <ChevronRight size={13} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Sources tag */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        paddingTop: '0.4rem',
                        borderTop: '1px solid #f1f5f9',
                        fontSize: '0.7rem',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <ShieldCheck size={12} style={{ color: '#10b981' }} />
                      <span>
                        Source: <strong>{msg.sources[0].name}</strong>
                      </span>
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.25rem', padding: '0 0.4rem' }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div
            style={{
              padding: '0.5rem 0.75rem',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(p)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: 9999,
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '0.75rem',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <input
              type="text"
              placeholder={`Ask about PIN ${activePin} facilities or representatives...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: '0.84rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: 10,
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default',
                opacity: input.trim() ? 1 : 0.5,
              }}
              aria-label="Send message"
            >
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
