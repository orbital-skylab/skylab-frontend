import DeleteProjectModal from "@/components/modals/DeleteProjectModal";
import SnackbarAlert from "@/components/SnackbarAlert";
import { PAGES } from "@/helpers/navigation";
import { Mutate } from "@/hooks/useFetch";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";
import { KeyboardArrowDown } from "@mui/icons-material";
import {
  Button,
  Chip,
  Menu,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
} from "@mui/material";
import Link from "next/link";
import { FC, MouseEvent, useState } from "react";

type Props = {
  project: Project;
  mutate: Mutate<Project[]>;
};

const ProjectRow: FC<Props> = ({ project, mutate }) => {
  const { snackbar, setSuccess, setError, handleClose } = useSnackbarAlert();
  const [dropdownAnchorElement, setDropdownAnchorElement] =
    useState<HTMLElement | null>(null);
  const isDropdownOpen = Boolean(dropdownAnchorElement);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);

  const handleOpenDropdown = (e: MouseEvent<HTMLButtonElement>) => {
    setDropdownAnchorElement(e.currentTarget);
  };

  const handleCloseDropdown = () => {
    setDropdownAnchorElement(null);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteProjectOpen(true);
  };

  const renderTags = () => {
    const tags = [];

    if (!project?.achievement) return;
    switch (project.achievement) {
      case LEVELS_OF_ACHIEVEMENT.VOSTOK:
        tags.push(
          <Chip
            key={`project ${project.id}`}
            label={LEVELS_OF_ACHIEVEMENT.VOSTOK}
            color="primary"
            size="small"
          />
        );
        break;
      case LEVELS_OF_ACHIEVEMENT.GEMINI:
        tags.push(
          <Chip
            key={`project ${project.id}`}
            label={LEVELS_OF_ACHIEVEMENT.GEMINI}
            color="secondary"
            size="small"
          />
        );
        break;
      case LEVELS_OF_ACHIEVEMENT.APOLLO:
        tags.push(
          <Chip
            key={`project ${project.id}`}
            label={LEVELS_OF_ACHIEVEMENT.APOLLO}
            color="info"
            size="small"
          />
        );
        break;

      case LEVELS_OF_ACHIEVEMENT.ARTEMIS:
        tags.push(
          <Chip
            key={`project ${project.id}`}
            label={LEVELS_OF_ACHIEVEMENT.ARTEMIS}
            color="success"
            size="small"
          />
        );
        break;
      default:
        break;
    }
    return tags;
  };

  return (
    <>
      <DeleteProjectModal
        open={isDeleteProjectOpen}
        setOpen={setIsDeleteProjectOpen}
        project={project}
        mutate={mutate}
        setSuccess={setSuccess}
        setError={setError}
      />
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <TableRow>
        <TableCell>{project.id}</TableCell>
        <TableCell>{project.name}</TableCell>
        <TableCell>
          <Stack direction="row" spacing="0.25rem">
            {renderTags()}
          </Stack>
        </TableCell>
        <TableCell>
          <Button
            variant="outlined"
            size="small"
            onClick={handleOpenDropdown}
            endIcon={<KeyboardArrowDown />}
          >
            Options
          </Button>
          <Menu
            anchorEl={dropdownAnchorElement}
            open={isDropdownOpen}
            onClose={handleCloseDropdown}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Link href={`${PAGES.PROJECTS}/${project.id}`} passHref>
              <MenuItem>View Details</MenuItem>
            </Link>
            <MenuItem
              onClick={handleOpenDeleteModal}
              sx={{
                "&:hover": {
                  backgroundColor: "error.main",
                  color: "white",
                },
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProjectRow;
