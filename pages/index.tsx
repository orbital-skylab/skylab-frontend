import type { NextPage } from "next";
import Body from "@/components/Body";
import { Box } from "@mui/system";
import Hero from "@/components/Hero";
import About from "@/components/About";

const Home: NextPage = () => {
  return (
    <Body>
      <Hero />
      <About />
      <Box sx={{ marginY: "5vh" }} />
    </Body>
  );
};

export default Home;
