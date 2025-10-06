import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth,db } from '../firebase'
import { toast } from 'react-toastify'
import { setDoc, doc } from 'firebase/firestore'

const Signgoogle = () => {
    function googleLogin(){
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth,provider).then(async(result)=>{
            const user = result.user;
            console.log(user);
            if(user){
                await setDoc(doc(db,"users",user.uid),{
                
                fname:user.displayName,
                email:user.email,
                photo: user.photoURL,
                
                
                });
                toast.success("User Login Successfully",{position:"top-center",});
                window.location.href="/profile";
            }
        }).catch((error)=>{
            console.log(error);
        })
    }
  return (
  <>
   <p> -- or Continue With --</p>
   <div onClick={googleLogin}>Sign In With Google</div>
  </>
  )
}

export default Signgoogle