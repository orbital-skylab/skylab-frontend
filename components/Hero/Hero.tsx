import { Translate } from "@mui/icons-material";
import { Box, Typography, Stack } from "@mui/material";
import Image from "next/image";
import { FC } from "react";
import styles from "./Hero.module.scss";

const Hero: FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        position: "relative",
        top: { xs: "-56px", sm: "-64px", md: "-68.5px" },
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <div className={styles.space}>
        <div className={styles.stars}></div>
        <div className={styles.stars}></div>
        <div className={styles.stars}></div>
        <div className={styles.stars}></div>
        <div className={styles.stars}></div>
      </div>
      <Stack
        sx={{ height: "100%", width: "100%", position: "absolute" }}
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing="0.5rem"
      >
        <Typography
          color="primary.contrastText"
          fontSize={{ xs: "3rem", md: "4rem", lg: "5rem" }}
          fontWeight="800"
          variant="h1"
          textAlign="center"
          sx={{
            textShadow: "0px 0px 8px white",
          }}
          textTransform="uppercase"
          letterSpacing="0.3em"
        >
          Orbital
        </Typography>
        <Typography
          color="primary.contrastText"
          fontSize={{ xs: "1.2rem", md: "2rem", lg: "3rem" }}
          fontWeight="600"
          variant="h2"
          textAlign="center"
          sx={{
            textShadow: "0px 2px 8px #333333",
          }}
        >
          By NUS School of Computing
        </Typography>
      </Stack>
    </Box>
  );
};
export default Hero;
