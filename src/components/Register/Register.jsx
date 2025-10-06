import { createUserWithEmailAndPassword } from "firebase/auth";
import React,{useState} from "react";
import { setDoc,doc } from "firebase/firestore";
import { auth,db } from "../firebase";
import { toast } from "react-toastify";

function Register(){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [fname,setFname]=useState("");
    const [lname,setLname]=useState("");



 const handleregister= async(e)=>{

 e.preventDefault();
 try {
    await createUserWithEmailAndPassword(auth,email,password)
const user = auth.currentUser;
console.log(user);
if(user){
await setDoc(doc(db,"users",user.uid),{

fname:fname,
lname:lname,
email:email,
photo: "",
uid:user.uid

});

}

console.log("User Register Successfully");
toast.success("User Register Successfully",{position:"top-center",});
 } catch (error) {

 console.log(error.message);
toast.success(error.message,{position:"bottom-center",});


}
}
    return(
        <>
        <form onSubmit={handleregister}>
            <h3>Sign Up</h3>
            <div className="mb-3">
                <label > First Name</label>
                <input type="text"
                className="form-control"
                placeholder="First Name"
                value={fname}
                onChange={(e)=>setFname(e.target.value)}
                required
                />
            </div>
            <div className="mb-3"> 
                <label > Last Name</label>
                <input type="text"
                className="form-control"
                placeholder="Last Name"
                value={lname}
                onChange={(e)=>setLname(e.target.value)}
                required
                />
            </div>
            <div className="mb-3"> 
                <label > Email Address</label>
                <input type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
            </div>
            <div className="mb-3"> 
                <label > Password</label>
                <input type="text"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                />
            </div>
            <div className="d-grid">
                <button type="submit" className="btn btn-primary"> Sign Up</button>
            </div>
            
        </form>
        </>
    )
}
// edit check
export default Register;