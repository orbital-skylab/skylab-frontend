// Components
import { Card, CardContent, Grid, Typography } from "@mui/material";
import CustomHead from "@/components/CustomHead";
import Body from "@/components/layout/Body";
import Link from "next/link";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Constants
import { BASE_TRANSITION } from "@/styles/constants";
// Types
import type { NextPage } from "next";
import { ROLES } from "@/types/roles";
import useAuth from "@/hooks/useAuth";
import { getUserRoles, userHasRole } from "@/helpers/roles";
import { useRouter } from "next/router";

const pages = [
  {
    title: "Student Dashboard",
    description:
      "Submit milestone deliverables, view other team's submissions, provide milestone evaluations.",
    href: PAGES.DASHBOARD_STUDENT,
    authorizedRole: ROLES.STUDENTS,
  },
];

const Manage: NextPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading && user && getUserRoles(user).length === 1) {
    const role = getUserRoles(user)[0];
    switch (role) {
      case ROLES.STUDENTS:
        router.push(PAGES.DASHBOARD_STUDENT);
        break;
      default:
        break;
    }
  }

  const visiblePages =
    !isLoading && user
      ? pages.filter((page) => userHasRole(user, page.authorizedRole))
      : [];

  return (
    <>
      <CustomHead
        title="Manage Platform"
        description="Only authorized administrators can view this page. Here, you can manage the deadlines, cohorts, users and projects of NUS Orbital!"
      />
      <Body
        authorizedRoles={[
          ROLES.STUDENTS,
          ROLES.ADVISERS,
          ROLES.MENTORS,
          ROLES.ADMINISTRATORS,
        ]}
        isLoading={isLoading}
      >
        <Grid
          container
          spacing="1rem"
          sx={{ paddingX: { xs: "0", md: "10%" } }}
        >
          {visiblePages.map((page) => (
            <Grid item xs={12} sm={4} key={page.title}>
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: BASE_TRANSITION,
                  "&:hover": {
                    transform: "scale(105%)",
                  },
                }}
              >
                <Link passHref href={page.href}>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <Typography fontWeight={600}>{page.title}</Typography>
                    <Typography variant="body2">{page.description}</Typography>
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Body>
    </>
  );
};
export default Manage;
