import React, { useState } from "react";

function FloatingCalculator() {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => setInput("");

  const handleDelete = () => setInput((prev) => prev.slice(0, -1));

  const handleCalculate = () => {
    try {
      // eval dipake buat kalkulasi simple (aman selama input internal)
      const result = eval(input);
      setInput(result.toString());
    } catch {
      setInput("Error");
    }
  };

  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+"
  ];

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "100px", zIndex: 1000 }}>
      
      {show && (
        <div
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "15px",
            borderRadius: "15px",
            marginBottom: "15px",
            width: "260px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            border: "2px solid #4CAF50"
          }}
        >
          <h4 style={{ marginBottom: "10px" }}>Kalkulator 🧮</h4>

          {/* Display */}
          <div
            style={{
              background: "#222",
              color: "#0f0",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "10px",
              textAlign: "right",
              fontFamily: "monospace",
              minHeight: "40px"
            }}
          >
            {input || "0"}
          </div>

          {/* Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "5px" }}>
            {buttons.map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === "=") handleCalculate();
                  else handleClick(btn);
                }}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#ddd"
                }}
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Extra controls */}
          <div style={{ display: "flex", marginTop: "10px", gap: "5px" }}>
            <button
              onClick={handleClear}
              style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", background: "#ff4d4d", color: "white" }}
            >
              C
            </button>
            <button
              onClick={handleDelete}
              style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", background: "#888", color: "white" }}
            >
              ⌫
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setShow(!show)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#4CAF50",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
        }}
      >
        {show ? "✖" : "🧮"}
      </button>
    </div>
  );
}

export default FloatingCalculator;