import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";

type Props = {
  isPreviewMode: boolean;
  handleTogglePreviewMode: () => void;
  deadlineName: string | undefined;
  deadlineDescription: string;
  setDeadlineDescription: Dispatch<SetStateAction<string>>;
};

const DeadlineDescriptionCard: FC<Props> = ({
  isPreviewMode,
  handleTogglePreviewMode,
  deadlineName = "",
  deadlineDescription,
  setDeadlineDescription,
}) => {
  const handleDeadlineDescriptionChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setDeadlineDescription(e.target.value);
  };

  return (
    <Card elevation={5} sx={{ marginBottom: "1rem" }}>
      <CardContent>
        <Stack direction="row" alignItems="center" marginBottom="0.5rem">
          <Typography variant="h6">{deadlineName}</Typography>
          <FormControlLabel
            value={isPreviewMode}
            onClick={handleTogglePreviewMode}
            control={<Switch color="info" />}
            label="Preview Questions"
            labelPlacement="start"
            sx={{ marginLeft: "auto" }}
          />
        </Stack>

        {!isPreviewMode ? (
          <TextField
            size="small"
            rows={3}
            multiline
            fullWidth
            value={deadlineDescription}
            onChange={handleDeadlineDescriptionChange}
          />
        ) : (
          <Typography variant="body2">{deadlineDescription}</Typography>
        )}
      </CardContent>
    </Card>
  );
};
export default DeadlineDescriptionCard;
