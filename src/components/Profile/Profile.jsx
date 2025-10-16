import React,{useEffect, useState} from 'react'
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { CgDarkMode } from "react-icons/cg";
import { FaBox } from "react-icons/fa";
import { MdOutlineCheckBox } from "react-icons/md";
import { IoChevronBackOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { ImHome } from "react-icons/im";
import {auth,db} from '../firebase'
import {collection,doc,getDoc,getDocs} from 'firebase/firestore'
import './Profile.css'
import { BiFoodMenu } from "react-icons/bi";
import { FaScrewdriverWrench } from "react-icons/fa6";
import AddPlaylist from './AddPlaylist'
import { Navigate, useNavigate } from 'react-router';
import {
  IoIosArrowBack,
} from "react-icons/io";
import logo from '../assets/crucible.jpeg'
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const [userDetails,setUserDetails]=useState(null);
      const [sidebarOpen, setSidebarOpen] = useState(false);
    
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
const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("light-theme");
  };
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
         <img width={50} src={logo} alt="" /><h1>Crucible</h1>
         </div>
    <div className="nav2"> 
        <img width={60} height={60} src="https://freedesignfile.com/image/preview/19038/xbox-controller-gamepad-drawing-black-and-white-clipart.png" alt="" />
        </div>
</nav>
        </div>
      


( <div className='main-this'>
  {/* <div className='top'>
    <ImHome />
    <div>
      <FaRegUser />
    </div>
  </div> */}
{/* <div className='left'>
  <div className='left-top'>

  <ImHome />
  <IoChevronBackOutline />
  <MdOutlineCheckBox />
  <FaBox />
  <CgDarkMode />
  </div>
  <div className='left-btm'>
    <HiWrenchScrewdriver />
  </div>
</div> */}

//sidebar
 <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ImHome
          className="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title="Menu"
        />
        <div className="sidebar-links">
          <div onClick={() => navigate(-1)}>
            <IoIosArrowBack className="icon" />
            {sidebarOpen && <span>Back</span>}
          </div>
          <div onClick={() => alert("Open To-Do Section")}>
            <MdOutlineCheckBox className="icon" />
            {sidebarOpen && <span>To-Do</span>}
          </div>
          <div>
            <FaBox className="icon" />
            {sidebarOpen && <span>Your Notes</span>}
          </div>
          <div onClick={toggleTheme}>
            <CgDarkMode className="icon" />
            {sidebarOpen && <span>Appearance</span>}
          </div>
          <div className="screw">
            <FaScrewdriverWrench className="icon" />
            {sidebarOpen && <span>Settings</span>}
          </div>
        </div>
      </div>

    <div className='right'>
      <h1 className="text-2xl font-bold mb-4 text-white headingYP">Your Playground
        <FaRegUser />
      </h1>

      <div className="thumbnails">
        {playlists.map((p) => (
          <div
          key={p.id}
          onClick={() => Navigate(`/dashboard/${p.id}`)}
          className="cursor-pointer hover:shadow-lg transition oneBox"
          >
            <img
              src={p.thumbnail}
              alt={p.title}
              className=""
              />
            <div className="">
              <h3 className="title">{p.title}</h3>
              <div className="progressBar">
                <div
                  className=""
                  style={{ width: `${p.progress}%` }}
                  ></div>
              </div>
              <p className="">{p.progress.toFixed(1)}% done</p>
            </div>
          </div>
        ))}
      </div>

      <div className="">
        <button
          onClick={() => setShowModal(true)}
          className=""
          >
          {/* className="bg-green-500 text-white px-4 py-2 rounded-md "
        > */}
          + Add Playlist
        </button>
      </div>

      {showModal && <AddPlaylist onClose={() => setShowModal(false)} />}
    </div>
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