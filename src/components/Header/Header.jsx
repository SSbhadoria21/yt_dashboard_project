import React from 'react'
import { HiMenuAlt1 } from "react-icons/hi";
import './Header.css'
const Header = () => {
  return (
    <>
    <div className="navbar">
        <nav>
        <div className="nav-1"> <HiMenuAlt1 />
</div>
        <div className="nav-center"> 
           
            <h1>  <img width={50} src="https://lh3.googleusercontent.com/a/ACg8ocKtygZ_KuOrfYoXmnBL-VG_Syyf-chdm61Rz5hZFENjDK8aKg=s96-c" alt="" /> &nbsp; Macro</h1>
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
    <div className="line"></div>
    </div>
    </>
  )
}

export default Header