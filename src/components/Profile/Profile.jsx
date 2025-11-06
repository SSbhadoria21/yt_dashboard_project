
import React, { use, useEffect, useState } from "react";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { CgDarkMode } from "react-icons/cg";
import { FaBox } from "react-icons/fa";
import { MdOutlineCheckBox } from "react-icons/md";
import { IoChevronBackOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { ImHome } from "react-icons/im";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import "./Profile.css";
import { FaScrewdriverWrench } from "react-icons/fa6";
import AddPlaylist from "./AddPlaylist";
import { useNavigate } from "react-router";
import logo from "../assets/crucible.jpeg";
import { useAuth } from "../context/AuthContext";
import { FaTrashAlt } from "react-icons/fa";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [deletingId, setDeletingId] = useState(null); 

  const fetchUserDetails = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      const docref = doc(db, "users", user.uid);
      const docSnap = await getDoc(docref);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
      }
    });
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("light-theme");
  };

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const playlistsRef = collection(userRef, "playlists");
      const snapshot = await getDocs(playlistsRef);
      setPlaylists(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchPlaylists();
  }, [user]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleDeletePlaylist = async (playlistId, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the playlist "${title}"?`
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(playlistId);
      const playlistRef = doc(db, "users", user.uid, "playlists", playlistId);
      await deleteDoc(playlistRef);
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting playlist:", error);
      setDeletingId(null);
    }
  };

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  if (!userDetails) return <div>Loading...</div>;

  return (
   <>
   {userDetails ? (
     <>
      <div>
      <div className="header">
        <nav>
          <div className="nav1">
            <img width={50} src={logo} alt="" />
            <h1>Crucible</h1>
          </div>
          <div className="nav2">
            <img
              width={60}
              height={60}
              src="https://freedesignfile.com/image/preview/19038/xbox-controller-gamepad-drawing-black-and-white-clipart.png"
              alt=""
            />
          </div>
          
        </nav>
      </div>

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

      <div className="right  2">
        <h1 className="text-2xl font-bold mb-4 text-white headingYP margin">
          Your Playground
          
          
        <div className="username"> 
          
          Hello ! {userDetails.fname}

        </div>
        </h1>
    
        <div className="thumbnails">
          {playlists.map((p) => (
            <div key={p.id} className="oneBox">
              <div
                className="playlist-card"
                onClick={() => navigate(`/dashboard/${p.id}`)}
              >
                <img src={p.thumbnail} alt={p.title} />
                <div>
                  <h3 className="title">{p.title}</h3>
                  <div className="progressBar">
                    <div style={{ width: `${p.progress}%` }}></div>
                  </div>
                  <p>{p.progress.toFixed(1)}% done</p>
                </div>
              </div>

              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation(); // stop navigation
                  handleDeletePlaylist(p.id, p.title);
                }}
                disabled={deletingId === p.id}
              >
                {deletingId === p.id ? "Deleting..." : <FaTrashAlt />}
              </button>
            </div>
          ))}
        </div>

        <div className="add-playlist-section">
          <button onClick={() => setShowModal(true)} className="add-btn">
            + Add Playlist
          </button>
        </div>

        {showModal && <AddPlaylist onClose={() => setShowModal(false)} />}
      </div>
    </div>
     </>
       
      ) : ( 
        <div>Loading....</div>
         )}
   </>
  );
};

export default Profile;
