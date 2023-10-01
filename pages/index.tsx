import type { NextPage } from "next";
import Body from "@/components/layout/Body";
import { Box } from "@mui/system";
import Hero from "@/components/Hero";
import About from "@/components/About";
import { Deadline } from "@/types/deadlines";
import useFetch from "@/hooks/useFetch";

type GetLatestApplicationResponse = {
  application: Deadline | null;
};

const Home: NextPage = () => {
  const { data } = useFetch<GetLatestApplicationResponse>({
    endpoint: "/application",
  });

  return (
    <Body>
      <Hero isApplicationOngoing={Boolean(data?.application)} />
      <About />
      <Box sx={{ marginY: "5vh" }} />
    </Body>
  );
};

export default Home;
