import React, { useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import logo from './logo.png';

import integrationImage from './integration.jpg';
import transferImage from './transfers.jpg';
import analysisImage from './analysis.jpg';
import heroImage from './hero.jpeg';

import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="home-container">
      {/* Sticky Header */}
      <header className="header sticky">
        <div className="logo-container">
          <img src={logo} alt="Cash Horizon Logo" className="logo" />
          <h1 className="title">Cash Horizon</h1>
        </div>
        <nav className="menu">
          <Link to="/connexion" className="btn btn-login">Login</Link>
          <Link to="/inscription" className="btn btn-signup">Sign Up</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="hero fullwidth-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay">
          <h1>Bienvenue sur Cash Horizon</h1>
          <p>Votre partenaire de confiance pour gérer vos finances. Sécurisé, simple et rapide.</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-alt">
        <div className="service-row" data-aos="fade-up">
          <img src={integrationImage} alt="Intégration de Comptes Multiples" className="service-img" />
          <div className="service-text">
            <h3>Intégration de Comptes Multiples</h3>
            <p>Connectez et gérez facilement tous vos comptes bancaires dans une seule application sécurisée.</p>
          </div>
        </div>

        <div className="service-row reverse" data-aos="fade-up">
          <img src={transferImage} alt="Transferts Instantanés" className="service-img" />
          <div className="service-text">
            <h3>Transferts Instantanés</h3>
            <p>Envoyez et recevez de l'argent instantanément entre les utilisateurs de la plateforme.</p>
          </div>
        </div>

        <div className="service-row" data-aos="fade-up">
          <img src={analysisImage} alt="Analyse Financière" className="service-img" />
          <div className="service-text">
            <h3>Analyse Financière</h3>
            <p>Visualisez des graphiques détaillés et des analyses sur vos dépenses et vos économies.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" data-aos="fade-up">
        <h2>Avis de nos utilisateurs</h2>
        <div className="testimonial-list">
          <div className="testimonial-card">
            <p>"Cash Horizon a transformé ma façon de gérer mes finances. Simple et puissant !"</p>
            <h4>— Sophie L.</h4>
          </div>
          <div className="testimonial-card">
            <p>"Service client réactif et plateforme intuitive. Je recommande à 100%."</p>
            <h4>— Marc T.</h4>
          </div>
          <div className="testimonial-card">
            <p>"J'adore la fonctionnalité d’analyse, ça m'aide à suivre mes dépenses mensuelles."</p>
            <h4>— Claire B.</h4>
          </div>
          <div className="testimonial-card">
            <p>"Une app bancaire moderne, sûre et élégante. Bravo pour l’expérience utilisateur."</p>
            <h4>— Ahmed D.</h4>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="faq" data-aos="fade-up">
        <h2>Foire Aux Questions</h2>
        <div className="accordion">
          <details><summary>Est-ce que Cash Horizon est sécurisé ?</summary><p>Oui, nous utilisons des protocoles de sécurité avancés, y compris le chiffrement des données.</p></details>
          <details><summary>Puis-je connecter plusieurs comptes bancaires ?</summary><p>Absolument ! Notre outil permet une gestion centralisée de tous vos comptes.</p></details>
          <details><summary>Comment contacter le support ?</summary><p>Vous pouvez nous contacter 24/7 via l’onglet support de votre tableau de bord.</p></details>
          <details><summary>Y a-t-il des frais pour les transferts ?</summary><p>Les transferts entre utilisateurs Cash Horizon sont gratuits. Des frais minimes s’appliquent aux virements externes.</p></details>
          <details><summary>Est-ce compatible mobile ?</summary><p>Oui, notre interface est optimisée pour tous les appareils, mobiles et tablettes inclus.</p></details>
          <details><summary>Comment créer un compte ?</summary><p>Inscrivez-vous en quelques clics via notre formulaire en ligne sécurisé.</p></details>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Cash Horizon. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Home;
