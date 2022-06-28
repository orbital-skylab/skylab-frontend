import { FC } from "react";
// Components
import { Box, Button, Stack, Typography } from "@mui/material";
import AdministratorDetails from "@/components/details/AdministratorDetails";
import AdviserDetails from "@/components/details/AdviserDetails";
import MentorDetails from "@/components/details/MentorDetails";
import StudentDetails from "@/components/details/StudentDetails";
import UserDetails from "@/components/details/UserDetails";
// Helpers
import { toSingular } from "@/helpers/roles";
// Types
import {
  AdministratorRole,
  AdviserRole,
  MentorRole,
  ROLES,
  StudentRole,
} from "@/types/roles";
import { User } from "@/types/users";

type Props = {
  user: User;
  selectedRole: ROLES | null;
  handleCloseModal: () => void;
  setDeleteMode: () => void;
  setEditMode: () => void;
};

const ViewRole: FC<Props> = ({
  user,
  selectedRole,
  handleCloseModal,
  setDeleteMode,
  setEditMode,
}) => {
  const renderRoleDetails = () => {
    switch (selectedRole) {
      case ROLES.STUDENTS:
        return <StudentDetails studentRole={user.student as StudentRole} />;
      case ROLES.ADVISERS:
        return <AdviserDetails adviserRole={user.adviser as AdviserRole} />;
      case ROLES.MENTORS:
        return <MentorDetails mentorRole={user.mentor as MentorRole} />;
      case ROLES.ADMINISTRATORS:
        return (
          <AdministratorDetails
            administratorRole={user.administrator as AdministratorRole}
          />
        );
    }
  };

  return (
    <>
      <Stack direction="column" spacing="1rem">
        <Box>
          <Typography fontWeight={600} mb="0.25rem">
            User Details
          </Typography>
          <UserDetails user={user} />
        </Box>

        <Box>
          <Typography fontWeight={600} mb="0.25rem">{`${toSingular(
            selectedRole
          )} Details`}</Typography>
          {renderRoleDetails()}
        </Box>
      </Stack>
      <Stack direction="row" justifyContent="space-between" marginTop="2rem">
        <Button size="small" onClick={handleCloseModal}>
          Close
        </Button>
        <Button
          size="small"
          onClick={setDeleteMode}
          sx={{ ml: "auto", mr: "1rem" }}
          variant="contained"
          color="error"
        >
          Delete
        </Button>
        <Button
          size="small"
          onClick={setEditMode}
          variant="contained"
          color="warning"
        >
          Edit
        </Button>
      </Stack>
    </>
  );
};
export default ViewRole;
