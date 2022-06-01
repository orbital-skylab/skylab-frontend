import { PAGES } from "@/helpers/navigation";
import useAuth from "@/hooks/useAuth";
import { FULL_HEIGHT_MINUS_NAV, NAVBAR_HEIGHT_REM } from "@/styles/constants";
import { Box, Typography, Stack, Grid, Button, Container } from "@mui/material";
import { useRouter } from "next/router";
import { FC } from "react";
import HeroSignIn from "./HeroSignIn";

const Hero: FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <>
      <Box
        sx={{
          paddingBottom: { md: NAVBAR_HEIGHT_REM },
        }}
      >
        <Container maxWidth="lg">
          <Grid container>
            <Grid
              item
              xs={12}
              md={!user ? 8 : 12}
              sx={{
                height: FULL_HEIGHT_MINUS_NAV,
                paddingBottom: { xs: NAVBAR_HEIGHT_REM, md: 0 },
                display: "grid",
                placeItems: "center",
              }}
            >
              <Stack
                direction="column"
                spacing="1rem"
                alignItems={{ xs: "center", md: user ? "center" : "start" }}
              >
                <Typography
                  variant="h1"
                  fontSize={{ xs: 64, md: 96 }}
                  fontWeight={600}
                  sx={{
                    letterSpacing: "0.25rem",
                    textAlign: { xs: "center", md: "left" },
                  }}
                  color="primary"
                >
                  Skylab
                </Typography>
                <Typography
                  variant="body1"
                  fontSize={{ xs: 18, md: 24 }}
                  sx={{ textAlign: { xs: "center", md: "left" } }}
                >
                  The platform powering{" "}
                  <Typography component="span" fontSize="inherit">
                    NUS Orbital
                  </Typography>
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    width: "fit-content",
                    alignSelf: { xs: "center", md: !user ? "start" : "center" },
                  }}
                  onClick={() => router.push(PAGES.PROJECTS)}
                >
                  View Projects
                </Button>
              </Stack>
            </Grid>
            <Grid
              item
              xs={!user ? 12 : 0}
              md={!user ? 4 : 0}
              sx={{
                height: { md: FULL_HEIGHT_MINUS_NAV },
                marginBottom: { xs: "4rem", md: 0 },
                display: "grid",
                placeItems: "center",
              }}
            >
              <HeroSignIn />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
export default Hero;
