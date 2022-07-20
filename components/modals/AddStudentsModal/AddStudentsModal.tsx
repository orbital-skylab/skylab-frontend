import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const AddStudentsModal: FC<Props> = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Adding Students"
    ></Modal>
  );
};
export default AddStudentsModal;
