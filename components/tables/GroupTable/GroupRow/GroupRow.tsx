import { FC, useState } from "react";
// Components
import HoverLink from "@/components/typography/HoverLink";
import DeleteGroupModal from "@/components/modals/DeleteGroupModal";
import { Box, Button, Stack, TableCell, TableRow } from "@mui/material";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Types
import { Mutate } from "@/hooks/useFetch";
import { Project } from "@/types/projects";
import { BASE_TRANSITION } from "@/styles/constants";
import { GetProjectsResponse } from "@/types/api";
import EditGroupModal from "@/components/modals/EditGroupModal";

type Props = {
  groupId: number;
  groupSet: Set<Project>;
  mutate: Mutate<GetProjectsResponse>;
  showAdviserColumn: boolean;
  setSuccess: (message: string) => void;
  setError: (error: unknown) => void;
};

const GroupRow: FC<Props> = ({
  groupId,
  groupSet,
  mutate,
  showAdviserColumn,
  setSuccess,
  setError,
}) => {
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditGroupOpen(true);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteGroupOpen(true);
  };

  const adviser = Array.from(groupSet)[0].adviser;

  return (
    <>
      <EditGroupModal
        open={isEditGroupOpen}
        setOpen={setIsEditGroupOpen}
        groupId={groupId}
        groupSet={groupSet}
        mutate={mutate}
      />
      <DeleteGroupModal
        open={isDeleteGroupOpen}
        setOpen={setIsDeleteGroupOpen}
        groupId={groupId}
        mutate={mutate}
        setSuccess={setSuccess}
        setError={setError}
      />
      <TableRow>
        <TableCell>{groupId}</TableCell>
        <TableCell>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {Array.from(groupSet).map((project) => (
              <HoverLink
                key={project.id}
                href={`${PAGES.PROJECTS}/${project.id}`}
              >
                {project.name}
              </HoverLink>
            ))}
          </Box>
        </TableCell>
        {showAdviserColumn && adviser && (
          <TableCell>
            <Stack direction="row" spacing="0.25rem">
              <HoverLink href={`${PAGES.USERS}/${adviser.adviserId}`}>
                {adviser.name}
              </HoverLink>
            </Stack>
          </TableCell>
        )}
        <TableCell>
          <Button onClick={handleOpenEditModal}>Edit</Button>
          <Button
            onClick={handleOpenDeleteModal}
            sx={{
              transition: BASE_TRANSITION,
              "&:hover": {
                backgroundColor: "error.main",
                color: "white",
              },
            }}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default GroupRow;
