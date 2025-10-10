import React, { useEffect, useState } from 'react'
import {db} from '../firebase' // Corrected path assumption
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import './dashboard.css'; // Import the new CSS file
import { Youtube, CheckCircle, Circle } from 'lucide-react';

const Dashboard = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user and id are available before fetching
    if (!user || !user.uid || !id) return;
    
    const fetchData = async () => {
      try {
        const playlistRef = doc(db, "users", user.uid, "playlists", id);
        const snapshot = await getDoc(playlistRef);
        if (snapshot.exists()) {
          // Round the progress to 1 decimal place for cleaner display
          const data = snapshot.data();
          data.progress = parseFloat(data.progress.toFixed(1)); 
          setPlaylist({ id: snapshot.id, ...data });
          setError(null);
        } else {
          setError("Playlist not found.");
          setPlaylist(null);
        }
      } catch (e) {
        console.error("Error fetching dashboard data: ", e);
        setError("Failed to load playlist data.");
      }
    };
    fetchData();
  }, [user, id]); // Depend on user and id

  const handleCheck = async (index) => {
    if (!playlist) return;

    const updatedVideos = [...playlist.videos];
    updatedVideos[index].watched = !updatedVideos[index].watched;
    
    // Recalculate and round the progress
    const watchedCount = updatedVideos.filter((v) => v.watched).length;
    const totalCount = updatedVideos.length;
    const rawProgress = (watchedCount / totalCount) * 100;
    const progress = parseFloat(rawProgress.toFixed(1));

    setPlaylist({ ...playlist, videos: updatedVideos, progress });

    try {
      const playlistRef = doc(db, "users", user.uid, "playlists", id);
      await updateDoc(playlistRef, { videos: updatedVideos, progress });
    } catch (e) {
      console.error("Error updating playlist progress: ", e);
      // Optionally revert UI state or show error notification
    }
  };

  if (!user || !user.uid) return <p className="p-6 text-red-500">Please log in to view the dashboard.</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!playlist) return <p className="p-6 text-lg animate-pulse">Loading Playlist...</p>;

  // Function to get YouTube thumbnail URL
  const getThumbnailUrl = (videoId) => {
    // 'mqdefault.jpg' is medium quality (320x180) and generally fast-loading
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  return (
    <div className="dashboard-container max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen text-white rounded-lg shadow-2xl">
      <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
        {playlist.title}
      </h1>
      
      {/* Progress Bar and Status */}
      <div className="mb-8 p-4 bg-gray-800 rounded-xl shadow-inner">
        <p className="text-lg font-semibold mb-2 flex justify-between items-center">
          <span>Completion:</span>
          <span className="text-pink-300">{playlist.progress}% done</span>
        </p>
        <div className="bg-gray-700 h-4 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg"
            style={{ width: `${playlist.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Video List */}
      <div className="space-y-4 video-list-scroller">
        {playlist.videos.map((v, i) => (
          <div
            key={v.videoId}
            className={`flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-xl shadow-lg transition-all duration-300 
                        ${v.watched ? 'bg-green-900/40 border border-green-700' : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'}`}
          >
            {/* Thumbnail */}
            <div className="flex-shrink-0 w-full sm:w-40 h-24 mb-3 sm:mb-0 sm:mr-4 relative overflow-hidden rounded-lg">
              <img
                src={getThumbnailUrl(v.videoId)}
                alt={`Thumbnail for ${v.title}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                // Placeholder/error handling
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/320x180/2c3e50/ecf0f1?text=No+Thumb";
                }}
              />
              <Youtube className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/80 opacity-70" size={32} fill="red" />
            </div>

            {/* Content and Checkbox */}
            <div className="flex flex-grow items-center justify-between w-full">
              <div className="flex-grow">
                {/* Video Title Link */}
                <a
                  href={`https://www.youtube.com/watch?v=${v.videoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-lg font-medium transition-colors duration-200 
                              ${v.watched ? 'text-gray-400 line-through' : 'text-white hover:text-purple-400'}`}
                >
                  {v.title}
                </a>
                <p className={`text-xs mt-1 ${v.watched ? 'text-green-500' : 'text-gray-400'}`}>
                    {v.watched ? 'Completed' : 'Pending'}
                </p>
              </div>
              
              {/* Checkbox/Status Icon */}
              <button
                onClick={() => handleCheck(i)}
                className={`flex-shrink-0 ml-4 p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 
                            ${v.watched ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-700/50' : 'bg-gray-600 text-gray-200 hover:bg-gray-500 focus:ring-gray-700/50'}`}
                aria-label={v.watched ? 'Mark as Unwatched' : 'Mark as Watched'}
              >
                {v.watched ? <CheckCircle size={24} /> : <Circle size={24} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard






































































































// import React, { useEffect, useState } from 'react'
// import {db} from '../firebase'
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { useParams } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// const Dashboard = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const [playlist, setPlaylist] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const playlistRef = doc(db, "users", user.uid, "playlists", id);
//       const snapshot = await getDoc(playlistRef);
//       if (snapshot.exists()) {
//         setPlaylist({ id: snapshot.id, ...snapshot.data() });
//       }
//     };
//     fetchData();
//   }, [user, id]);

//   const handleCheck = async (index) => {
//     const updatedVideos = [...playlist.videos];
//     updatedVideos[index].watched = !updatedVideos[index].watched;
//     const progress =
//       (updatedVideos.filter((v) => v.watched).length / updatedVideos.length) *
//       100;

//     setPlaylist({ ...playlist, videos: updatedVideos, progress });

//     const playlistRef = doc(db, "users", user.uid, "playlists", id);
//     await updateDoc(playlistRef, { videos: updatedVideos, progress });
//   };

//   if (!playlist) return <p className="p-6">Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-2">{playlist.title}</h1>
//       <div className="bg-gray-200 h-3 rounded mb-4">
//         <div
//           className="bg-blue-500 h-3 rounded"
//           style={{ width: `${playlist.progress}%` }}
//         ></div>
//       </div>

//       <div className="space-y-3">
//         {playlist.videos.map((v, i) => (
//           <div
//             key={v.videoId}
//             className="flex items-center border p-2 rounded-lg"
//           >
//             <input
//               type="checkbox"
//               checked={v.watched}
//               onChange={() => handleCheck(i)}
//               className="mr-3"
//             />
//             <a
//               href={`https://www.youtube.com/watch?v=${v.videoId}`}
//               target="_blank"
//               rel="noreferrer"
//               className="text-blue-600 underline"
//             >
//               {v.title}
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Dashboard