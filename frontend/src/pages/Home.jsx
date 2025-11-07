import React from "react";
import {
  BookOpen,
  Users,
  ArrowRight,
  MonitorSmartphone,
  PenTool,
  Code,
  Briefcase,
  Star,
} from "lucide-react";
import "./Home.css";
// importing the images used

import Mentor1 from "../assets/Mentor1.jpg"
import Mentor2 from "../assets/Mentor2.jpg"
import Mentor3 from "../assets/Mentor3.jpg"
const Home = () => {
  const features = [
    {
      icon: <BookOpen size={32} />,
      title: "Learn New Skills",
      desc: "Access hundreds of courses taught by passionate users across the world.",
    },
    {
      icon: <Users size={32} />,
      title: "Teach What You Know",
      desc: "Upload your lessons, tutorials, or resources to help others grow.",
    },
    {
      icon: <Briefcase size={32} />,
      title: "Collaborate & Earn",
      desc: "Connect with learners and earn while teaching valuable skills.",
    },
  ];

  const categories = [
    { name: "Web Development", icon: <Code /> },
    { name: "Design", icon: <PenTool /> },
    { name: "Digital Marketing", icon: <MonitorSmartphone /> },
    { name: "Business", icon: <Briefcase /> },
    { name: "Personal Growth", icon: <Users /> },
  ];

  const mentors = [
    {
      name: "Jane Doe",
      skill: "UI/UX Design",
      rating: 4.9,
      img:Mentor1
    },
    {
      name: "Michael Lee",
      skill: "Full-Stack Development",
      rating: 4.8,
      img: Mentor2
    },
    {
      name: "Sophia Adams",
      skill: "Digital Marketing",
      rating: 4.7,
      img:Mentor3
    },
  ];

  const testimonials = [
    {
      text: "SkillSwap helped me find a mentor that completely changed my coding journey. Highly recommend!",
      user: "Tunde A.",
    },
    {
      text: "I started teaching design here and it’s been such a great experience to share my passion.",
      user: "Sarah L.",
    },
    {
      text: "This platform bridges the gap between learning and real-world skills beautifully.",
      user: "Daniel M.",
    },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Grow. Teach. Connect.</h1>
          <p>Share your skills, learn from others, and grow together on SkillSwap.</p>
          <button className="cta-btn">
            Get Started <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        {features.map((item, i) => (
          <div key={i} className="feature-card">
            {item.icon}
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="categories">
        <h2>Popular Categories</h2>
        <div className="category-list">
          {categories.map((cat, i) => (
            <div key={i} className="category-card">
              {cat.icon}
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mentors */}
      <section className="mentors">
        <h2>Featured Mentors</h2>
        <div className="mentor-list">
          {mentors.map((mentor, i) => (
            <div key={i} className="mentor-card">
              <img src={mentor.img} alt={mentor.name} />
              <h3>{mentor.name}</h3>
              <p>{mentor.skill}</p>
              <div className="rating">
                <Star size={16} color="#facc15" /> {mentor.rating}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-list">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p>"{t.text}"</p>
              <span>- {t.user}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join SkillSwap today and share your skills with a global community.</p>
        <button className="cta-btn">
          Join Now <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
};

export default Home;
