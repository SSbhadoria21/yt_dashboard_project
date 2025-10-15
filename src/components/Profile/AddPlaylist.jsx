import React, { useState } from "react";
import { db } from "../firebase";
import { doc, collection, addDoc } from "firebase/firestore";
import { fetchPlaylistVideos } from "../Services/youtubeApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import './AddPlaylist.css'
const AddPlaylist = ({ onClose }) => {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const extractPlaylistId = (url) => {
    const match = url.match(/[?&]list=([^&#]*)/);
    return match ? match[1] : null;
  };

  const handleGenerate = async () => {
    const playlistId = extractPlaylistId(link);
    if (!playlistId) {
      alert("Invalid YouTube playlist link!");
      return;
    }

    setLoading(true);
    try {
      const videos = await fetchPlaylistVideos(playlistId);
      const thumbnail = videos[0]?.thumbnail;

      const userRef = doc(db, "users", user.uid);
      const playlistsRef = collection(userRef, "playlists");

      const docRef = await addDoc(playlistsRef, {
        playlistId,
        title: videos[0]?.title || "My Playlist",
        thumbnail,
        videos,
        progress: 0,
      });

      navigate(`/dashboard/${docRef.id}`);
    } catch (error) {
      console.error("Error adding playlist:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
   
      <div className="fixed inset-0 bg-black bg-opacity-60 ">
      <div className=" input-main p-6 rounded-2xl ">
        <h2 className="text-xl mb-4 text-center">
          Add New Playlist
        </h2>
        <input
        
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Paste YouTube playlist link"
          className="w-full border  link-paste p-2 mb-4"
        />
       <div className="btns">
         <button
          onClick={handleGenerate}
          disabled={loading}
          className=" bg-blue-500 generate text-white py-2 "
        >
          {loading ? "Generating..." : "Generate Dashboard"}
        </button>
        <button
          onClick={onClose}
          className="cancel mt-2 border py-2"
        >
          Cancel
        </button>
       </div>
      </div>
    </div>
   
    </>
  );
}

export default AddPlaylist;