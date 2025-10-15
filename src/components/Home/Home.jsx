import React from 'react'
// import {get_started} from '../Home/ss.png'
import './Home.css'
import { Link } from 'react-router'
const Home = () => {
  return (
    <>
    <div className='mainHome'>

    <div className='top_image'>

    </div>
    <div className='top_text'>Turn Your sloppy YouTube sessions <br /> into organised study missions.</div>
    <div className='intro_line'>A centralized hub to track your YouTube learning journey, organise scattered content, distill key insights<br />and navigate your studies with clearity.</div>
    {/* <button className="get-started-btn" on>
    </button>     */}
    <Link to='/login' className='get_started_btn'>
      {/* <span className="started">STARTED</span>
      <span className="get">GET</span> */}
      <img className='text-white' src='../assets/ss.png' alt="get started" />
    </Link>
    </div>
    </>
  )
}

export default Home