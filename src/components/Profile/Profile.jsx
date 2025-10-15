import React,{useEffect, useState} from 'react'
import {auth,db} from '../firebase'
import {collection,doc,getDoc,getDocs} from 'firebase/firestore'
import './Profile.css'
import { BiFoodMenu } from "react-icons/bi";
import AddPlaylist from './AddPlaylist'
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const [userDetails,setUserDetails]=useState(null);
    const {user } = useAuth();
      const Navigate = useNavigate();
      const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    const fetchPlaylists = async () => {
      const userRef = doc(db, "users", user.uid);
      const playlistsRef = collection(userRef, "playlists");
      const snapshot = await getDocs(playlistsRef);
      setPlaylists(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchPlaylists();
  }, [user]);


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
           {/* <div style={{ display: "flex" }}>
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
            <button onClick={handleLogout}> Logout </button> */}
            <div className="header">
<nav>
    <div className="nav1">
         <img width={50} src="https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg" alt="" /><h1>BIZZARA</h1>
         </div>
    <div className="nav2"> 
        <img width={60} height={60} src="https://freedesignfile.com/image/preview/19038/xbox-controller-gamepad-drawing-black-and-white-clipart.png" alt="" />
        </div>
</nav>
        </div>
      


(
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Playlists</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {playlists.map((p) => (
          <div
            key={p.id}
            onClick={() => Navigate(`/dashboard/${p.id}`)}
            className="border rounded-lg cursor-pointer hover:shadow-lg transition"
          >
            <img
              src={p.thumbnail}
              alt={p.title}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-3">
              <h3 className="font-semibold">{p.title}</h3>
              <div className="bg-gray-200 h-2 mt-2 rounded">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${p.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{p.progress.toFixed(1)}% done</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md "
        >
          + Add Playlist
        </button>
      </div>

      {showModal && <AddPlaylist onClose={() => setShowModal(false)} />}
    </div>
  );

           </>
        ) : (
            <div>Loading....</div>
        )}
    </div>
   
  )
}

export default Profile