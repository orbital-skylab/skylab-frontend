import { Box } from "@mui/material";
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
      }}
    >
      <div className={styles.space}>
        <div className={styles.stars}></div>
        <div className={styles.stars}></div>
        <div className={styles.stars}></div>
        <div className={styles.stars}></div>
        <div className={styles.stars}></div>
      </div>
    </Box>
  );
};
export default Hero;
