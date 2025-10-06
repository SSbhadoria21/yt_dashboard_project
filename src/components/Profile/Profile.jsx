import React,{useEffect, useState} from 'react'
import {auth,db} from '../firebase'
import {doc,getDoc} from 'firebase/firestore'


const Profile = () => {
    const [userDetails,setUserDetails]=useState(null);
const fetchUserDetails= async()=>{
    auth.onAuthStateChanged(async (user) =>{
        console.log(user);
       
        const docref = doc(db,"users",user.uid);
        const docSnap = await getDoc(docref);
        if(docSnap.exists()){
            console.log("Document data:", docSnap.data());
            setUserDetails(docSnap.data());
        }else{
            console.log("No such document!");
        }
        
    })
}
useEffect(()=>{
fetchUserDetails();
},[])
async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }
  return (
    <div>
        {userDetails ? (
           <>
           <div style={{ display: "flex" }}>
            <img
              src={userDetails.photo}
              width={50}
              style={{ borderRadius: "50%" }}
            />
          </div>
            <h3>Welcome {userDetails.fname}</h3>
            <div>
                <p>First Name: {userDetails.fname}</p>
                <p>Last Name: {userDetails.lname}</p>
                <p>Email: {userDetails.email}</p>
            </div>
            <button onClick={handleLogout}> Logout </button>
           </>
        ) : (
            <div>No user details found.</div>
        )}
    </div>
  )
}

export default Profile