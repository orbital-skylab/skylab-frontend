import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { FC } from "react";
import {
  NUS_SOC,
  ORBITAL_WORDPRESS,
  SKYLAB_FRONTEND_ISSUES,
} from "./Footer.constants";

const Footer: FC = () => {
  return (
    <Box sx={{ backgroundColor: "primary.main" }}>
      <Container maxWidth="xl" sx={{ paddingX: "1rem" }}>
        <Stack direction="row" justifyContent="space-between" paddingY="1rem">
          <Link href={NUS_SOC} target="_blank" rel="noreferrer">
            <Typography color="primary.contrastText">©NUS SoC</Typography>
          </Link>
          <Link href={ORBITAL_WORDPRESS} target="_blank" rel="noreferrer">
            <Typography color="primary.contrastText">
              Orbital Program
            </Typography>
          </Link>
          <Link href={SKYLAB_FRONTEND_ISSUES} target="_blank" rel="noreferrer">
            <Typography color="primary.contrastText">Report Issues</Typography>
          </Link>
        </Stack>
      </Container>
    </Box>
  );
};
export default Footer;
