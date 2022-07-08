import { FC } from "react";
// Components
import { Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

type Props = {
  addNewQuestion: (asOnlyQuestion: boolean) => void;
};

const AddQuestionButton: FC<Props> = ({ addNewQuestion }) => {
  return (
    <Stack width="100%" justifyContent="center" sx={{ marginTop: "1rem" }}>
      <Button
        onClick={() => addNewQuestion(false)}
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
