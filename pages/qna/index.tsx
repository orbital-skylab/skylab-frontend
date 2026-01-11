import { Add, AttachFile, KeyboardVoice } from "@mui/icons-material";
import React from "react";

const Qna = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Inter, sans-serif",
        color: "#111",
        marginTop: "3rem",
      }}
    >
      {/* --- RIGHT SIDEBAR: Chat History --- */}
      <div
        style={{
          width: "300px",
          borderLeft: "1px solid #e0e0e0",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          background: "#fafafa",
        }}
      >
        <h4 style={{ margin: 0, fontWeight: 600 }}>History</h4>

        {[
          "How to write Milestone 1?",
          "What is a valid README?",
          "How are milestones evaluated?",
        ].map((q) => (
          <div
            key={q}
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              background: "#fff",
              border: "1px solid #ddd",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            {q}
          </div>
        ))}
      </div>

      {/* --- MAIN AREA --- */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "4rem",
        }}
      >
        {/* Logo + Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img
            src="/skylab-logo.png"
            alt="Skylab Logo"
            style={{ width: "100px", margin: "auto" }}
          />

          <h2 style={{ fontWeight: 700, margin: 0, fontSize: "1.8rem" }}>
            Ask anything about Orbital
          </h2>
          <p style={{ color: "#666", marginTop: "0.25rem" }}>
            Get answers about milestones, requirements, or programme structure.
          </p>
        </div>

        {/* --- FILLED INPUT BAR (ChatGPT style) --- */}
        <div
          style={{
            width: "100%",
            maxWidth: "680px",
            borderRadius: "12px",
            padding: "0.9rem 1.2rem",
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
            background: "#f2f2f2", // FILLED BG
            boxShadow: "0px 0px 0px 1px #e0e0e0 inset",
          }}
        >
          {/* Upload Icon */}
          <AttachFile
            style={{ cursor: "pointer", fontSize: "1.3rem", opacity: 0.7 }}
          />

          {/* Add Icon */}
          <Add
            style={{ cursor: "pointer", fontSize: "1.4rem", opacity: 0.75 }}
          />

          {/* Input */}
          <input
            type="text"
            placeholder="Ask a question…"
            style={{
              flexGrow: 1,
              border: "none",
              outline: "none",
              fontSize: "1rem",
              background: "transparent",
            }}
          />

          {/* Voice Icon */}
          <KeyboardVoice
            style={{ cursor: "pointer", fontSize: "1.4rem", opacity: 0.75 }}
          />

          {/* Send Button */}
          <button
            style={{
              padding: "6px 14px",
              border: "1px solid #000",
              background: "#fff",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Send
          </button>
        </div>

        {/* --- FILLED TAGS (instead of outlined) --- */}
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "center",
          }}
        >
          {[
            "What does Milestone 2 require?",
            "How to pick a difficulty level?",
            "What must be in the final report?",
            "How do advisers grade?",
          ].map((tag) => (
            <span
              key={tag}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                background: "#f2f2f2",
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0px 0px 0px 1px #e0e0e0 inset",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Qna;
