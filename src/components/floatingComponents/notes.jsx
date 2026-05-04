import React, { useState, useEffect } from "react";

function FloatingNotes() {
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState("");

  // load dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("purr_notes");
    if (saved) setNotes(saved);
  }, []);

  // save otomatis
  useEffect(() => {
    localStorage.setItem("purr_notes", notes);
  }, [notes]);

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "170px", zIndex: 1000 }}>
      
      {show && (
        <div
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "15px",
            borderRadius: "15px",
            marginBottom: "15px",
            width: "280px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            border: "2px solid #2196F3"
          }}
        >
          <h4 style={{ marginBottom: "10px" }}>Catatan 📝</h4>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tulis apapun di sini..."
            style={{
              width: "100%",
              height: "150px",
              borderRadius: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              resize: "none"
            }}
          />
        </div>
      )}

      {/* tombol floating */}
      <button
        onClick={() => setShow(!show)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#2196F3",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
        }}
      >
        {show ? "✖" : "📝"}
      </button>
    </div>
  );
}

export default FloatingNotes;