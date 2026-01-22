import React, { FC } from "react";
import { Button, Stack } from "@mui/material";
import Modal from "../Modal";

interface Props {
  open: boolean;
  onClose: () => void;

  title: string;
  description?: string;

  confirmLabel?: string;
  confirmColor?: "primary" | "success" | "error" | "warning";

  isSubmitting?: boolean;

  onConfirm: () => void | Promise<void>;
}

const ConfirmationModal: FC<Props> = ({
  open,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  confirmColor = "primary",
  isSubmitting = false,
  onConfirm,
}) => {
  return (
    <Modal
      open={open}
      handleClose={onClose}
      title={title}
      subheader={description}
      sx={{ width: "400px" }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Button size="small" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button
          size="small"
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {confirmLabel}
        </Button>
      </Stack>
    </Modal>
  );
};

export default ConfirmationModal;
