import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./YourNotes.css";

const YourNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setNotes(data.notes || []);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) return <p>Loading your notes...</p>;

  return (
    <div className="your-notes-container">
      <h1>Your Notes</h1>
      {notes.length === 0 ? (
        <p>No notes found yet. Generate some from your dashboard!</p>
      ) : (
        <div className="notes-list">
          {notes.map((note, index) => (
            <div className="note-card" key={index}>
              <h2>{note.title}</h2>
              <p className="note-date">
                {new Date(note.date).toLocaleString()}
              </p>
              <div
  className="note-summary"
  dangerouslySetInnerHTML={{ __html: note.summary }}
/>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourNotes;
