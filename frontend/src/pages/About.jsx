import React from "react";
import { Users, Lightbulb, Globe, Target } from "lucide-react";
import "./About.css";
import AboutImg from "../assets/about.jpg"; // optional

const About = () => {
  const features = [
    {
      icon: <Users size={32} />,
      title: "Join the Community",
      text: "Create your account and connect with learners and mentors worldwide.",
    },
    {
      icon: <Lightbulb size={32} />,
      title: "Learn New Skills",
      text: "Find topics that interest you and learn directly from real people.",
    },
    {
      icon: <Target size={32} />,
      title: "Share Your Knowledge",
      text: "Teach others what you know and help shape their learning journey.",
    },
    {
      icon: <Globe size={32} />,
      title: "Grow Together",
      text: "Collaborate, exchange ideas, and expand your opportunities globally.",
    },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-text">
          <h1>About SkillSwap</h1>
          <p>
            Learn. Teach. Grow. — a platform where people connect to exchange
            skills and share knowledge for mutual growth.
          </p>
        </div>

        <div className="about-hero-image">
          <img src={AboutImg} alt="SkillSwap community" />
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          We believe everyone has something valuable to teach and learn. Our
          goal is to make skill-sharing easy, meaningful, and accessible for
          everyone across the world.
        </p>
      </section>

      {/* Features (How It Works) */}
      <section className="about-how">
        <h2>How It Works</h2>
        <div className="how-list">
          {features.map((feature, index) => (
            <div className="how-card" key={index}>
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join SkillSwap today and become part of a global learning community.</p>
        <a href="/register" className="cta-btn">
          Get Started
        </a>
      </section>
    </div>
  );
};

export default About;
