import { FC } from "react";
// Components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import UserRow from "./UserRow";

// Types
import { User } from "@/types/users";
import { Mutate } from "@/hooks/useFetch";
import { LeanTeam } from "@/types/teams";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = {
  users: User[];
  mutate: Mutate<User[]>;
  leanTeams: LeanTeam[] | undefined;
  isFetchingLeanTeams: boolean;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "User ID", align: "left" },
  { heading: "Name", align: "left" },
  { heading: "Email", align: "left" },
  { heading: "Roles", align: "left" },
  { heading: "Actions", align: "right" },
];

const UserTable: FC<Props> = ({
  users,
  mutate,
  leanTeams,
  isFetchingLeanTeams,
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columnHeadings.map(({ heading, align }) => (
              <TableCell key={heading} align={align}>
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              mutate={mutate}
              leanTeams={leanTeams}
              isFetchingLeanTeams={isFetchingLeanTeams}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default UserTable;
