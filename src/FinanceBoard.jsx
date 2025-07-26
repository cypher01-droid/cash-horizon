import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  CircleDollarSign,
  PiggyBank,
  TrendingDown,
  BarChart3,
  PlusCircle
} from 'lucide-react';
import './FinanceBoard.css';

const FinanceBoard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [inputBudget, setInputBudget] = useState('');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const userId = localStorage.getItem('userId');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const txRes = await axios.get(`http://localhost:5000/api/transactions/${userId}`);
      setTransactions(txRes.data);

      const budgetRes = await axios.get(`http://localhost:5000/api/budget/${userId}`);
      setBudget(budgetRes.data.amount);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/budget', { userId, amount: inputBudget });
      setBudget(parseFloat(inputBudget));
      setInputBudget('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/transactions', {
        userId,
        label,
        amount: parseFloat(amount),
        category,
        date,
      });
      setLabel('');
      setAmount('');
      setCategory('');
      setDate('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const categoryData = transactions.reduce((acc, tx) => {
    const cat = tx.category || 'Autre';
    acc[cat] = (acc[cat] || 0) + tx.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  // Fallback sample data if no transactions exist
  const fallbackData = [
    { name: 'Courses', value: 150 },
    { name: 'Loyer', value: 600 },
    { name: 'Transport', value: 80 },
    { name: 'Autre', value: 100 },
  ];

  const chartData = pieData.length ? pieData : fallbackData;

  const totalSpent = chartData.reduce((sum, entry) => sum + entry.value, 0);
  const remaining = budget - totalSpent;

  return (
    <div className="finance-section">
      <h2 className="section-title">
        <BarChart3 className="icon" /> Tableau Financier
      </h2>

      <form onSubmit={handleBudgetSubmit} className="form-grid">
        <label><PiggyBank className="icon" /> Budget mensuel (€):</label>
        <input
          type="number"
          value={inputBudget}
          onChange={(e) => setInputBudget(e.target.value)}
          required
        />
        <button type="submit">Définir</button>
      </form>

      <h3 className="sub-title">
        <PlusCircle className="icon" /> Ajouter une Transaction
      </h3>

      <form onSubmit={handleTransactionSubmit} className="form-grid">
        <input placeholder="Libellé" value={label} onChange={(e) => setLabel(e.target.value)} required />
        <input type="number" placeholder="Montant" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input placeholder="Catégorie" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <button type="submit">Ajouter</button>
      </form>

      <div className="budget-summary">
        <p><CircleDollarSign className="icon" /> <strong>Total Dépensé :</strong> {totalSpent.toFixed(2)} €</p>
        <p><PiggyBank className="icon" /> <strong>Budget Défini :</strong> {budget.toFixed(2)} €</p>
        <p><TrendingDown className="icon" /> <strong>Reste :</strong> {remaining.toFixed(2)} €</p>
        <span className={`status ${remaining < 0 ? 'danger' : 'ok'}`}>
          {remaining < 0 ? 'Dépassement' : 'Sous budget'}
        </span>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinanceBoard;
