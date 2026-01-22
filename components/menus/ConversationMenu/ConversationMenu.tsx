import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  KeyboardArrowDownOutlined,
  EditOutlined,
  StarOutlineOutlined,
  StarOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import React, { useState } from "react";

interface ConversationMenuProps {
  title?: string;
  isStarred?: boolean;

  onRename: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
}

const ConversationMenu = ({
  title = "Untitled Conversation",
  isStarred = false,
  onRename,
  onToggleStar,
  onDelete,
}: ConversationMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    handleClose();
    action();
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        endIcon={<KeyboardArrowDownOutlined />}
        sx={{
          fontSize: "1.1rem",
          textTransform: "none",
          maxWidth: 300,
          justifyContent: "space-between",
          padding: "0.4rem 1.0rem",
          borderRadius: "12px",
        }}
      >
        {title}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            minWidth: 240,
            borderRadius: 2,
          },
        }}
      >
        {/* Rename */}
        <MenuItem onClick={() => handleAction(onRename)}>
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>

        {/* Star / Unstar */}
        <MenuItem onClick={() => handleAction(onToggleStar)}>
          <ListItemIcon>
            {isStarred ? (
              <StarOutlined fontSize="small" />
            ) : (
              <StarOutlineOutlined fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>{isStarred ? "Unstar" : "Star"}</ListItemText>
        </MenuItem>

        {/* Delete */}
        <MenuItem
          onClick={() => handleAction(onDelete)}
          sx={{
            color: "error.main",
            "&:hover": {
              backgroundColor: "rgba(211, 47, 47, 0.08)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "error.main" }}>
            <DeleteOutlineOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ConversationMenu;
