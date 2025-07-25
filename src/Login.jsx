import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrors("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      console.log("Login response:", response.data);

      const { token, userId, fullName, email, message } = response.data;

      if (token) {
        // Store user details in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('email', email);

        console.log("Redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        setErrors(message || "Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="login-container">
      <nav className="login-nav">
        <Link to="/" className="nav-link">Accueil</Link>
        <Link to="/inscription" className="nav-link">S'inscrire</Link>
      </nav>

      <div className="login-box">
        <div className="login-left">
          <img src={logo} alt="Cash Horizon Logo" className="logo" />
          <h2>Bienvenue sur Cash Horizon</h2>
          <p>Connectez-vous pour accéder à vos finances de manière sécurisée.</p>
        </div>

        <div className="login-right">
          <h3>Connexion</h3>
          {errors && <p className="error-message">{errors}</p>}
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Entrez votre email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-login">Se connecter</button>
          </form>

          <p className="redirect-text">
            Vous n’avez pas de compte ? <Link to="/inscription">Inscrivez-vous ici</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
