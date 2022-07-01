import { FC } from "react";
// Components
import { Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

type Props = {
  addQuestion: () => void;
};

const AddQuestionButton: FC<Props> = ({ addQuestion }) => {
  return (
    <Stack width="100%" justifyContent="center" sx={{ marginTop: "1rem" }}>
      <Button
        onClick={addQuestion}
        variant="contained"
        sx={{ marginX: "auto" }}
        size="small"
      >
        <Add /> Question
      </Button>
    </Stack>
  );
};
export default AddQuestionButton;
