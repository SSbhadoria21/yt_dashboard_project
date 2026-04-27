

import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const handleregister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          fname,
          lname,
          email,
          photo: "",
          uid: user.uid,
        });
      }

      console.log("User Registered Successfully");
      toast.success("User Registered Successfully", { position: "top-center" });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1 className="register-title">Create Account</h1>
        <form onSubmit={handleregister} className="register-form">
          <input
            type="text"
            placeholder="First Name"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="register-btn">Register</button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>

      <div className="register-right">
        <div className="overlay">
          <h2>Welcome to <span>Crucible</span></h2>
          <p>Turn your YouTube playlists into your personalized learning dashboard!</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
