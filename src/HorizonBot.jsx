import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './HorizonBot.css';

const financeMessages = [
  { icon: '💡', text: 'Astuce budget : économisez 10% chaque mois.' },
  { icon: '💸', text: 'Suivez vos dépenses en temps réel.' },
  { icon: '📊', text: 'Analyse automatique de vos finances.' },
  { icon: '🔒', text: 'Sécurité bancaire de niveau supérieur.' }
];

const HorizonBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Bonjour, je suis HorizonBot ! Posez-moi vos questions financières.' }
  ]);
  const [input, setInput] = useState('');
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsgIndex(prev => (prev + 1) % financeMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (textOverride = null) => {
    const finalInput = textOverride || input;
    if (!finalInput.trim()) return;

    const newMessages = [...messages, { from: 'user', text: finalInput }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            { role: 'system', content: 'Tu es HorizonBot, un assistant bancaire intelligent.' },
            ...newMessages.map(m => ({
              role: m.from === 'user' ? 'user' : 'assistant',
              content: m.text
            }))
          ]
        }),
      });

      const data = await res.json();
      const botReply = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas compris.";
      setMessages([...newMessages, { from: 'bot', text: botReply }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { from: 'bot', text: 'Erreur de communication avec le serveur GROQ.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.start();
  };

  const getContextualPrompts = () => {
    if (location.pathname.includes('dashboard')) {
      if (location.pathname.includes('transactions')) {
        return [
          'Quels sont mes frais ce mois-ci ?',
          'Filtrer les achats par catégorie'
        ];
      }
      if (location.pathname.includes('transfers')) {
        return [
          'Comment envoyer de l’argent ?',
          'Afficher l’historique des transferts'
        ];
      }
      if (location.pathname.includes('finance')) {
        return [
          'Montre-moi un graphique de mes dépenses',
          'Alerte si budget dépassé ?'
        ];
      }
      return [
        'Que puis-je faire ici ?',
        'Montre-moi mes dernières activités'
      ];
    }
    return [
      'Quels services propose Cash Horizon ?',
      'Comment créer un compte ?'
    ];
  };

  const prompts = getContextualPrompts();

  return (
    <div className="horizonbot-container">
      {!isOpen && (
        <div className="horizon-bot-preview">
          <h5>🤖 Horizon IA</h5>
          <p>{financeMessages[currentMsgIndex].icon} {financeMessages[currentMsgIndex].text}</p>
        </div>
      )}

      <button className="bot-toggle" onClick={() => setIsOpen(!isOpen)}>🤖</button>

      {isOpen && (
        <div className="bot-modal">
          <div className="chat-header">
            <h4>HorizonBot</h4>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.from}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg bot">
                <p className="typing">...</p>
              </div>
            )}
          </div>

          <div className="prompt-suggestions">
            {prompts.map((prompt, i) => (
              <button key={i} className="prompt-btn" onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Posez votre question..."
            />
            <button onClick={handleVoiceInput}>🎤</button>
            <button onClick={() => sendMessage()}>Envoyer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizonBot;
