import type { NextPage } from "next";
import Body from "@/components/Body";
import { Box } from "@mui/system";
import Hero from "@/components/Hero";

const Home: NextPage = () => {
  return (
    <Body>
      <Hero />
      <h1>Testing</h1>
      <Box
        sx={{
          backgroundColor: "background.default",
          height: "100vh",
          width: "100vw",
        }}
      ></Box>
    </Body>
  );
};

export default Home;
