import { UseSectionsActions } from "@/hooks/useQuestionSections";
import { LeanSection } from "@/types/deadlines";
import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Card, CardContent, Stack, TextField } from "@mui/material";
import { ChangeEvent, FC } from "react";
import EditQuestionsList from "./EditQuestionsList";

type Props = {
  sections: LeanSection[];
  questionSectionsActions: UseSectionsActions;
  saveQuestionSectionsAndDescription: () => void;
  isSubmitting: boolean;
  resetQuestionSections: () => void;
};

const EditQuestionSectionsList: FC<Props> = ({
  sections,
  questionSectionsActions,
  saveQuestionSectionsAndDescription,
  isSubmitting,
  resetQuestionSections,
}) => {
  const { generateSetQuestionGenerator, addSection, setSectionDetails } =
    questionSectionsActions;

  const generateHandleChangeSectionName =
    (sectionIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setSectionDetails(sectionIdx, { name: e.target.value });
    };
  const generateHandleChangeSectionDesc =
    (sectionIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setSectionDetails(sectionIdx, { desc: e.target.value });
    };

  return (
    <Stack spacing="1rem">
      {sections.map(({ name, desc, questions }, idx) => (
        <Card key={idx}>
          <CardContent>
            <Stack>
              <TextField
                size="small"
                fullWidth
                value={name}
                onChange={generateHandleChangeSectionName(idx)}
              />
              <TextField
                size="small"
                rows={3}
                multiline
                fullWidth
                value={desc}
                onChange={generateHandleChangeSectionDesc(idx)}
              />
              <EditQuestionsList
                questions={questions}
                generateSetQuestion={generateSetQuestionGenerator(idx)}
              />
            </Stack>
          </CardContent>
        </Card>
      ))}
      <Button variant="contained" size="small" onClick={addSection}>
        <Add /> Section
      </Button>

      <Stack direction="row" justifyContent="space-between" mt="2rem">
        <Button onClick={resetQuestionSections}>Reset</Button>
        <LoadingButton
          variant="contained"
          onClick={saveQuestionSectionsAndDescription}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Save
        </LoadingButton>
      </Stack>
    </Stack>
  );
};
export default EditQuestionSectionsList;
