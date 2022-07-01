import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { FC } from "react";

type Props = {
  addOption: () => void;
};

const AddOptionButton: FC<Props> = ({ addOption }) => {
  return (
    <Button
      onClick={addOption}
      variant="contained"
      size="small"
      sx={{ width: "fit-content" }}
    >
      <Add />
      Add Option
    </Button>
  );
};
export default AddOptionButton;
