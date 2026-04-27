import  {   useRef } from "react";

import { db} from "../firebase"; 
import jsPDF from "jspdf";
// import { jsPDF } from "jspdf";
import { collection, addDoc } from "firebase/firestore";
import { YoutubeTranscript } from "youtube-transcript";
import Groq from "groq-sdk";
// import jsPDF from "jspdf"; // for pdf generation
// import { auth, db } from "../firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
import clogo from '../assets/ultaclogo.jpeg'







import { useEffect, useState } from "react";
import { auth} from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import {
  IoIosArrowBack,
} from "react-icons/io";

import { MdOutlineCheckBox } from "react-icons/md";
import { FaBox, FaUser } from "react-icons/fa";
import { CgDarkMode } from "react-icons/cg";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { ImHome } from "react-icons/im";
import { Youtube, CheckCircle, Circle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";
import { ensureWeekDoc, fetchWeekContributions, incrementContribution, decrementContributionSafely,} from "../Contributions";
import { BarChart, Bar,
 XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

  const client = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true, 
  });

const Dashboard = () => {
  const [contribData, setContribData] = useState([]);
  const [loadingContrib, setLoadingContrib] = useState(true);

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const videoRefs = useRef([]);
  const [generatingNotes, setGeneratingNotes] = useState(null); 


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

 
  useEffect(() => {
    if (!user || !user.uid || !id) return;
    console.log("Fetching playlist for user:", user?.uid, "with id:", id);
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


  useEffect(() => {
    if (!user || !user.uid) return;

    const loadContrib = async () => {
      await ensureWeekDoc(user.uid);
      const data = await fetchWeekContributions(user.uid);

      const formatted = Object.keys(data)
        .filter((day) =>
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(day)
        )
        .map((day) => ({ day, contributions: data[day] }));

      setContribData(formatted);
      setLoadingContrib(false);
    };

    loadContrib();
  }, [user]);

  const handleCheck = async (index) => {
    if (!playlist) return;
    const updatedVideos = [...playlist.videos];
    updatedVideos[index].watched = !updatedVideos[index].watched;
    const watchedCount = updatedVideos.filter((v) => v.watched).length;
    const totalCount = updatedVideos.length;
    const progress = parseFloat(((watchedCount / totalCount) * 100).toFixed(1));

    setPlaylist({ ...playlist, videos: updatedVideos, progress });
    setCompletedToday(watchedCount);

    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    if (updatedVideos[index].watched) {
      await incrementContribution(user.uid, today, 1);
    } else {
      await decrementContributionSafely(user.uid, today, 1);
    }

    const data = await fetchWeekContributions(user.uid);
    const formatted = Object.keys(data)
      .filter((day) =>
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(day)
      )
      .map((day) => ({ day, contributions: data[day] }));
    setContribData(formatted);

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

  const handleSelectAll = async () => {
    if (!playlist) return;
    const newStatus = !selectAll;
    setSelectAll(newStatus);

    const updatedVideos = playlist.videos.map((v) => ({
      ...v,
      watched: newStatus,
    }));
    const watchedCount = updatedVideos.filter((v) => v.watched).length;
    const totalCount = updatedVideos.length;
    const progress = parseFloat(((watchedCount / totalCount) * 100).toFixed(1));

    setPlaylist({ ...playlist, videos: updatedVideos, progress });

    try {
      const playlistRef = doc(db, "users", user.uid, "playlists", id);
      await updateDoc(playlistRef, { videos: updatedVideos, progress });
    } catch (e) {
      console.error("Error updating select all:", e);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (!isNaN(query) && query.trim() !== "") {
      const index = parseInt(query, 10) - 1;
      if (index >= 0 && videoRefs.current[index]) {
        videoRefs.current[index].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const filteredVideos = playlist
    ? playlist.videos.filter((v) =>
        v.title.toLowerCase().includes(searchQuery)
      )
    : [];

async function generateNotes(videoTitle, promptText) {
  try {
  
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an educational AI that converts YouTube content into structured study notes. Use bullet points, bold keywords, and clear formatting.",
        },
        {
          role: "user",
          content: promptText,
        },
      ],
    });

    const summary = response.choices[0]?.message?.content || "No summary generated.";
    console.log("AI Summary:", summary);

 
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(videoTitle, pageWidth / 2, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(summary, pageWidth - 20);
    doc.text(splitText, 10, 35);


    const pdfBlob = doc.output("blob");

 
    doc.save(`${videoTitle}_Notes.pdf`);

 
    const noteRef = collection(db, "users", user.uid, "notes");
    await addDoc(noteRef, {
      title: videoTitle,
      content: summary,
      createdAt: new Date(),
    });

    alert("✅ Notes generated and saved successfully!");

  } catch (error) {
    console.error("Groq API Error:", error);
    alert("Failed to generate notes. Check console for details.");
  }
}



const saveNotesToFirestore = async (videoTitle, summaryText) => {
  if (!user || !user.uid) return alert("Please log in to save notes.");

  try {
    const notesRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(notesRef);
    const userData = userSnap.data();


    const existingNotes = userData.notes || [];

    const newNote = {
      title: videoTitle,
      summary: summaryText,
      date: new Date().toISOString(),
    };

    await updateDoc(notesRef, {
      notes: [...existingNotes, newNote],
    });

    console.log("Notes saved successfully!");
  } catch (err) {
    console.error("Error saving notes:", err);
  }
};


const handleGenerateNotes = async (videoId, title) => {
  try {
  
    let transcriptText = "";
    try {
      const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId);
      transcriptText = transcriptArray.map((item) => item.text).join(" ");
      console.log("Transcript fetched successfully!");
    } catch (err) {
      console.warn("Transcript not available, falling back to title only.");
    }

    const prompt = transcriptText
      ? `Summarize the following YouTube lecture into clear study notes with bullet points, key terms, and examples:\n\n${transcriptText}`
      : `The YouTube video titled "${title}" doesn’t have a transcript. Write a helpful, detailed summary of what this topic usually covers and what students should note while studying it.`;

    await generateNotes(title, prompt);
  } catch (error) {
    console.error("Error generating notes:", error);
    alert("Failed to generate notes. Check console for details.");
  }
};
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

  const totalHours = playlist
    ? playlist.videos.reduce((acc, v) => acc + (v.duration || 1), 0)
    : 0;
  const watchedHours = playlist
    ? playlist.videos.filter((v) => v.watched).reduce((acc, v) => acc + (v.duration || 1), 0)
    : 0;

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
   
 <nav className="navbar">
        <div className="nav-left">
          <img
            src={clogo}
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
          <div onClick={() => navigate("/your-notes")}>
  <FaBox className="icon" />
  {sidebarOpen && <span>Your Notes</span>}
</div>

          {/* <div>
            <FaBox className="icon" />
            {sidebarOpen && <span>Your Notes</span>}
          </div> */}
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

      {showCongrats && (
        <div className="popup">
          🎉 Congratulations! Your Today's Target is Completed!
        </div>
      )}

      {showMenu && (
        <div className="fullscreen-menu">
          <button className="close-btn" onClick={() => setShowMenu(false)}>
            ✖
          </button>
          <ul>
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/profile")}>Your Profile</li>
       <li onClick={()=> navigate("/login")}>Switch Account</li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
    
      <div className="main-section">
        <div className="profile-icon">
          <FaUser />
        </div>
        <h1 className="playlist-title text-white">{playlist.title}</h1>

   
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
           {loadingContrib ? (
  <p>Loading graph...</p>
) : (
  <ResponsiveContainer width="100%" height={173}>
    <BarChart data={contribData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
      <XAxis dataKey="day" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip />
      <Bar dataKey="contributions" fill="#a855f7" radius={[10, 10, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
)}

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

        <div className="filter-container">
          <input
            type="text"
            placeholder="Search by video number or title..."
            className="search-bar"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button className="select-btn" onClick={handleSelectAll}>
            {selectAll ? "Deselect All" : "Select All"}
          </button>
        </div>
    
        <div className="video-list">
          {filteredVideos.map((v, i) => (
            <div
              key={v.videoId}
              ref={(el) => (videoRefs.current[i] = el)}
              className={`video-card ${v.watched ? "watched" : ""}`}
            >
              <img
                src={getThumbnailUrl(v.videoId)}
                alt={v.title}
                className="video-thumb"
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

                <button
  onClick={() => handleGenerateNotes(v.videoId, v.title)}
  className="notes-btn"
>
  Generate Notes
</button>



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
