import { signInWithEmailAndPassword } from "firebase/auth";
import React,{useState} from "react";
import "./Login.css"
import { Link } from "react-router";
import { ToastContainer } from "react-toastify";
import '../Home/photo.jpg'
import photo from '../Home/photo.jpg'
import logo from '../assets/crucible.jpeg'
import { auth } from "../firebase";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Signgoogle from "../Google-Login/Signgoogle";
function Login(){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const handlesubmit= async (e)=>{
e.preventDefault();
try {
    await signInWithEmailAndPassword(auth,email,password)
    window.location.href="/profile";
    console.log("User Login Successfully");
    toast.success("User Login Successfully",{position:"top-center",});
} catch (error) {
    console.log(error.message);
    toast.success(error.message,{position:"bottom-center",});
}
    }


    return(
       
        <>
       
       <div className="full">
         <div className="header">
<nav>
    <div className="nav1">
         <img width={50} src={logo} alt="" /><h1>Crucible</h1>
         </div>
    <div className="nav2"> 
        <img width={60} height={60} src="https://freedesignfile.com/image/preview/19038/xbox-controller-gamepad-drawing-black-and-white-clipart.png" alt="" />
        </div>
</nav>
        </div>
        <div className="main">
            <div className="part1">
                <div className="welcome"> Welcome Back User!</div>
                <div className="formbox">
                    <div className="btn">
                        Login
                    </div>
                    <form onSubmit={handlesubmit} className="login-box">
                        <div className="email element">
                            <label htmlFor="">Email</label>
                            <input type="email"
                        placeholder="Email"
                        value={email}
                        required
                        onChange={(e)=>setEmail(e.target.value)}
                        />
                        </div>
                       <div className="password element">
                          <label htmlFor="">Password</label>
                           <input type="password"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={(e)=>setPassword(e.target.value)}
                        />
                       </div>
                        <button className="enter-btn"> Enter</button>
                    </form>
                </div>
                <div className="line">-------------------------------------------------------------------------------------</div>
                <div className="continue">
                    Continue With
                </div>
                <div className="google">
                    <button className="google-btn"> <img width={60} src="https://cdn.freebiesupply.com/logos/thumbs/2x/google-g-2015-logo.png" alt="" /> 
                    <Signgoogle/>
                    </button>
                </div>
 </div>
<div className="part2">
     <img width={1500} src={photo} alt="" />
     <div className="new-here">
        New Here?
     </div>
     <div className="register-text">
        <h3>SignUp to get your very own personalised &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; YouTube gamezone!</h3>
     </div>
     <div className="register-btn"><Link to="/register">Register Here</Link> </div>
</div>
        </div>
       </div>
        </>
    )
}

export default Login;