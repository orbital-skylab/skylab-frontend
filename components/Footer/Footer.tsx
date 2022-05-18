import { Box, Container, Stack, Typography } from "@mui/material";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <Box sx={{ backgroundColor: "primary.main" }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" paddingY="1rem">
          <Typography color="primary.contrastText">©NUS SoC</Typography>
          <Typography color="primary.contrastText">Orbital Program</Typography>
          <Typography color="primary.contrastText">Report Issues</Typography>
        </Stack>
      </Container>
    </Box>
  );
};
export default Footer;
