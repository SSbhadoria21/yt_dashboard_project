import React, { useState } from 'react'
// import {get_started} from '../Home/ss.png'
import './Home.css'
import logo from '../assets/crucible.jpeg'
import { Link } from 'react-router'
import video from './dashboardvideo.mp4'
// import { GrDashboard } from 'react-icons/gr';
const Home = () => {
  const [showMenu,setShowMenu] = useState(false);
  return (
    <>
    <div className='mainHome'>

    <div className='top_image'>
  <div className="home-full">
        <nav className="navbar">
        <div className="nav-left">
          <img
            src={logo}
            alt="logo"
            className="logo"
          />
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
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/profile")}>Your Profile</li>
            <li>Benefits</li>
            <li>About Us</li>
          </ul>
        </div>
      )}
    <div className="top-image"> 
      
    </div>
    <div className="top-text text-white">
      Turn your sloppy YouTube sessions  
      <br />into organised study missions. 
    </div>
    <div className=" text-white line-text">
      A centralized hub to track your YouTube learning journey, organize scattered content, <br />distill key insights
and navigate your studies with clarity.
    </div>
    <Link className='link-login' to="/login">
    <div className='btn-img'>

    </div>
     </Link>
    <div className="video-box">
      <div className="videos"> 
        <video src={video} autoPlay loop muted controls></video>
      </div>
    </div>
  </div>
    </>
  )
}

export default Home