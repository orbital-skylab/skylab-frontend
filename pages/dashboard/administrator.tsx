import type { NextPage } from "next";
import Body from "@/components/layout/Body";
import { ROLES } from "@/types/roles";

const AdministratorDashboard: NextPage = () => {
  return <Body authorizedRoles={[ROLES.ADMINISTRATORS]}></Body>;
};
export default AdministratorDashboard;
