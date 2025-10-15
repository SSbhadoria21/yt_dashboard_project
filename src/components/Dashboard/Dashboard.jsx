












import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import {
  IoIosArrowBack,
} from "react-icons/io";
import logo from '../assets/crucible.jpeg'
import { MdOutlineCheckBox } from "react-icons/md";
import { FaBox, FaUser } from "react-icons/fa";
import { CgDarkMode } from "react-icons/cg";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { ImHome } from "react-icons/im";
import { Youtube, CheckCircle, Circle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [target, setTarget] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);

  // Fetch User Details
  useEffect(() => {
    if (!user || !user.uid) return;
    const fetchUserDetails = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) setUserDetails(docSnap.data());
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, [user]);

  // Fetch Playlist Data
  useEffect(() => {
    if (!user || !user.uid || !id) return;
    const fetchData = async () => {
      try {
        const playlistRef = doc(db, "users", user.uid, "playlists", id);
        const snapshot = await getDoc(playlistRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          data.progress = parseFloat(data.progress.toFixed(1));
          setPlaylist({ id: snapshot.id, ...data });
          setError(null);
        } else {
          setError("Playlist not found.");
        }
      } catch (e) {
        console.error("Error fetching dashboard data: ", e);
        setError("Failed to load playlist data.");
      }
    };
    fetchData();
  }, [user, id]);

  const handleCheck = async (index) => {
    if (!playlist) return;
    const updatedVideos = [...playlist.videos];
    updatedVideos[index].watched = !updatedVideos[index].watched;
    const watchedCount = updatedVideos.filter((v) => v.watched).length;
    const totalCount = updatedVideos.length;
    const progress = parseFloat(((watchedCount / totalCount) * 100).toFixed(1));

    setPlaylist({ ...playlist, videos: updatedVideos, progress });
    setCompletedToday(watchedCount);

    if (target > 0 && watchedCount >= target) {
      setShowCongrats(true);
      setTimeout(() => setShowCongrats(false), 3500);
    }

    try {
      const playlistRef = doc(db, "users", user.uid, "playlists", id);
      await updateDoc(playlistRef, { videos: updatedVideos, progress });
    } catch (e) {
      console.error("Error updating playlist progress: ", e);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const getThumbnailUrl = (videoId) =>
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  // Hours Calculation
  const totalHours = playlist
    ? playlist.videos.reduce((acc, v) => acc + (v.duration || 1), 0)
    : 0;
  const watchedHours = playlist
    ? playlist.videos.filter((v) => v.watched).reduce((acc, v) => acc + (v.duration || 1), 0)
    : 0;

  // Theme Toggle
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("light-theme");
  };

  if (!user || !user.uid)
    return <p className="error-msg">Please log in to view the dashboard.</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (!playlist) return <p className="loading-msg">Loading Playlist...</p>;

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : "light"}`}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <img
            src={logo}
            alt="logo"
            className="logo"
          />
          <h1 className="brand">Crucible</h1>
        </div>
        <div className="nav-right">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
          <img
            src="https://freedesignfile.com/image/preview/19038/xbox-controller-gamepad-drawing-black-and-white-clipart.png"
            alt="controller"
            className="controller-icon"
            onClick={() => setShowMenu(true)}
          />
        </div>
      </nav>

      {/* Sidebar */}
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

      {/* Congrats Popup */}
      {showCongrats && (
        <div className="popup">
          🎉 Congratulations! Your Today's Target is Completed!
        </div>
      )}

      {/* Fullscreen Menu */}
      {showMenu && (
        <div className="fullscreen-menu">
          <button className="close-btn" onClick={() => setShowMenu(false)}>
            ✖
          </button>
          <ul>
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/profile")}>Your Profile</li>
            <li>Benefits</li>
            <li>About Us</li>
          </ul>
        </div>
      )}

      {/* Main Section */}
      <div className="main-section">
        <div className="profile-icon">
          <FaUser />
        </div>
        <h1 className="playlist-title text-white">{playlist.title}</h1>

        {/* To-Do Target */}
        <div className="todo-box">
          <p>🎯 Set Your Daily Target:</p>
          <input
            type="number"
            placeholder="Enter lectures count"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          />
          <p className="todo-progress">
            Completed Today: {completedToday}/{target}
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="dashboard-stats">
          <div className="stat-box progress">
            <h3>Total Progress</h3>
            <div className="progress-circle">
              <div
                className="progress-fill"
                style={{ height: `${playlist.progress}%` }}
              ></div>
              <span>{playlist.progress}%</span>
            </div>
          </div>

          <div className="stat-box graph">
            <h3>Contribution Graph</h3>
            <img
              src="https://quickchart.io/chart?c={type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Videos',data:[10,20,30,40,30,20,40],borderColor:'purple',fill:false},{label:'Revision',data:[5,10,25,35,20,25,30],borderColor:'orange',fill:false}]}}"
              alt="graph"
              className="graph-img"
            />
          </div>

          <div className="stat-box hours">
            <h3>Videos Watched</h3>
            <div className="gauge">
              <div
                className="gauge-fill"
                style={{
                  background: `conic-gradient(#ff8800 ${
                    (watchedHours / totalHours) * 180
                  }deg, #333 ${(watchedHours / totalHours) * 180}deg 180deg)`,
                }}
              ></div>
              <span>
                {watchedHours}/{totalHours} video
              </span>
            </div>
          </div>
        </div>

        {/* Video List */}
        <div className="video-list">
          {playlist.videos.map((v, i) => (
            <div
              key={v.videoId}
              className={`video-card ${v.watched ? "watched" : ""}`}
            >
              <img
                src={getThumbnailUrl(v.videoId)}
                alt={v.title}
                className="video-thumb"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/320x180/2c3e50/ecf0f1?text=No+Thumb";
                }}
              />
              <div className="video-info">
                <a
                  href={`https://www.youtube.com/watch?v=${v.videoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`video-title ${v.watched ? "done" : ""}`}
                >
                  {v.title}
                </a>
                <p className={`status ${v.watched ? "completed" : "pending"}`}>
                  {v.watched ? "Completed" : "Pending"}
                </p>
              </div>
              <button
                onClick={() => handleCheck(i)}
                className={`check-btn ${v.watched ? "checked" : ""}`}
              >
                {v.watched ? <CheckCircle size={20} /> : <Circle size={20} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
