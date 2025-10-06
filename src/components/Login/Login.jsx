import { signInWithEmailAndPassword } from "firebase/auth";
import React,{useState} from "react";

import { Link } from "react-router";
import { ToastContainer } from "react-toastify";

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
        <form onSubmit={handlesubmit}>
            <h3>Login</h3>

            <div className="mb-3"> 
                <label> Email Address</label>
                <input type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                 />
            </div>
            <div className="mb-3"> 
                <label> Password</label>
                <input type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
            </div>
            <div className="d-grid"> 
                <button type="submit" className="btn btn-primary"> Submit</button>
            </div>
             <p className="forgot-password">
        New user <Link to="/register">Register Here</Link>
      </p>
       <Signgoogle/>
        </form>
        </>
    )
}

export default Login;