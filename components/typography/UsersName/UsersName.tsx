import { PAGES } from "@/helpers/navigation";
import { UserMetadata } from "@/types/users";
import { FC } from "react";
import HoverLink from "../HoverLink";

type Props = {
  user: UserMetadata;
};

const UsersName: FC<Props> = ({ user }) => {
  return <HoverLink href={`${PAGES.USERS}/${user.id}`}>{user.name}</HoverLink>;
};

export default UsersName;
