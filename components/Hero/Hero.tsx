import { PAGES } from "@/helpers/navigation";
import useAuth from "@/contexts/useAuth";
import { FULL_HEIGHT_MINUS_NAV, NAVBAR_HEIGHT_REM } from "@/styles/constants";
import { Typography, Stack, Grid, Button, Container, Box } from "@mui/material";
import { useRouter } from "next/router";
import { FC } from "react";
import HeroSignIn from "./HeroSignIn";

type Props = {
  isApplicationOngoing: boolean;
};

const Hero: FC<Props> = ({ isApplicationOngoing }) => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <>
      <Box
        sx={{
          paddingBottom: { md: NAVBAR_HEIGHT_REM },
        }}
      >
        <Container maxWidth="md">
          <Grid container>
            <Grid
              item
              xs={12}
              md={!user ? 8 : 12}
              sx={{
                height: FULL_HEIGHT_MINUS_NAV,
                paddingBottom: { xs: NAVBAR_HEIGHT_REM, md: 0 },
                display: "grid",
                placeItems: {
                  xs: "center",
                  md: user ? "center" : "center left",
                },
              }}
            >
              <Stack
                direction="column"
                alignItems={{ xs: "center", md: user ? "center" : "start" }}
              >
                <Typography
                  variant="h1"
                  fontSize={88}
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
                  fontSize={20}
                  sx={{ textAlign: { xs: "center", md: "left" } }}
                >
                  The platform powering{" "}
                  <Typography component="span" fontSize="inherit">
                    NUS Orbital
                  </Typography>
                </Typography>
                <Stack direction="row" columnGap={2}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      width: "fit-content",
                      alignSelf: {
                        xs: "center",
                        md: !user ? "start" : "center",
                      },
                      marginTop: "1.5rem",
                    }}
                    onClick={() => router.push(PAGES.PROJECTS)}
                  >
                    View Projects
                  </Button>
                  {!user && isApplicationOngoing ? (
                    <Button
                      id="apply-now-button"
                      variant="contained"
                      size="large"
                      color="secondary"
                      sx={{
                        width: "fit-content",
                        alignSelf: {
                          xs: "center",
                          md: !user ? "start" : "center",
                        },
                        marginTop: "1.5rem",
                      }}
                      onClick={() =>
                        router.push(`${PAGES.SUBMISSIONS}/application`)
                      }
                    >
                      Apply Now
                    </Button>
                  ) : (
                    <></>
                  )}
                </Stack>
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
