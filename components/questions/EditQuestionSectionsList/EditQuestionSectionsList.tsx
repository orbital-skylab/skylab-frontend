import { FC, useState } from "react";
// Components
import EditQuestionSection from "./EditQuestionSection";
import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";
// Hooks
import { UseSectionsActions } from "@/hooks/useQuestionSections";
// Types
import { LeanSection } from "@/types/deadlines";

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
  const { addSection } = questionSectionsActions;

  const [selectedSection, setSelectedSection] = useState(0);

  return (
    <Stack spacing="1rem">
      <Stack sx={{ gap: "2rem" }}>
        {sections.map((section, idx) => (
          <EditQuestionSection
            key={idx}
            idx={idx}
            section={section}
            isSelectedSection={selectedSection === idx}
            setAsSelected={() => setSelectedSection(idx)}
            numberOfSections={sections.length}
            questionSectionsActions={questionSectionsActions}
          />
        ))}
      </Stack>
      <Button
        variant="outlined"
        color="secondary"
        onClick={addSection}
        sx={{
          width: "fit-content",
          alignSelf: "center",
        }}
      >
        <Add /> Section
      </Button>

      <Stack direction="row" justifyContent="space-between">
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
