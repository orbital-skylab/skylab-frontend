import type { NextPage } from "next";
import Body from "@/components/Body";
import Hero from "@/components/Hero";
import { Stack, Typography } from "@mui/material";

const Home: NextPage = () => {
  return (
    <Body>
      <Hero />
      <Stack direction="column" spacing="0.5rem">
        <Typography variant="h2">About Orbital</Typography>
        <Typography variant="body1">
          Orbital (a.k.a., CP2106: Independent Software Development Project) is
          the School of Computing’s 1st year summer self-directed, independent
          work course. This programme gives students the opportunity to pick up
          software development skills on their own, using sources on the web.
          All while receiving course credit in the form of 4 modular credits of
          Unrestricted Electives (UE). SoC provides the Orbital framework for
          helping students stay motivated and driven to complete a project of
          their own design, by structuring peer evaluation, critique and
          presentation milestones over the summer period.
        </Typography>
      </Stack>
    </Body>
  );
};

export default Home;
