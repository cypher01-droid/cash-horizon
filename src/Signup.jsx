import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './logo.png'; // ✅ Make sure the path is correct

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: '',
    address: '',
    nationality: '',
    securityAnswer: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleNext = () => setCurrentStep(currentStep + 1);
  const handlePrev = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.message === 'Utilisateur créé avec succès.') {
        alert("Inscription réussie!");
        navigate("/connexion");
      } else {
        alert("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="signup-container">
      {/* Navigation */}
      <nav className="signup-nav">
        <Link to="/" className="nav-link">Accueil</Link>
        <Link to="/connexion" className="nav-link">Se connecter</Link>
      </nav>

      {/* Main Signup Layout */}
      <div className="signup-box">
        {/* Left Info Section */}
        <div className="signup-left">
          {/* ✅ Logo and Branding */}
          <div className="logo-header">
            <img src={logo} alt="Cash Horizon Logo" className="logo" />
            <h2>Cash Horizon</h2>
          </div>
          <p>Créez votre compte bancaire en toute sécurité et commencez à gérer vos finances.</p>
        </div>

        {/* Signup Form Section */}
        <div className="signup-right">
          <h3>Inscription</h3>
          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Step 1 */}
            {currentStep === 1 && (
              <>
                <label>Nom complet</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                <label>Mot de passe</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                <label>Confirmer le mot de passe</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <>
                <label>Téléphone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                <label>Date de naissance</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                <label>Adresse</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                <label>Nationalité</label>
                <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required />
              </>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <>
                <label>Question de sécurité</label>
                <input type="text" name="securityAnswer" placeholder="Nom de jeune fille de votre mère" value={formData.securityAnswer} onChange={handleChange} required />
                <div className="terms-container">
                  <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} required />
                  <label>
                    J'accepte les <Link to="/terms">termes et conditions</Link>
                  </label>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="signup-navigation">
              {currentStep > 1 && <button type="button" onClick={handlePrev} className="btn-prev">Précédent</button>}
              {currentStep < 3
                ? <button type="button" onClick={handleNext} className="btn-next">Suivant</button>
                : <button type="submit" className="btn-submit">S'inscrire</button>
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
