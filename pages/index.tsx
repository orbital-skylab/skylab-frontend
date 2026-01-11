import type { NextPage } from "next";
import Body from "@/components/layout/Body";
import { Box } from "@mui/system";
import Hero from "@/components/Hero";
import About from "@/components/About";
import useFetch from "@/hooks/useFetch";
import { useState } from "react";
import { Close, HelpOutline, KeyboardVoice, Send } from "@mui/icons-material";
import { Typography } from "@mui/material";

type GetLatestApplicationResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  application: any;
};

const Home: NextPage = () => {
  const { data } = useFetch<GetLatestApplicationResponse>({
    endpoint: "/application",
  });

  const [showFaq, setShowFaq] = useState(false);

  return (
    <Body>
      <Hero isApplicationOngoing={Boolean(data?.application)} />
      <About />
      <Box sx={{ marginY: "5vh" }} />

      {/* Floating FAQ Button */}
      {!showFaq && (
        <button
          onClick={() => setShowFaq(true)}
          style={{
            position: "fixed",
            bottom: "50px",
            right: "50px",

            padding: "14px 20px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.45)",

            // Liquid glass background (layered)
            background: `
        linear-gradient(
          135deg,
          rgba(255,255,255,0.85),
          rgba(255,255,255,0.55)
        )
      `,
            backdropFilter: "blur(18px) saturate(160%)",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",

            display: "flex",
            alignItems: "center",
            gap: "8px",

            fontWeight: 500,
            fontSize: "0.9rem",
            color: "#111",
            cursor: "pointer",
            zIndex: 1500,

            // Liquid depth shadows
            boxShadow: `
              /* Primary lift */
              0 14px 40px rgba(0,0,0,0.18),

              /* Secondary soft diffusion */
              0 6px 16px rgba(0,0,0,0.10),

              /* Ambient halo (glass glow) */
              0 0 0 1px rgba(255,255,255,0.35),

              /* Top specular highlight */
              inset 0 1px 1px rgba(255,255,255,0.95),

              /* Bottom refraction */
              inset 0 -2px 3px rgba(0,0,0,0.08)
            `,

            // Fluid motion
            transition:
              "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), \
         box-shadow 0.25s ease, \
         background 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
            e.currentTarget.style.boxShadow = `
        0 18px 45px rgba(0,0,0,0.18),
        inset 0 1px 1px rgba(255,255,255,1),
        inset 0 -1px 2px rgba(0,0,0,0.08)
      `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = `
        0 10px 30px rgba(0,0,0,0.12),
        inset 0 1px 1px rgba(255,255,255,0.9),
        inset 0 -1px 2px rgba(0,0,0,0.05)
      `;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.96)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
          }}
        >
          <HelpOutline fontSize="small" />
          <Typography sx={{ fontWeight: 500 }}>FAQ</Typography>
        </button>
      )}

      {/* FAQ Assistant Popup */}
      {showFaq && <FaqAssistantPopup onClose={() => setShowFaq(false)} />}
    </Body>
  );
};

export default Home;

const FaqAssistantPopup = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100vh",
        width: "420px",
        background: "#fff",
        borderLeft: "1px solid #e0e0e0",
        boxShadow: "-8px 0 24px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        zIndex: 2000,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}>
            Orbital FAQ Assistant
          </h3>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
            Ask anything about Orbital
          </p>
        </div>

        {/* Close Button */}
        <Close onClick={onClose} style={{ cursor: "pointer", opacity: 0.7 }} />
      </div>
      {/* Chat Body */}{" "}
      <div
        style={{
          flexGrow: 1,
          padding: "1rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          background: "#fafafa",
        }}
      >
        {" "}
        {/* User Message */}{" "}
        <div
          style={{
            alignSelf: "flex-end",
            background: "#fff",
            border: "1px solid #000",
            borderRadius: "10px",
            padding: "0.6rem 0.8rem",
            maxWidth: "80%",
            fontSize: "0.9rem",
          }}
        >
          {" "}
          What should I include in Milestone 2?{" "}
        </div>{" "}
        {/* Assistant Message */}{" "}
        <div
          style={{
            alignSelf: "flex-start",
            background: "#f2f2f2",
            borderRadius: "10px",
            padding: "0.75rem",
            maxWidth: "85%",
            fontSize: "0.9rem",
            lineHeight: 1.5,
          }}
        >
          {" "}
          For Milestone 2, teams are expected to: <br />• Demonstrate working
          core features <br />• Describe technical challenges faced <br />•
          Include screenshots or demo links <br />• Outline next development
          steps{" "}
        </div>{" "}
        {/* User Message */}{" "}
        <div
          style={{
            alignSelf: "flex-end",
            background: "#fff",
            border: "1px solid #000",
            borderRadius: "10px",
            padding: "0.6rem 0.8rem",
            maxWidth: "80%",
            fontSize: "0.9rem",
          }}
        >
          {" "}
          Is a video demo required?{" "}
        </div>{" "}
        {/* Assistant Message */}{" "}
        <div
          style={{
            alignSelf: "flex-start",
            background: "#f2f2f2",
            borderRadius: "10px",
            padding: "0.75rem",
            maxWidth: "85%",
            fontSize: "0.9rem",
            lineHeight: 1.5,
          }}
        >
          {" "}
          A video demo is recommended but not strictly required. Clear
          screenshots or a live demo link are acceptable alternatives.{" "}
        </div>{" "}
      </div>
      {/* Input Bar */}
      <div
        style={{
          padding: "0.75rem",
          borderTop: "1px solid #e0e0e0",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#f2f2f2",
            borderRadius: "10px",
            padding: "0.5rem 0.75rem",
          }}
        >
          <input
            placeholder="Ask a question"
            style={{
              flexGrow: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "0.9rem",
            }}
          />

          <KeyboardVoice style={{ cursor: "pointer", opacity: 0.7 }} />
          <Send style={{ cursor: "pointer", opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
};
