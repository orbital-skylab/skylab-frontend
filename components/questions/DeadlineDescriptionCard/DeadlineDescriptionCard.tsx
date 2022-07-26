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
  isPreviewMode?: boolean;
  handleTogglePreviewMode?: () => void; // Does not render toggle when not provided
  deadlineName: string | undefined;
  deadlineDescription: string;
  setDeadlineDescription?: Dispatch<SetStateAction<string>>;
};

const DeadlineDescriptionCard: FC<Props> = ({
  isPreviewMode = false,
  handleTogglePreviewMode,
  deadlineName = "",
  deadlineDescription,
  setDeadlineDescription,
}) => {
  const handleDeadlineDescriptionChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (setDeadlineDescription) {
      setDeadlineDescription(e.target.value);
    }
  };

  return (
    <Card elevation={5} sx={{ marginBottom: "2rem" }}>
      <CardContent>
        <Stack direction="row" alignItems="center" marginBottom="0.5rem">
          <Typography variant="h1" fontSize="1.25rem" fontWeight={600}>
            {deadlineName}
          </Typography>
          {handleTogglePreviewMode && (
            <FormControlLabel
              id="preview-questions-button"
              value={isPreviewMode}
              onClick={handleTogglePreviewMode}
              control={<Switch color="info" />}
              label="Preview Questions"
              labelPlacement="start"
              sx={{ marginLeft: "auto" }}
            />
          )}
        </Stack>

        {!isPreviewMode ? (
          <TextField
            id="deadline-description-input"
            size="small"
            minRows={3}
            multiline
            fullWidth
            value={deadlineDescription}
            onChange={handleDeadlineDescriptionChange}
          />
        ) : (
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {deadlineDescription}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
export default DeadlineDescriptionCard;
