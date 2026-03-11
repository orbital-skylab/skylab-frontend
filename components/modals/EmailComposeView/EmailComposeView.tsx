"use client";

import {
  Box,
  TextField,
  Paper,
  Typography,
  Divider,
  Toolbar,
  AppBar,
} from "@mui/material";

interface EmailComposeViewProps {
  selectedTeamsCount: number;
  recipientLabel?: string;
  ccs: string;
  setCcs: (ccs: string) => void;
  subject: string;
  setSubject: (subject: string) => void;
  message: string;
  setMessage: (message: string) => void;
}

export default function EmailComposeView({
  selectedTeamsCount,
  recipientLabel = "teams",
  ccs,
  setCcs,
  subject,
  setSubject,
  message,
  setMessage,
}: EmailComposeViewProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "8px 8px 0 0",
        border: "1px solid #dadce0",
      }}
    >
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          backgroundColor: "#f2f6fc",
          borderBottom: "1px solid #dadce0",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: "48px" }}>
          <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 500 }}>
            New Message
          </Typography>
        </Toolbar>
      </AppBar>

      <>
        <Box sx={{ p: 2, backgroundColor: "#fff" }}>
          <TextField
            fullWidth
            label="To"
            variant="standard"
            value={`${selectedTeamsCount} ${recipientLabel}`}
            disabled
            InputProps={{ disableUnderline: true }}
          />

          <Divider />

          <TextField
            fullWidth
            label="Cc"
            variant="standard"
            value={ccs}
            onChange={(e) => setCcs(e.target.value)}
            placeholder="Comma separated email addresses"
            sx={{ mt: 1 }}
            InputProps={{ disableUnderline: true }}
          />

          <Divider />

          <TextField
            fullWidth
            label="Subject"
            variant="standard"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ mt: 1 }}
            InputProps={{ disableUnderline: true }}
          />

          <Divider />
        </Box>

        <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
          <TextField
            fullWidth
            multiline
            variant="standard"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Compose email"
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: "14px" },
            }}
            sx={{ height: "100%" }}
          />
        </Box>
      </>
    </Paper>
  );
}
