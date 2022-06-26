import Attribute from "@/components/typography/Attribute";
import { User } from "@/types/users";
import { FC } from "react";

type Props = { user: User };

const UserDetails: FC<Props> = ({ user }) => {
  return (
    <>
      <Attribute attribute="User ID" value={user.id} />
      <Attribute attribute="Name" value={user.name} />
      <Attribute attribute="Email" value={user.email} />
    </>
  );
};
export default UserDetails;
