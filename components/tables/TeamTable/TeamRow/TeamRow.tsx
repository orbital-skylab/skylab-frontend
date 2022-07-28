import { FC, useState } from "react";
// Components
import DeleteTeamModal from "@/components/modals/DeleteTeamModal";
import { Button, Chip, Stack, TableCell, TableRow } from "@mui/material";
import Link from "next/link";
import UsersName from "@/components/typography/UsersName";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Types
import { Mutate } from "@/hooks/useFetch";
import { LEVELS_OF_ACHIEVEMENT, Team } from "@/types/teams";
import { BASE_TRANSITION } from "@/styles/constants";

type Props = {
  team: Team;
  mutate: Mutate<Team[]> | undefined;
  showAdviserColumn: boolean;
  showMentorColumn: boolean;
  showEditAction: boolean;
  showDeleteAction: boolean;
};

const TeamRow: FC<Props> = ({
  team,
  mutate,
  showAdviserColumn,
  showMentorColumn,
  showEditAction,
  showDeleteAction,
}) => {
  const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);

  const handleOpenDeleteModal = () => {
    setIsDeleteTeamOpen(true);
  };

  const renderTag = () => {
    if (!team?.achievement) return;

    switch (team.achievement) {
      case LEVELS_OF_ACHIEVEMENT.VOSTOK:
        return (
          <Chip
            key={`Team ${team.id}`}
            label={LEVELS_OF_ACHIEVEMENT.VOSTOK}
            color="primary"
            size="small"
          />
        );
      case LEVELS_OF_ACHIEVEMENT.GEMINI:
        return (
          <Chip
            key={`Team ${team.id}`}
            label={LEVELS_OF_ACHIEVEMENT.GEMINI}
            color="secondary"
            size="small"
          />
        );
      case LEVELS_OF_ACHIEVEMENT.APOLLO:
        return (
          <Chip
            key={`Team ${team.id}`}
            label={LEVELS_OF_ACHIEVEMENT.APOLLO}
            color="info"
            size="small"
          />
        );

      case LEVELS_OF_ACHIEVEMENT.ARTEMIS:
        return (
          <Chip
            key={`Team ${team.id}`}
            label={LEVELS_OF_ACHIEVEMENT.ARTEMIS}
            color="success"
            size="small"
          />
        );
    }
  };

  return (
    <>
      {showDeleteAction && mutate && (
        <DeleteTeamModal
          open={isDeleteTeamOpen}
          setOpen={setIsDeleteTeamOpen}
          team={team}
          mutate={mutate}
        />
      )}
      <TableRow>
        <TableCell>{team.id}</TableCell>
        <TableCell>{team.name}</TableCell>
        <TableCell>
          <Stack direction="row" spacing="0.25rem">
            {renderTag()}
          </Stack>
        </TableCell>
        <TableCell>
          {team.students
            ? team.students.map((student) => (
                <UsersName key={student.id} user={student} />
              ))
            : "-"}
        </TableCell>
        {showAdviserColumn && (
          <TableCell>
            {team.adviser && team.adviser.id ? (
              <UsersName user={team.adviser} />
            ) : (
              "-"
            )}
          </TableCell>
        )}
        {showMentorColumn && (
          <TableCell>
            {team.mentor && team.mentor.id ? (
              <UsersName user={team.mentor} />
            ) : (
              "-"
            )}
          </TableCell>
        )}
        <TableCell align="right">
          <Stack direction="row" spacing="0.5rem" justifyContent="end">
            <Link href={`${PAGES.TEAMS}/${team.id}`} passHref>
              <Button>View</Button>
            </Link>
            {showEditAction && (
              <Link href={`${PAGES.TEAMS}/${team.id}/edit`} passHref>
                <Button>Edit</Button>
              </Link>
            )}
            {showDeleteAction && (
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
            )}
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TeamRow;
