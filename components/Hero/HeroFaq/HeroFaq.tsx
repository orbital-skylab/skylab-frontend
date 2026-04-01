import { Box, Divider, Typography } from "@mui/material";
import React from "react";

const HeroFaq = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
        mb: "2rem",
        px: 2,
      }}
    >
      <Box
        component="img"
        src="/skylab-logo.png"
        alt="Skylab Logo"
        sx={{
          width: 126,
          height: 126,
        }}
      />

      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 650,
          letterSpacing: "-0.015em",
        }}
      >
        Orbital FAQ Assistant
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          maxWidth: 460,
          lineHeight: 1.6,
        }}
      >
        Ask questions about milestones, grading, requirements, or programme
        structure — and get clear, instant answers.
      </Typography>

      <Divider
        sx={{
          width: "26rem",
          mt: 1,
          borderColor: "divider",
          opacity: 0.6,
        }}
      />
    </Box>
  );
};

export default HeroFaq;
