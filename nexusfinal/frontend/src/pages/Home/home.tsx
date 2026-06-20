import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});

  const slides = [
    { id: 1, image: '/images/fast_uni.jpg', title: 'FAST University Lahore', description: 'Excellence in Education' },
    { id: 2, image: '/images/friends.jpg', title: 'Campus Friends', description: 'Building Lasting Connections' },
    { id: 3, image: '/images/campus life.jpg', title: 'Campus Life', description: 'Vibrant University Experience' },
    { id: 4, image: '/images/events.jpg', title: 'University Events', description: 'Celebrating Together' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll('.animated-section');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <>
      <style>{`
        .home-container {
          width: 100%;
          background: #F4F4ED;
        }

        /* Fixed Slider Styles */
        .slider-container {
          width: 100%;
          height: 70vh;
          min-height: 500px;
          max-height: 700px;
          position: relative;
          overflow: hidden;
          margin-top: 0;
          background: linear-gradient(135deg, rgba(247, 174, 248, 0.1) 0%, rgba(114, 221, 247, 0.1) 100%);
        }

        .slider-wrapper {
          display: flex;
          width: ${slides.length * 100}%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform: translateX(-${currentSlide * (100 / slides.length)}%);
        }

        .slide {
          width: ${100 / slides.length}%;
          height: 100%;
          position: relative;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, rgba(247, 174, 248, 0.15), rgba(114, 221, 247, 0.15));
        }

        .slide-image {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: 100%;
          object-fit: contain;
          filter: brightness(0.95);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
        }

        .slide-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
          padding: 3rem 2rem 2rem;
          color: #F4F4ED;
        }

        .slide-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
        }

        .slide-description {
          font-size: 1.3rem;
          opacity: 0.95;
          text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
        }

        .slider-dots {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
          z-index: 10;
        }

        .dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgba(244, 244, 237, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 3px solid rgba(244, 244, 237, 0.6);
        }

        .dot.active {
          background: #F4F4ED;
          transform: scale(1.3);
          box-shadow: 0 0 15px rgba(244, 244, 237, 0.8);
        }

        /* Section Styles with Split Layout */
        .section {
          padding: 6rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .section-content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .section-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          min-height: 500px;
        }

        .section-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .section-title {
          font-size: 3.6rem;
          font-weight: 800;
          margin-bottom: 2rem;
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding-left: 1.5rem;
          text-transform: capitalize;
          letter-spacing: 0.02em;
          background: linear-gradient(120deg, #F7AEF8 0%, #B388EB 40%, #72DDF7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
          animation: headingGlow 6s ease-in-out infinite;
        }

        .section-title .emoji {
          font-size: 2.8rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.9), rgba(247,174,248,0.3));
          box-shadow: 0 10px 20px rgba(179, 136, 235, 0.3);
        }

        .section-title::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate(-110%, -50%);
          width: 80px;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(120deg, #F7AEF8, #72DDF7);
          box-shadow: 0 0 20px rgba(247, 174, 248, 0.7);
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -18px;
          left: 1.5rem;
          width: 120px;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(247, 174, 248, 0.3), rgba(114, 221, 247, 0.8));
          filter: blur(0.5px);
        }
        @keyframes headingGlow {
          0% {
            text-shadow: 0 6px 25px rgba(179, 136, 235, 0.35);
          }
          50% {
            text-shadow: 0 8px 35px rgba(114, 221, 247, 0.65);
          }
          100% {
            text-shadow: 0 6px 25px rgba(179, 136, 235, 0.35);
          }
        }

        .section-content {
          font-size: 1.3rem;
          line-height: 2.2;
          margin-bottom: 2.5rem;
        }

        .section-illustration {
          position: relative;
          height: 100%;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(50px);
          transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animated-section .section-illustration {
          opacity: 1;
          transform: translateX(0);
        }

        .section-text {
          opacity: 0;
          transform: translateX(-50px);
          transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animated-section .section-text {
          opacity: 1;
          transform: translateX(0);
        }

        /* Overview Section - Plum Background */
        .overview-section {
          background: linear-gradient(135deg, rgba(247, 174, 248, 0.12) 0%, rgba(247, 174, 248, 0.03) 100%);
        }

        .overview-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(247, 174, 248, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(179, 136, 235, 0.1) 0%, transparent 50%);
          opacity: 0.6;
          pointer-events: none;
        }

        .overview-section .section-title {
          background: linear-gradient(135deg, #F7AEF8 0%, #B388EB 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .overview-section .section-title::after {
          background: linear-gradient(90deg, #F7AEF8, #B388EB);
        }

        .overview-section .section-content {
          color: #333;
        }

        .nexus-logos-block {
          display: flex;
          justify-content: flex-start;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin: 2rem 0;
        }

        .nexus-logo-block {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #F7AEF8 0%, #B388EB 25%, #8093F1 50%, #72DDF7 75%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(179, 136, 235, 0.3);
          transition: all 0.4s ease;
          animation: logoFloat 4s ease-in-out infinite;
        }

        .nexus-logo-block:nth-child(2) { animation-delay: 0.3s; }
        .nexus-logo-block:nth-child(3) { animation-delay: 0.6s; }
        .nexus-logo-block:nth-child(4) { animation-delay: 0.9s; }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }

        .nexus-logo-block:hover {
          transform: scale(1.15) translateY(-5px);
        }

        .nexus-logo-block svg {
          width: 50px;
          height: 50px;
        }

        .join-us-btn {
          display: inline-block;
          margin-top: 2rem;
          padding: 1.2rem 3rem;
          font-size: 1.2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #F7AEF8 0%, #B388EB 50%, #8093F1 100%);
          color: #F4F4ED;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 15px 40px rgba(179, 136, 235, 0.5);
        }

        .join-us-btn:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 50px rgba(179, 136, 235, 0.7);
        }

        /* Illustration Styles */
        .illustration-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: illustrationFloat 4s ease-in-out infinite;
        }

        .animated-illustration {
          width: 100%;
          max-width: 500px;
          height: auto;
          animation: floatIn 1s ease-out;
        }

        .gif-illustration {
          width: 100%;
          max-width: 500px;
          height: auto;
          border-radius: 28px;
          box-shadow: 0 20px 45px rgba(179, 136, 235, 0.35);
          object-fit: cover;
          background: radial-gradient(circle, rgba(247, 174, 248, 0.2), rgba(128, 147, 241, 0.2));
        }

        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes illustrationFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-12px) scale(1.03);
          }
        }

        /* Societies Section - Bright Lavender Background */
        .societies-section {
          background: linear-gradient(135deg, rgba(179, 136, 235, 0.12) 0%, rgba(179, 136, 235, 0.03) 100%);
        }

        .societies-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 30% 40%, rgba(179, 136, 235, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(128, 147, 241, 0.1) 0%, transparent 50%);
          opacity: 0.6;
          pointer-events: none;
        }

        .societies-section .section-title {
          background: linear-gradient(135deg, #B388EB 0%, #8093F1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .societies-section .section-title::after {
          background: linear-gradient(90deg, #B388EB, #8093F1);
        }

        .societies-section .section-content {
          color: #333;
        }

        .societies-highlights {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin: 2rem 0;
        }

        .society-badge,
        .event-badge,
        .announcement-item {
          background: linear-gradient(140deg, rgba(255, 255, 255, 0.25), rgba(247, 174, 248, 0.35));
          padding: 1.1rem 2.2rem;
          border-radius: 20px;
          font-weight: 800;
          font-size: 1.15rem;
          color: #3e1d69;
          border: 1px solid rgba(247, 174, 248, 0.4);
          transition: all 0.35s ease;
          box-shadow: 0 18px 35px rgba(179, 136, 235, 0.25);
          display: inline-flex;
          align-items: center;
          gap: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          backdrop-filter: blur(6px);
        }

        .society-badge:hover,
        .event-badge:hover,
        .announcement-item:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 28px 55px rgba(179, 136, 235, 0.35);
          color: #240d48;
        }

        .read-more-btn {
          display: inline-block;
          margin-top: 1.5rem;
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 700;
          background: transparent;
          color: #B388EB;
          border: 3px solid #B388EB;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .read-more-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #B388EB 0%, #8093F1 100%);
          transition: left 0.3s;
          z-index: -1;
        }

        .read-more-btn:hover::before {
          left: 0;
        }

        .read-more-btn:hover {
          color: #F4F4ED;
          transform: translateY(-3px);
        }

        /* Events Section - Wisteria Blue Background */
        .events-section {
          background: linear-gradient(135deg, rgba(128, 147, 241, 0.12) 0%, rgba(128, 147, 241, 0.03) 100%);
        }

        .events-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 25% 35%, rgba(128, 147, 241, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 65%, rgba(114, 221, 247, 0.1) 0%, transparent 50%);
          opacity: 0.6;
          pointer-events: none;
        }

        .events-section .section-title {
          background: linear-gradient(135deg, #8093F1 0%, #72DDF7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .events-section .section-title::after {
          background: linear-gradient(90deg, #8093F1, #72DDF7);
        }

        .events-section .section-content {
          color: #333;
        }

        .events-highlights {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin: 2rem 0;
        }

        .event-badge {
          background: linear-gradient(135deg, rgba(128, 147, 241, 0.2) 0%, rgba(114, 221, 247, 0.2) 100%);
          padding: 1rem 1.8rem;
          border-radius: 15px;
          font-weight: 700;
          font-size: 1.1rem;
          color: #8093F1;
          border: 2px solid rgba(128, 147, 241, 0.3);
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(128, 147, 241, 0.2);
        }

        .event-badge:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(128, 147, 241, 0.4);
        }

        /* Announcements Section - Sky Blue Background */
        .announcements-section {
          background: linear-gradient(135deg, rgba(114, 221, 247, 0.12) 0%, rgba(114, 221, 247, 0.03) 100%);
        }

        .announcements-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 35% 45%, rgba(114, 221, 247, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 65% 55%, rgba(247, 174, 248, 0.1) 0%, transparent 50%);
          opacity: 0.6;
          pointer-events: none;
        }

        .announcements-section .section-title {
          background: linear-gradient(135deg, #72DDF7 0%, #F7AEF8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .announcements-section .section-title::after {
          background: linear-gradient(90deg, #72DDF7, #F7AEF8);
        }

        .announcements-section .section-content {
          color: #333;
        }

        .announcements-list {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin: 2rem 0;
        }

        .announcement-item {
          background: linear-gradient(135deg, rgba(114, 221, 247, 0.2) 0%, rgba(247, 174, 248, 0.2) 100%);
          padding: 1rem 1.8rem;
          border-radius: 15px;
          font-weight: 700;
          font-size: 1.1rem;
          color: #72DDF7;
          border: 2px solid rgba(114, 221, 247, 0.3);
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(114, 221, 247, 0.2);
        }

        .announcement-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(114, 221, 247, 0.4);
        }

        /* Join Us Section - Gradient Background */
        .join-us-section {
          background: linear-gradient(135deg, #B388EB 0%, #8093F1 50%, #72DDF7 100%);
          color: #F4F4ED;
        }

        .join-us-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(244, 244, 237, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(244, 244, 237, 0.1) 0%, transparent 50%);
          opacity: 0.5;
          pointer-events: none;
        }

        .join-us-section .section-title {
          color: #F4F4ED;
          background: none;
          -webkit-text-fill-color: #F4F4ED;
          text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
        }

        .join-us-section .section-title::after {
          background: #F4F4ED;
        }

        .join-us-section .section-content {
          color: #F4F4ED;
          font-size: 1.3rem;
        }

        .join-us-section .read-more-btn {
          border-color: #F4F4ED;
          color: #F4F4ED;
        }

        .join-us-section .read-more-btn::before {
          background: #F4F4ED;
        }

        .join-us-section .read-more-btn:hover {
          color: #8093F1;
        }
        .about-us-section .read-more-btn {
         border-color: #B388EB;
         color: #B388EB;
         display: inline-block;
         padding: 1rem 2.5rem;
        }


        .about-us-section .read-more-btn::before {
          background-color: #B388EB;
          
        }

        .about-us-section .read-more-btn:hover {
          color: #F4F4ED;
          
        }


        /* About Us Section - Porcelain Background */
        .about-us-section {
          background: #F4F4ED;
          padding-bottom: 5rem;
        }

        .about-us-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 50% 50%, rgba(179, 136, 235, 0.05) 0%, transparent 70%);
          opacity: 0.5;
          pointer-events: none;
        }

        .about-us-section .section-title {
          background: linear-gradient(135deg, #B388EB 0%, #8093F1 50%, #72DDF7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-us-section .section-title::after {
          background: linear-gradient(90deg, #B388EB, #8093F1, #72DDF7);
        }

        .about-us-content {
          font-size: 1.2rem;
          line-height: 2;
          color: #333;
        }

        /* SVG Illustrations */
        .illustration-svg {
          width: 100%;
          height: auto;
          max-width: 500px;
        }

        /* Animated Emoji Styles */
        .emoji {
          display: inline-block;
          font-size: 1.5rem;
          margin: 0 0.3rem;
          vertical-align: middle;
        }

        .emoji-bounce {
          animation: emojiBounce 2s ease-in-out infinite;
        }

        .emoji-rotate {
          animation: emojiRotate 3s linear infinite;
        }

        .emoji-pulse {
          animation: emojiPulse 2s ease-in-out infinite;
        }

        .emoji-shake {
          animation: emojiShake 2s ease-in-out infinite;
        }

        .emoji-swing {
          animation: emojiSwing 2.5s ease-in-out infinite;
          transform-origin: top center;
        }

        .emoji-wiggle {
          animation: emojiWiggle 1.5s ease-in-out infinite;
        }

        .emoji-float {
          animation: emojiFloat 3s ease-in-out infinite;
        }

        .emoji-spin {
          animation: emojiSpin 4s linear infinite;
        }

        @keyframes emojiBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes emojiRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes emojiPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }

        @keyframes emojiShake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px) rotate(-5deg);
          }
          75% {
            transform: translateX(5px) rotate(5deg);
          }
        }

        @keyframes emojiSwing {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(10deg);
          }
          75% {
            transform: rotate(-10deg);
          }
        }

        @keyframes emojiWiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(5deg);
          }
          50% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(3deg);
          }
        }

        @keyframes emojiFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes emojiSpin {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.2);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        .society-badge .emoji,
        .event-badge .emoji,
        .announcement-item .emoji {
          font-size: 1.3rem;
          margin-right: 0.5rem;
        }

        @media (max-width: 968px) {
          .section-split {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .section-illustration {
            order: -1;
            min-height: 300px;
          }

          .slider-container {
            height: 50vh;
            min-height: 400px;
          }

          .slide-title {
            font-size: 2rem;
          }

          .slide-description {
            font-size: 1rem;
          }

          .section-title {
            font-size: 2.5rem;
          }

          .section-content {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 768px) {
          .section {
            padding: 4rem 1.5rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .section-title .emoji {
            font-size: 1.8rem;
          }

          .section-content {
            font-size: 1rem;
          }

          .slider-container {
            height: 40vh;
            min-height: 300px;
          }

          .emoji {
            font-size: 1.2rem;
          }

          .society-badge .emoji,
          .event-badge .emoji,
          .announcement-item .emoji {
            font-size: 1.1rem;
          }
        }
      `}</style>

      <div className="home-container">
        {/* Fixed Image Slider */}
        <div className="slider-container">
          <div className="slider-wrapper">
            {slides.map((slide, index) => (
              <div key={slide.id} className="slide">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="slide-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.style.background = 'linear-gradient(135deg, #F7AEF8 0%, #B388EB 25%, #8093F1 50%, #72DDF7 75%)';
                  }}
                />
                <div className="slide-overlay">
                  <h2 className="slide-title">{slide.title}</h2>
                  <p className="slide-description">{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="slider-dots">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Overview Section with Illustration */}
        <div id="overview" className="section overview-section animated-section">
          <div className="section-content-wrapper">
            <div className="section-split">
              <div className="section-text">
                <h2 className="section-title">
                  <span className="emoji emoji-pulse">👋</span>
                  Welcome to Nexus
                </h2>
                <p className="section-content">
                  Nexus is your comprehensive platform for campus life at FAST University Lahore. 
                  Connect with your peers, discover exciting events, join vibrant societies, and stay 
                  updated with all campus announcements. Whether you're looking to expand your network, 
                  participate in events like TEDx and Medal Ceremony, or join societies like Softec, 
                  FAST Business Club, and FLS, Nexus is your gateway to an enriched university experience.
                </p>
                <div className="nexus-logos-block">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="nexus-logo-block">
                      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id={`logoGrad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#F7AEF8" />
                            <stop offset="25%" stopColor="#B388EB" />
                            <stop offset="50%" stopColor="#8093F1" />
                            <stop offset="75%" stopColor="#72DDF7" />
                            <stop offset="100%" stopColor="#F7AEF8" />
                          </linearGradient>
                        </defs>
                        <circle cx="20" cy="20" r="18" fill={`url(#logoGrad${i})`} opacity="0.9" />
                        <path d="M20 8 L26 16 L20 20 L14 16 Z" fill="#F4F4ED" />
                        <path d="M26 16 L32 20 L26 24 L20 20 Z" fill="#F4F4ED" opacity="0.9" />
                        <path d="M14 16 L20 20 L14 24 L8 20 Z" fill="#F4F4ED" opacity="0.9" />
                        <path d="M20 20 L26 24 L20 32 L14 24 Z" fill="#F4F4ED" opacity="0.8" />
                        <circle cx="20" cy="20" r="3" fill={`url(#logoGrad${i})`} />
                      </svg>
                    </div>
                  ))}
                </div>
                <Link to="/login" className="join-us-btn">
                  <span className="emoji emoji-bounce">✨</span>
                  Join Us
                </Link>
              </div>
              <div className="section-illustration">
                <div className="illustration-container">
                  <img
                    src="/images/nexus-welcome.gif"
                    alt="Students connecting through Nexus"
                    className="gif-illustration"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Societies Section with Illustration */}
        <div id="societies" className="section societies-section animated-section">
          <div className="section-content-wrapper">
            <div className="section-split">
              <div className="section-illustration">
                <div className="illustration-container">
                  <img
                    src="/images/society.gif"
                    alt="Animated society illustration"
                    className="gif-illustration"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <div className="section-text">
                <h2 className="section-title">
                  <span className="emoji emoji-bounce">👥</span>
                  Societies
                </h2>
                <p className="section-content">
                  Join our vibrant community of societies and clubs at FAST University Lahore. 
                  From technical excellence with SoFtec to business innovation with FAST Business Club, 
                  and language learning with FLS, there's a society for every interest. Connect with 
                  like-minded students, develop new skills, and be part of something bigger.
                </p>
                <div className="societies-highlights">
                  <div className="society-badge">
                    <span className="emoji emoji-bounce">👥</span>
                    Softec
                  </div>
                  <div className="society-badge">
                    <span className="emoji emoji-pulse">💼</span>
                    FAST Business Club
                  </div>
                  <div className="society-badge">
                    <span className="emoji emoji-rotate">🌍</span>
                    FLS
                  </div>
                </div>
                <Link to="/societies" className="read-more-btn">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section with Illustration */}
        <div id="events" className="section events-section animated-section">
          <div className="section-content-wrapper">
            <div className="section-split">
              <div className="section-text">
                <h2 className="section-title">
                  <span className="emoji emoji-shake">🎉</span>
                  Events
                </h2>
                <p className="section-content">
                  Experience the excitement of campus events at FAST University Lahore. Attend inspiring 
                  TEDx talks, celebrate achievements at the Medal Ceremony, and participate in meaningful 
                  events like Shajrah e Umeed. Stay connected with all upcoming events and never miss 
                  out on opportunities to learn, network, and grow.
                </p>
                <div className="events-highlights">
                  <div className="event-badge">
                    <span className="emoji emoji-shake">🎤</span>
                    TEDx
                  </div>
                  <div className="event-badge">
                    <span className="emoji emoji-swing">🏆</span>
                    Medal Ceremony
                  </div>
                  <div className="event-badge">
                    <span className="emoji emoji-wiggle">🌟</span>
                    Shajrah e Umeed
                  </div>
                </div>
                <Link to="/events" className="read-more-btn">
                  Read More
                </Link>
              </div>
              <div className="section-illustration">
                <div className="illustration-container">
                  <img
                    src="/images/events.gif"
                    alt="Animated events illustration"
                    className="gif-illustration"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements Section with Illustration */}
        <div id="announcements" className="section announcements-section animated-section">
          <div className="section-content-wrapper">
            <div className="section-split">
              <div className="section-illustration">
                <div className="illustration-container">
                  <img
                    src="/images/announcement.gif"
                    alt="Animated announcements illustration"
                    className="gif-illustration"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <div className="section-text">
                <h2 className="section-title">
                  <span className="emoji emoji-float">📢</span>
                  Announcements
                </h2>
                <p className="section-content">
                  Stay updated with all important campus announcements. Access your class timetables, 
                  check exam datesheets, and be informed about holidays and special events. Never miss 
                  an important update that affects your academic journey.
                </p>
                <div className="announcements-list">
                  <div className="announcement-item">
                    <span className="emoji emoji-float">📅</span>
                    Timetable
                  </div>
                  <div className="announcement-item">
                    <span className="emoji emoji-spin">📋</span>
                    Datesheet
                  </div>
                  <div className="announcement-item">
                    <span className="emoji emoji-bounce">🎉</span>
                    Holidays
                  </div>
                </div>
                <Link to="/announcements" className="read-more-btn">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Join Us Section */}
        <div id="join-us" className="section join-us-section animated-section">
          <div className="section-content-wrapper">
            <div className="section-split">
              <div className="section-text">
                <h2 className="section-title">
                  <span className="emoji emoji-pulse">🚀</span>
                  Join Us
                </h2>
                <p className="section-content">
                  Become part of the Nexus community today! Join thousands of students who are already 
                  connected, engaged, and making the most of their university experience. Sign up now 
                  and unlock a world of opportunities.
                </p>
                <Link to="/login" className="read-more-btn">
                  Join Us
                </Link>
              </div>
              <div className="section-illustration">
                <div className="illustration-container">
                  <svg className="illustration-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Welcome illustration */}
                    <circle cx="200" cy="200" r="120" fill="rgba(244, 244, 237, 0.2)" />
                    <ellipse cx="200" cy="180" rx="50" ry="70" fill="#F4F4ED" />
                    <rect x="170" y="240" width="60" height="90" rx="30" fill="#F4F4ED" />
                    <path d="M150 200 Q200 220 250 200" stroke="#F4F4ED" strokeWidth="4" fill="none" />
                    <circle cx="185" cy="165" r="5" fill="#8093F1" />
                    <circle cx="215" cy="165" r="5" fill="#8093F1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div id="about-us" className="section about-us-section animated-section">
          <div className="section-content-wrapper">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="emoji emoji-rotate">ℹ️</span>
              About Us
            </h2>
            <p className="about-us-content">
              Nexus is designed to bring the FAST University Lahore community together. We understand 
              the importance of staying connected, informed, and engaged during your university journey. 
              Our platform provides a seamless experience for discovering events, joining societies, 
              accessing announcements, and building lasting connections with your peers. At Nexus, 
              we believe in creating a vibrant, inclusive, and supportive campus environment for all students.
            </p>
            <Link to="/about-us" className="read-more-btn">
              Read More
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
