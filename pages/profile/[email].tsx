import NextLink from "next/link";
import type { NextPage } from "next";
// Components
import Body from "@/components/layout/Body";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import NoneFound from "@/components/emptyStates/NoneFound/NoneFound";
// Hooks
import useAuth from "@/hooks/useAuth";
import useFetch, { FETCH_STATUS } from "@/hooks/useFetch";
// Helpers
import { PAGES } from "@/helpers/navigation";
import { useRouter } from "next/router";
import { isNotUndefined } from "@/helpers/types";
// Types
import { GetUserResponse, User } from "@/types/users";

const Profile: NextPage = () => {
  const router = useRouter();
  const { email } = router.query;

  const { data: userResponse, status } = useFetch<GetUserResponse>({
    endpoint: `/users/${email}`,
  });

  const user = isNotUndefined(userResponse) ? userResponse.user : ({} as User);

  const isCurrentUser = useAuth()?.user?.email === user?.email;

  const attributes = [
    {
      label: "Email",
      value: user?.email,
    },
    { label: "GitHub", value: user?.githubUrl },
    { label: "LinkedIn", value: user?.linkedinUrl },
    { label: "Website", value: user?.personalSiteUrl },
  ];

  return (
    <Body
      isLoading={status === FETCH_STATUS.FETCHING}
      loadingText="Loading user..."
    >
      <NoDataWrapper
        noDataCondition={user === undefined}
        fallback={
          <NoneFound
            showReturnHome
            message="There is no such user with that email"
          />
        }
      >
        <Stack direction="column" alignItems="center">
          <Avatar
            variant="circular"
            src={user?.profilePicUrl}
            alt={`${user?.name}`}
            sx={{
              width: "50vw",
              height: "50vw",
              maxWidth: "240px",
              maxHeight: "240px",
              zIndex: "1",
            }}
          />
          <Card
            sx={{
              maxWidth: "sm",
              width: "100%",
              position: "relative",
              top: "-100px",
            }}
            raised
          >
            {isCurrentUser ? (
              <NextLink href={PAGES.EDIT_PROFILE} passHref>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    textTransform: "none",
                    padding: "0.25rem 1rem",
                    minWidth: "0",
                  }}
                >
                  Edit
                </Button>
              </NextLink>
            ) : null}
            <CardContent
              sx={{
                marginTop: "100px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {user?.name ? (
                <Typography
                  variant="h1"
                  sx={{ fontSize: { xs: "1rem", md: "2rem" } }}
                  fontWeight={600}
                  textAlign="center"
                >
                  {user.name}
                </Typography>
              ) : null}
              {user?.selfIntro ? (
                <Typography variant="body2" marginY="1rem" textAlign="center">
                  &quot;{user?.selfIntro}&quot;
                </Typography>
              ) : null}
              <Stack direction="column" spacing="0.5rem">
                {attributes.map(({ label, value }) => {
                  if (!value) {
                    return null;
                  }

                  return (
                    <Box
                      key={label}
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: "2rem",
                      }}
                    >
                      <Typography
                        fontWeight={600}
                        fontSize={{ xs: "1rem", md: "1.2rem" }}
                      >
                        {label}
                      </Typography>
                      <Link
                        href={value}
                        variant="body1"
                        underline="hover"
                        target="_blank"
                        rel="noreferrer"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                        overflow="hidden"
                      >
                        {value}
                      </Link>
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </NoDataWrapper>
    </Body>
  );
};
export default Profile;
