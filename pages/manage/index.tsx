// Components
import { Card, CardContent, Grid, Typography } from "@mui/material";
import CustomHead from "@/components/layout/CustomHead";
import Body from "@/components/layout/Body";
import Link from "next/link";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Constants
import { BASE_TRANSITION } from "@/styles/constants";
// Types
import type { NextPage } from "next";
import { ROLES } from "@/types/roles";

const pages = [
  {
    title: "Announcements",
    id: "manage-announcements-card",
    description: "Create, edit and delete announcements.",
    href: PAGES.MANAGE_ANNOUNCEMENTS,
  },
  {
    title: "Cohorts",
    id: "manage-cohorts-card",
    description:
      "Create, edit and delete cohorts, their start dates, and end dates.",
    href: PAGES.MANAGE_COHORTS,
  },
  {
    title: "Deadlines and Questions",
    id: "manage-deadlines-card",
    description:
      "Create, edit and delete milestones, evaluations and other submissions. Additionally, configure the questions for each submission.",
    href: PAGES.MANAGE_DEADLINES,
  },
  {
    title: "Users",
    id: "manage-users-card",
    description:
      "Create, delete, and view all users. Manage user roles by adding, editing or deleting them.",
    href: PAGES.MANAGE_USERS,
  },
  {
    title: "Add Users with CSV files",
    id: "batch-add-users-card",
    description:
      "Add students with projects, advisers, or mentors using CSV files.",
    href: PAGES.MANAGE_USERS_CSV,
  },
  {
    title: "Teams",
    id: "manage-projects-card",
    description:
      "Create, edit, delete, and view all teams. Change a team's name, LOA, students, adviser or mentor.",
    href: PAGES.MANAGE_PROJECTS,
  },
];

const Manage: NextPage = () => {
  return (
    <>
      <CustomHead
        title="Manage Platform"
        description="Only authorized administrators can view this page. Here, you can manage the deadlines, cohorts, users and projects of NUS Orbital!"
      />
      <Body authorizedRoles={[ROLES.ADMINISTRATORS]}>
        <Grid
          container
          spacing="1rem"
          sx={{ paddingX: { xs: "0", md: "10%" } }}
        >
          {pages.map((page) => (
            <Grid id={page.id} item xs={12} sm={4} key={page.title}>
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
