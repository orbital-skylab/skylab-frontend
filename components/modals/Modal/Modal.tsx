import { ABSOLUTE_CENTER } from "@/styles/constants";
import {
  Backdrop,
  Card,
  CardContent,
  CardHeader,
  Fade,
  Modal as MUIModal,
} from "@mui/material";
import { FC } from "react";

type Props = {
  open: boolean;
  handleClose: () => void;
  title?: string;
  subheader?: string;
};

const Modal: FC<Props> = ({
  open,
  handleClose,
  children,
  title,
  subheader,
}) => {
  return (
    <MUIModal
      aria-labelledby="transition-modal"
      aria-describedby="transition-modal"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Card
          sx={{
            ...ABSOLUTE_CENTER,
            maxWidth: "600px",
          }}
        >
          {title || subheader ? (
            <CardHeader title={title} subheader={subheader} />
          ) : null}
          <CardContent>{children}</CardContent>
        </Card>
      </Fade>
    </MUIModal>
  );
};
export default Modal;
