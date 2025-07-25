import React, { useState } from 'react';
import { askGROQ } from './groqService';
import './Assistant.css';

const Assistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    const reply = await askGROQ(query);
    setResponse(reply);
    setLoading(false);
  };

  return (
    <div className="assistant-container">
      <h3>Assistant Financier IA</h3>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Posez une question sur vos finances..."
        rows="4"
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? 'Analyse en cours...' : 'Poser la question'}
      </button>
      {response && <div className="assistant-response">{response}</div>}
    </div>
  );
};

export default Assistant;
