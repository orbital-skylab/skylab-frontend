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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { users: User[]; mutate: Mutate<User[]> };

const ColumnHeadings = [
  "User ID",
  "User Name",
  "User Email",
  "Roles",
  "Actions",
];

const UserTable: FC<Props> = ({ users, mutate }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {ColumnHeadings.map((heading) => (
              <TableCell key={heading}>{heading}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} mutate={mutate} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default UserTable;
