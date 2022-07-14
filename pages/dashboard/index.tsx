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
import { userHasRole } from "@/helpers/roles";

const pages = [
  {
    title: "Student Dashboard",
    description:
      "Submit milestone deliverables, view other team's submissions, provide milestone evaluations.",
    href: PAGES.DASHBOARD_STUDENT,
    authorizedRole: ROLES.STUDENTS,
  },
  {
    title: "Adviser Dashboard",
    description:
      "View your teams' milestone submissions and evaluations, evaluate your teams and manage their evaluation groups",
    href: PAGES.DASHBOARD_ADVISER,
    authorizedRole: ROLES.ADVISERS,
  },
  {
    title: "Mentor Dashboard",
    description: "View your teams' milestone submissions",
    href: PAGES.DASHBOARD_MENTOR,
    authorizedRole: ROLES.MENTORS,
  },
  {
    title: "Administrator Dashboard",
    description:
      "View all teams' submissions to ensure all of them have submitted on time",
    href: PAGES.DASHBOARD_ADMINISTRATOR,
    authorizedRole: ROLES.ADMINISTRATORS,
  },
];

const Dashboard: NextPage = () => {
  const { user, isLoading } = useAuth();

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
export default Dashboard;
