import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Transfers.css';

const Transfers = () => {
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  const userPhone = localStorage.getItem('userPhone');

  const [showSend, setShowSend] = useState(false);
  const [showReceive, setShowReceive] = useState(false);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [receiveAccount, setReceiveAccount] = useState('');

  const fakeHistory = [
    { id: 1, label: 'Envoyé à Jean Dupont', amount: 120.00, date: '2025-07-22' },
    { id: 2, label: 'Reçu de Marie Lemoine', amount: 75.50, date: '2025-07-19' },
    { id: 3, label: 'Envoyé à Banque Épargne', amount: 300.00, date: '2025-07-15' },
  ];

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/accounts/${userId}`);
        setAccounts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAccounts();
  }, [userId]);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/transfer', {
        senderId: userId,
        recipient,
        amount,
        fromAccountId: selectedAccount,
      });
      alert('Transfert réussi');
      setRecipient('');
      setAmount('');
      setSelectedAccount('');
      setShowSend(false);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du transfert');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copié dans le presse-papiers');
  };

  return (
    <div className="transfer-section">
      <h2 className="section-title">Transferts</h2>

      <div className="transfer-buttons">
        <button
          className={`toggle-btn ${showSend ? 'active' : ''}`}
          onClick={() => { setShowSend(true); setShowReceive(false); }}
        >
          Envoyer
        </button>
        <button
          className={`toggle-btn ${showReceive ? 'active' : ''}`}
          onClick={() => { setShowReceive(true); setShowSend(false); }}
        >
          Recevoir
        </button>
      </div>

      {showSend && (
        <form onSubmit={handleSend} className="transfer-form">
          <label>Destinataire (ID, Email ou Téléphone):</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />

          <label>Montant (€):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <label>Compte source:</label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            required
          >
            <option value="">Sélectionner</option>
            {accounts.map(acc => (
              <option key={acc._id} value={acc._id}>
                {acc.name} — {acc.balance} €
              </option>
            ))}
          </select>

          <button className="submit-btn" type="submit">Envoyer</button>
        </form>
      )}

      {showReceive && (
        <div className="receive-panel">
          <p><strong>ID :</strong> <span onClick={() => copyToClipboard(userId)}>{userId}</span></p>
          <p><strong>Email :</strong> <span onClick={() => copyToClipboard(userEmail)}>{userEmail}</span></p>
          <p><strong>Téléphone :</strong> <span onClick={() => copyToClipboard(userPhone)}>{userPhone}</span></p>

          <label>Compte de réception :</label>
          <select
            value={receiveAccount}
            onChange={(e) => setReceiveAccount(e.target.value)}
          >
            <option value="">Sélectionner</option>
            {accounts.map(acc => (
              <option key={acc._id} value={acc._id}>
                {acc.name} — {acc.balance} €
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Static Transaction History */}
      <div className="transfer-history">
        <h3>Historique des Transferts</h3>
        {fakeHistory.map(tx => (
          <div key={tx.id} className="history-item">
            <div>{tx.label}</div>
            <div className="history-meta">
              <span className="amount">€{tx.amount.toFixed(2)}</span>
              <span className="date">{tx.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transfers;
