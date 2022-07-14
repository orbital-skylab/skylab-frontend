import type { NextPage } from "next";
import Body from "@/components/layout/Body";
import { ROLES } from "@/types/roles";

const AdviserDashboard: NextPage = () => {
  return <Body authorizedRoles={[ROLES.ADVISERS]}></Body>;
};
export default AdviserDashboard;
