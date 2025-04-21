import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="container">
      <div className="welcome-container">
        <h1 className="welcome-title">✨ Bedtime Story Generator ✨</h1>
        <p className="welcome-subtitle">
          Create magical, personalized bedtime stories for your little ones
        </p>
        
        <div className="card">
          <h2>How it Works</h2>
          <p>
            Our AI-powered story generator creates unique, age-appropriate bedtime
            stories based on themes and genres you select. Every story is one-of-a-kind
            and perfect for making bedtime special.
          </p>
          <p>
            Simply choose a theme like "space" or "animals," select a genre such as
            "adventure" or "fairy tale," and let our AI create a magical story
            for your child.
          </p>
          <Link to="/select" className="btn">
            Create a Story
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;