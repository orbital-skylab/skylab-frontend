import type { NextPage } from "next";
import Body from "@/components/layout/Body";
import { ROLES } from "@/types/roles";

const MentorDashboard: NextPage = () => {
  return <Body authorizedRoles={[ROLES.MENTORS]}></Body>;
};
export default MentorDashboard;
