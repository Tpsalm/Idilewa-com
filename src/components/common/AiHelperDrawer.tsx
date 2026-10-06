import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from './Icon';
import { apiService } from '../../services/api';
import { AiChatMessage } from '../../types';

export const AiHelperDrawer: React.FC = () => {
  const { aiDrawerOpen, setAiDrawerOpen, state } = useApp();
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: 'assistant',
      text: `Ẹ káàárọ̀! I am your Idilewa learning assistant. How can I help you explore African languages, oral literature, or coding today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!aiDrawerOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: AiChatMessage = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await apiService.askAiAssistant(text, state.currentLang);
      const assistantMsg: AiChatMessage = { role: 'assistant', text: res.reply || 'Thank you for your question!' };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: AiChatMessage = {
        role: 'assistant',
        text: 'Language and culture connect us deeply. Keep practicing and exploring!'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Explain the meaning of a Yorùbá proverb',
    'How do I say "Good morning" in Igbo?',
    'How does coding work with African languages?'
  ];

  return (
    <div className="modal-backdrop" onClick={() => setAiDrawerOpen(false)}>
      <section
        className="modal-card ai-helper-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close icon-button"
          onClick={() => setAiDrawerOpen(false)}
          aria-label="Close"
        >
          <Icon name="close" size={19} />
        </button>

        <div className="ai-helper-head">
          <div className="ai-helper-icon"><Icon name="sparkles" size={24} /></div>
          <h3>Idilewa Cultural Assistant</h3>
        </div>

        <div className="ai-helper-messages" style={{ maxHeight: '300px', overflowY: 'auto', padding: '12px 0' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`ai-message ${m.role === 'user' ? 'user-message' : 'assistant-message'}`}
              style={{
                marginBottom: '10px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: m.role === 'user' ? '#15764a' : '#faf9f2',
                color: m.role === 'user' ? '#ffffff' : '#18231d',
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {m.text}
            </div>
          ))}
          {loading && <div style={{ color: '#6b776f', fontSize: '0.9rem' }}>Thinking...</div>}
        </div>

        <div className="ai-helper-suggestions" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              className="button button-ghost"
              style={{ fontSize: '0.8rem', padding: '4px 8px' }}
              onClick={() => handleSend(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="ai-helper-input-group" style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="input"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ flex: 1 }}
          />
          <button className="button button-primary" onClick={() => handleSend()}>
            Send <Icon name="arrow" size={15} />
          </button>
        </div>
      </section>
    </div>
  );
};
