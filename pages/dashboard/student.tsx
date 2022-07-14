import type { NextPage } from "next";
import Body from "@/components/layout/Body";
import { ROLES } from "@/types/roles";

const StudentDashboard: NextPage = () => {
  return <Body authorizedRoles={[ROLES.STUDENTS]}></Body>;
};
export default StudentDashboard;
