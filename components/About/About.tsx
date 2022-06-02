import { Container, Stack, Typography } from "@mui/material";
import { FC } from "react";

const About: FC = () => {
  return (
    <Container maxWidth="md">
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
      </Stack>
    </Container>
  );
};
export default About;
