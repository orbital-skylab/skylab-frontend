import { Box, Container, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { ORBITAL_WORDPRESS } from "../layout/Footer/Footer.constants";

const About: FC = () => {
  return (
    <Container maxWidth="md" sx={{ padding: 0, mb: "15vh" }}>
      <Box
        component="img"
        src="/skylab-logo.png"
        alt="Skylab Logo"
        sx={{
          margin: "auto",
          width: { xs: "300px", md: "400px" },
          height: { xs: "300px", md: "400px" },
          mb: { md: "-1rem" },
        }}
      />
      <Typography
        variant="h2"
        fontWeight={600}
        fontSize={{ xs: 36, md: 52 }}
        marginBottom="2rem"
        color="primary"
      >
        About Orbital
      </Typography>
      <Stack spacing="1rem">
        <Typography variant="body1" textAlign="justify">
          Orbital (a.k.a., CP2106: Independent Software Development Project) is
          the School of Computing’s 1st year summer self-directed, independent
          work course.
        </Typography>

        <Typography variant="body1" textAlign="justify">
          This programme gives students the opportunity to pick up software
          development skills on their own, using sources on the web. All while
          receiving course credit in the form of 4 modular credits of
          Unrestricted Electives (UE).
        </Typography>
        <Typography variant="body1" textAlign="justify">
          SoC provides the Orbital framework for helping students stay motivated
          and driven to complete a project of their own design, by structuring
          peer evaluation, critique and presentation milestones over the summer
          period.
        </Typography>
        <Typography variant="body1">
          To view more details about the program, do check out the{" "}
          <a href={ORBITAL_WORDPRESS} target="_blank" rel="noreferrer">
            Offical Orbital Program Website
          </a>
        </Typography>
      </Stack>
    </Container>
  );
};
export default About;
