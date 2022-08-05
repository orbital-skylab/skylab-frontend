import { UseSectionsActions } from "@/hooks/useQuestionSections";
import { LeanSection } from "@/types/deadlines";
import { MoreVert } from "@mui/icons-material";
import {
  Card,
  Typography,
  CardContent,
  Stack,
  Box,
  TextField,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { ChangeEvent, FC, useState } from "react";
import EditQuestionsList from "../EditQuestionsList";

type Props = {
  section: LeanSection;
  idx: number;
  isSelectedSection: boolean;
  setAsSelected: () => void;
  numberOfSections: number;
  questionSectionsActions: UseSectionsActions;
};

const EditQuestionSection: FC<Props> = ({
  section,
  idx,
  isSelectedSection,
  setAsSelected,
  numberOfSections,
  questionSectionsActions,
}) => {
  const { name, desc, questions } = section;
  const {
    generateSetQuestionGenerator,
    generateAddQuestion,
    generateDeleteSection,
    setSectionDetails,
  } = questionSectionsActions;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = !!anchorEl;

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const generateHandleChangeSectionName =
    (sectionIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setSectionDetails(sectionIdx, { name: e.target.value });
    };
  const generateHandleChangeSectionDesc =
    (sectionIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setSectionDetails(sectionIdx, { desc: e.target.value });
    };

  return (
    <Card
      key={idx}
      sx={{
        borderLeft: isSelectedSection ? 5 : 0,
        borderColor: "primary.main",
        position: "relative",
        overflow: "visible",
        marginTop: "2rem",
      }}
      onClick={setAsSelected}
    >
      <Typography
        sx={{
          padding: "0.5rem 1rem",
          position: "absolute",
          bottom: "100%",
          backgroundColor: "primary.main",
          color: "white",
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
        }}
        fontWeight={600}
      >{`Section ${idx + 1} of ${numberOfSections}`}</Typography>
      <CardContent>
        <Stack>
          {/* <Box sx={{ display: "flex", gap: "1rem" }}> */}
          <Stack direction="row" spacing="1rem">
            <Box sx={{ width: "100%" }}>
              <TextField
                className="section-name-input"
                size="small"
                fullWidth
                value={name}
                onChange={generateHandleChangeSectionName(idx)}
                placeholder="Section Name"
                sx={{
                  marginBottom: "0.5rem",
                }}
                InputProps={{ sx: { fontSize: "1.2rem" } }}
              />
              <TextField
                className="section-description-input"
                size="small"
                minRows={3}
                multiline
                fullWidth
                value={desc}
                onChange={generateHandleChangeSectionDesc(idx)}
                placeholder="Description (optional)"
                sx={{ marginBottom: "1rem" }}
              />
            </Box>
            {isSelectedSection && (
              <Box>
                <IconButton
                  aria-controls={isMenuOpen ? "long-menu" : undefined}
                  aria-expanded={isMenuOpen ? "true" : undefined}
                  onClick={handleOpenMenu}
                >
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={generateDeleteSection(idx)}>
                    Delete Section
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Stack>

          <EditQuestionsList
            questions={questions}
            generateSetQuestion={generateSetQuestionGenerator(idx)}
            addQuestion={generateAddQuestion(idx)}
            isShowingSettings={isSelectedSection}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
export default EditQuestionSection;
