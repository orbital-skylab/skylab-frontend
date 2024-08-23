import { Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";

type Props = {
  setSelectedCandidates: Dispatch<SetStateAction<{ [key: number]: boolean }>>;
};

const VotingForm: FC<Props> = ({ setSelectedCandidates }: Props) => {
  const [voteInput, setVoteInput] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setVoteInput(input);

    // parse the input string into an array of candidate ids.
    // filter out any non integer values.
    const candidateIds = input
      .split(",")
      .map((id) => id.trim())
      .filter((id) => Number.isInteger(Number(id)))
      .map((id) => parseInt(id));

    setSelectedCandidates(
      candidateIds.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as { [key: number]: boolean })
    );
  };

  return (
    <Stack spacing={2} flexGrow={1}>
      <Typography id="voting-form-description">
        Enter project ids separated by commas to vote for them. (e.g. 4033,
        4034, 4035)
      </Typography>
      <TextField
        id="votes-input"
        label="Enter project ids separated by commas"
        multiline={true}
        value={voteInput}
        type="text"
        name="votes"
        onChange={handleInputChange}
        minRows={3}
        size="medium"
      />
    </Stack>
  );
};
export default VotingForm;
