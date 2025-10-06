import React from 'react'
import { HiMenuAlt1 } from "react-icons/hi";
import { BsMenuButtonWide } from "react-icons/bs";
import './Header.css'
const Header = () => {
  return (
    <>
    <div className="navbar">
        <nav>
        <div className="nav-1"> <BsMenuButtonWide />
</div>
        <div className="nav-center"> 
           
            <h1>  <img width={50} src="https://media.istockphoto.com/id/155419717/photo/peacock-feather.jpg?s=2048x2048&w=is&k=20&c=urBINkOHhD9B8ONQ9BY1vWelSmIbJR0ohAC3Xsw0BtE=" alt="" /> &nbsp; Macro</h1>
        </div>
        <div className="nav-2"> 
            <ul>
                <li>Home</li>
                <li>Reviews</li>
                <li>Benefits</li>
                <li>About Us</li>
            </ul>
        </div>
    </nav>
    {/* <div className="line"></div> */}
    </div>
    </>
  )
}

export default Header