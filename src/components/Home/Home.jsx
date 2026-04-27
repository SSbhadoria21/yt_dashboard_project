import React, { useState } from "react";
import "./Home.css";
import clogo from "../assets/ultaclogo.jpeg";
import { Link } from "react-router-dom";
import video from "../assets/crucible-video.mp4";

const benefits = [
  {
    title: "Personalized Learning Dashboard",
    desc: "Turn YouTube playlists into structured courses with progress tracking and smart analytics.",
  },
  {
    title: "AI Summaries & Insights",
    desc: "Get instant topic-wise summaries, key points, and AI-generated explanations for deeper understanding.",
  },
  {
    title: "Quiz & Revision Mode",
    desc: "Challenge yourself with AI-generated quizzes and improve retention after every video.",
  },
  {
    title: "Smart Organization",
    desc: "Track, plan, and manage all your YouTube learning playlists in one simple platform.",
  },
  {
    title: "Consistency Tracker",
    desc: "Stay motivated with streaks, performance insights, and reminders to build learning habits.",
  },
];

const Home = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="home-full">
  
        <nav className="navbar">
          <div className="nav-left">
            <img src={clogo} alt="logo" className="logo" />
            <h1 className="brand text-[2.3rem]">Crucible</h1>
          </div>
          <div className="nav-right">
            <img
              src="https://freedesignfile.com/image/preview/19038/xbox-controller-gamepad-drawing-black-and-white-clipart.png"
              alt="controller"
              className="controller-icon"
              onClick={() => setShowMenu(true)}
            />
          </div>
        </nav>

        {showMenu && (
          <div className="fullscreen-menu">
            <button className="close-btn" onClick={() => setShowMenu(false)}>
              ✖
            </button>
            <ul>
              <li>Home</li>
              <li>Your Profile</li>
              <li>Benefits</li>
              <li>About Us</li>
            </ul>
          </div>
        )}

        <div className="top-image"></div>
        <div className="top-text text-white">
          Turn your sloppy YouTube sessions
          <br />
          into organised study missions.
        </div>
        <div className="text-white line-text">
          A centralized hub to track your YouTube learning journey, organize
          scattered content, <br />
          distill key insights and navigate your studies with clarity.
        </div>
        <Link className="link-login" to="/login">
          <div className="btn-img"></div>
        </Link>

        <div className="video-box">
          <div className="videos">
            <video src={video} autoPlay loop muted ></video>
          </div>
        </div>

        <section className="benefits-section">
          <h2 className="benefit-heading">✨ Why Choose Crucible?</h2>
          <div className="carousel-container">
            <div className="carousel-track">
              {benefits.map((item, index) => (
                <div key={index} className="benefit-card">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-text">
            <h2>🚀 What We Do</h2>
            <p>
              Crucible transforms the chaos of random YouTube learning into a
              seamless, AI-driven study experience. The platform intelligently
              converts playlists into personalized courses, summarizes content,
              generates quizzes, and helps you stay consistent with smart
              analytics. It’s your one-stop hub to learn efficiently, stay
              motivated, and achieve your learning goals faster.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
