import { Project } from "@/types/projects";
import {
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";

type Props = {
  candidates: Project[];
  setSelectedCandidates: Dispatch<SetStateAction<{ [key: number]: boolean }>>;
};

const VotingForm: FC<Props> = ({
  setSelectedCandidates,
  candidates,
}: Props) => {
  const [voteInput, setVoteInput] = useState<string>("");
  const [detectedProjects, setDetectedProjects] = useState<Project[]>([]);
  const [invalidIds, setInvalidIds] = useState<number[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setVoteInput(input);

    // Parse the input string into an array of candidate ids.
    const candidateIds = input
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0 && Number.isInteger(Number(id)))
      .map((id) => parseInt(id));

    // Set selected candidates for voting logic.
    setSelectedCandidates(
      candidateIds.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as { [key: number]: boolean })
    );

    // Detect the matching projects by their IDs.
    const detected = candidates.filter((candidate) =>
      candidateIds.includes(candidate.id)
    );
    setDetectedProjects(detected);

    // Identify invalid IDs (those not found in the candidates).
    const invalid = candidateIds.filter(
      (id) => !candidates.some((candidate) => candidate.id === id)
    );
    setInvalidIds(invalid);
  };

  return (
    <Stack spacing={2} flexGrow={1} marginTop={2}>
      <Typography id="voting-form-description">
        Enter project ids separated by commas (whitespaces are ignored) to vote
        for them. (e.g. 2, 103, 55)
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
      {detectedProjects.length > 0 && (
        <Stack>
          <Typography>Detected Projects:</Typography>
          <List>
            {detectedProjects.map((project) => (
              <ListItem key={project.id}>
                <ListItemText
                  primary={`ID: ${project.id} - Name: ${project.name}`}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      )}
      {invalidIds.length > 0 && (
        <Stack>
          <Typography color="error">Invalid Project IDs:</Typography>
          <List>
            {invalidIds.map((id) => (
              <ListItem key={id}>
                <ListItemText primary={`ID: ${id} is not valid`} />
              </ListItem>
            ))}
          </List>
        </Stack>
      )}
    </Stack>
  );
};

export default VotingForm;
