import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
  const values = [
    { icon: '🎓', title: 'Excellence', description: 'Committed to delivering quality education and fostering academic growth' },
    { icon: '🤝', title: 'Community', description: 'Building strong bonds and meaningful connections among students' },
    { icon: '🚀', title: 'Innovation', description: 'Embracing modern technology and creative approaches to learning' },
    { icon: '❤️', title: 'Inclusivity', description: 'Welcoming everyone and celebrating diversity on campus' }
  ];

    const stats = [
    { number: '◆', label: 'Real-time Chat' },
    { number: '●', label: 'Event Discovery' },
    { number: '✦', label: 'Connect Friends' },
    { number: '▲', label: 'Find Communities' }
  ];


  const team = [
    { name: 'Uma E Rubab',  image: '👩‍💼' },
    { name: 'Ayesha Khalid',  image: '👩‍💼' },
    { name: 'Dania Athar',  image: '👩‍💼' },
    { name: 'Easha Javed',  image: '👩‍💼' }
  ];

  return (
    <>
      <style>{`
        .about-container {
          width: 100%;
          background: #F4F4ED;
          min-height: 100vh;
        }

        /* ===== HERO SECTION ===== */
        .hero-section {
          width: 100%;
          min-height: 70vh;
          background: linear-gradient(135deg, rgba(247, 174, 248, 0.2) 0%, rgba(114, 221, 247, 0.2) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px 20px;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(247, 174, 248, 0.3), transparent);
          border-radius: 50%;
          top: -100px;
          left: -100px;
          animation: float 8s ease-in-out infinite;
        }

        .hero-section::after {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(114, 221, 247, 0.25), transparent);
          border-radius: 50%;
          bottom: -50px;
          right: -50px;
          animation: float 10s ease-in-out infinite reverse;
        }

        .hero-content {
          max-width: 800px;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .hero-content h1 {
          font-size: clamp(2rem, 6vw, 3.5rem);
          font-weight: 900;
          background: linear-gradient(135deg, #F7AEF8 0%, #B388EB 50%, #72DDF7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 15px;
          line-height: 1.2;
          animation: slideInDown 0.8s ease-out, textGlow 3s ease-in-out infinite;
        }

        .hero-content p {
          font-size: 1.1rem;
          color: #555;
          margin-bottom: 30px;
          line-height: 1.6;
          font-weight: 500;
          animation: slideInUp 0.8s ease-out 0.2s both;
        }

        .hero-btn {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #F7AEF8 0%, #B388EB 100%);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(247, 174, 248, 0.4);
          border: none;
          cursor: pointer;
          animation: slideInUp 0.8s ease-out 0.4s both;
        }

        .hero-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 45px rgba(247, 174, 248, 0.6);
        }

        /* ===== MISSION & VISION SECTION ===== */
        .mission-vision-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 35px;
          padding: 60px 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .mission-card, .vision-card {
          padding: 45px;
          border-radius: 18px;
          border: 3px solid transparent;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          animation: fadeInScale 0.8s ease-out 0.3s both;
        }

        .mission-card::before, .vision-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .mission-card:hover::before, .vision-card:hover::before {
          left: 100%;
        }

        .mission-card {
          background: linear-gradient(135deg, rgba(247, 174, 248, 0.15) 0%, rgba(179, 136, 235, 0.1) 50%, rgba(247, 174, 248, 0.08) 100%);
          border-color: rgba(247, 174, 248, 0.4);
          box-shadow: 0 20px 60px rgba(247, 174, 248, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8);
          position: relative;
        }

        .mission-card::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(247, 174, 248, 0.2), transparent);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .mission-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 35px 90px rgba(247, 174, 248, 0.35), inset 0 1px 0 rgba(255, 255, 255, 1);
          border-color: rgba(247, 174, 248, 0.7);
        }

        .vision-card {
          background: linear-gradient(135deg, rgba(114, 221, 247, 0.15) 0%, rgba(128, 147, 241, 0.1) 50%, rgba(114, 221, 247, 0.08) 100%);
          border-color: rgba(114, 221, 247, 0.4);
          box-shadow: 0 20px 60px rgba(114, 221, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8);
          position: relative;
        }

        .vision-card::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(114, 221, 247, 0.2), transparent);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite reverse;
        }

        .vision-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 35px 90px rgba(114, 221, 247, 0.35), inset 0 1px 0 rgba(255, 255, 255, 1);
          border-color: rgba(114, 221, 247, 0.7);
        }

        .mission-card h2, .vision-card h2 {
          font-size: 2rem;
          margin-bottom: 18px;
          font-weight: 800;
          position: relative;
          z-index: 1;
          animation: slideInLeft 0.8s ease-out 0.4s both;
        }

        .mission-card h2 {
          background: linear-gradient(135deg, #F7AEF8 0%, #B388EB 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .vision-card h2 {
          background: linear-gradient(135deg, #72DDF7 0%, #8093F1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .mission-card p, .vision-card p {
          font-size: 1rem;
          color: #555;
          line-height: 1.7;
          font-weight: 500;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.8s ease-out 0.5s both;
        }

        /* ===== VALUES SECTION ===== */
        .values-section {
          padding: 70px 30px;
          background: linear-gradient(180deg, rgba(247, 174, 248, 0.08) 0%, rgba(114, 221, 247, 0.08) 100%);
        }

        .section-title {
          text-align: center;
          margin-bottom: 50px;
        }

        .section-title h2 {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #F7AEF8 0%, #B388EB 50%, #72DDF7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          animation: slideInDown 0.8s ease-out, textGlow 3s ease-in-out infinite;
        }

        .section-title p {
          font-size: 1rem;
          color: #888;
          animation: fadeIn 0.8s ease-out 0.2s both;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 25px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .value-card {
          background: white;
          padding: 35px 25px;
          border-radius: 14px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 2px solid transparent;
          animation: fadeInScale 0.8s ease-out both;
        }

        .value-card:nth-child(1) { animation-delay: 0.4s; }
        .value-card:nth-child(2) { animation-delay: 0.5s; }
        .value-card:nth-child(3) { animation-delay: 0.6s; }
        .value-card:nth-child(4) { animation-delay: 0.7s; }

        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 18px 45px rgba(179, 136, 235, 0.2);
          border-color: #F7AEF8;
        }

        .value-card .icon {
          font-size: 3rem;
          margin-bottom: 15px;
          animation: bounce 2s ease-in-out infinite;
        }

        .value-card h3 {
          font-size: 1.3rem;
          font-weight: 800;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #F7AEF8 0%, #72DDF7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: slideInDown 0.6s ease-out 0.2s both;
        }

        .value-card p {
          color: #777;
          line-height: 1.5;
          font-size: 0.9rem;
          animation: fadeIn 0.8s ease-out 0.4s both;
        }

        /* ===== STATS SECTION ===== */
        .stats-section {
          padding: 70px 30px;
          background: linear-gradient(135deg, #F7AEF8 0%, #B388EB 35%, #8093F1 70%, #72DDF7 100%);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 30px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .stat-item {
          text-align: center;
          color: white;
          animation: fadeInScale 0.8s ease-out both;
        }

        .stat-item:nth-child(1) { animation-delay: 0.4s; }
        .stat-item:nth-child(2) { animation-delay: 0.5s; }
        .stat-item:nth-child(3) { animation-delay: 0.6s; }
        .stat-item:nth-child(4) { animation-delay: 0.7s; }

                .stat-number {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 15px;
          animation: countUp 0.8s ease-out;
          color: white;
          display: inline-block;
          padding: 20px 28px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%);
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 16px;
          backdrop-filter: blur(15px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
          letter-spacing: 2px;
        }

        .stat-item:hover .stat-number {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.2) 100%);
          border-color: rgba(255, 255, 255, 0.8);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.6);
          transform: scale(1.1) rotateZ(5deg);
        }


        .stat-label {
          font-size: 1rem;
          font-weight: 700;
          opacity: 0.95;
          animation: slideInUp 0.8s ease-out 0.2s both;
        }

        /* ===== TEAM SECTION ===== */
        .team-section {
          padding: 70px 30px;
          background: #F4F4ED;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .team-card {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 2px solid rgba(247, 174, 248, 0.1);
          animation: fadeInScale 0.8s ease-out both;
        }

        .team-card:nth-child(1) { animation-delay: 0.4s; }
        .team-card:nth-child(2) { animation-delay: 0.5s; }
        .team-card:nth-child(3) { animation-delay: 0.6s; }
        .team-card:nth-child(4) { animation-delay: 0.7s; }

        .team-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 18px 50px rgba(179, 136, 235, 0.25);
          border-color: rgba(247, 174, 248, 0.4);
        }

        .team-image {
          width: 100%;
          padding: 40px;
          background: linear-gradient(135deg, rgba(247, 174, 248, 0.12) 0%, rgba(114, 221, 247, 0.12) 100%);
          font-size: 4.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .team-content {
          padding: 25px;
          text-align: center;
        }

        .team-content h3 {
          font-size: 1.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #F7AEF8 0%, #72DDF7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 6px;
          animation: slideInDown 0.6s ease-out 0.2s both;
        }

        .team-content p {
          color: #aaa;
          font-weight: 600;
          font-size: 0.9rem;
          animation: fadeIn 0.8s ease-out 0.4s both;
        }

        /* ===== CTA SECTION ===== */
        .cta-section {
          padding: 60px 30px;
          text-align: center;
          background: linear-gradient(135deg, rgba(247, 174, 248, 0.1) 0%, rgba(114, 221, 247, 0.1) 100%);
        }

        .cta-section h2 {
          font-size: 2.2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #F7AEF8 0%, #B388EB 50%, #72DDF7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 15px;
          animation: slideInDown 0.8s ease-out, textGlow 3s ease-in-out infinite;
        }

        .cta-section p {
          font-size: 1rem;
          color: #666;
          margin-bottom: 25px;
          max-width: 550px;
          margin-left: auto;
          margin-right: auto;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .cta-btn {
          display: inline-block;
          padding: 12px 35px;
          background: linear-gradient(135deg, #F7AEF8 0%, #B388EB 100%);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(247, 174, 248, 0.4);
          animation: slideInUp 0.8s ease-out 0.4s both;
        }

        .cta-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 45px rgba(247, 174, 248, 0.6);
        }

        /* ===== ANIMATIONS ===== */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes textGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 0px rgba(247, 174, 248, 0.3));
          }
          50% { 
            filter: drop-shadow(0 0 15px rgba(247, 174, 248, 0.8));
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .mission-vision-section {
            grid-template-columns: 1fr;
            padding: 40px 20px;
            gap: 25px;
          }

          .mission-card, .vision-card {
            padding: 30px 20px;
          }

          .hero-content h1 {
            font-size: 1.8rem;
          }

          .section-title h2 {
            font-size: 1.8rem;
          }

          .cta-section h2 {
            font-size: 1.6rem;
          }

          .mission-card h2, .vision-card h2 {
            font-size: 1.5rem;
          }

          .hero-section {
            padding: 40px 20px;
            min-height: 60vh;
          }

          .values-section, .team-section, .stats-section, .cta-section {
            padding: 50px 20px;
          }

          .stats-grid {
            gap: 20px;
          }

          .team-grid, .values-grid {
            gap: 20px;
          }
        }
      `}</style>


      <div className="about-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>About Nexus</h1>
            <p>
              Connecting FAST Students Through Innovation, Community, and Growth
            </p>
            <Link to="/login" className="hero-btn">
              Join Us Now
            </Link>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-vision-section">
          <div className="mission-card">
            <h2>🎯 Our Mission</h2>
            <p>
              To create a vibrant digital ecosystem where FAST Lahore students can connect, collaborate, and grow together. We aim to facilitate meaningful relationships, organize engaging events, and provide a platform for students to discover societies and opportunities that align with their interests and aspirations.
            </p>
          </div>
          <div className="vision-card">
            <h2>🌟 Our Vision</h2>
            <p>
              To be the go-to platform that empowers every FAST Lahore student to build their network, explore their passions, and discover their true potential. We envision a campus where technology bridges friendships and opportunities, making university life more connected and fulfilling.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="section-title">
            <h2>Our Core Values</h2>
            <p>The principles that drive our mission</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="section-title">
            <h2>Meet Our Team</h2>
            <p>Passionate people making it happen</p>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">{member.image}</div>
                <div className="team-content">
                  <h3>{member.name}</h3>
                  
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Join NexusApis?</h2>
          <p>
            Connect with thousands of FAST Lahore students. Discover events, make friends, and unlock your potential today.
          </p>
          <Link to="/login" className="cta-btn">
            Get Started
          </Link>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
