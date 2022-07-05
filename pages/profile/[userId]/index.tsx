import NextLink from "next/link";
import type { NextPage } from "next";
// Components
import Body from "@/components/layout/Body";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import NoneFound from "@/components/emptyStates/NoneFound/NoneFound";
import SpreadAttribute from "@/components/typography/SpreadAttribute";
// Hooks
import useAuth from "@/hooks/useAuth";
import useFetch, { FETCH_STATUS } from "@/hooks/useFetch";
// Helpers
import { PAGES } from "@/helpers/navigation";
import { useRouter } from "next/router";
// Types
import { GetUserResponse } from "@/types/api";

const Profile: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data: userResponse, status } = useFetch<GetUserResponse>({
    endpoint: `/users/${userId}`,
    enabled: !!userId,
  });

  const user = userResponse ? userResponse.user : undefined;

  const isCurrentUser = useAuth()?.user?.email === user?.email;

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
            message="There is no such user with that user ID"
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
              <NextLink href={`${PAGES.PROFILE}/${user?.id}/edit`} passHref>
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
                <Typography fontWeight={600} textAlign="center">
                  {user.name}
                </Typography>
              ) : null}
              {user?.selfIntro ? (
                <Typography variant="body2" marginY="0.5rem" textAlign="center">
                  &quot;{user?.selfIntro}&quot;
                </Typography>
              ) : null}
              {user && (
                <Stack spacing="0.5rem">
                  <SpreadAttribute attribute="User ID" value={user.id} />
                  <SpreadAttribute
                    attribute="Email"
                    value={{ href: `mailto:${user.email}`, label: user.email }}
                  />
                  {user.githubUrl && (
                    <SpreadAttribute
                      attribute="GitHub"
                      value={{ href: user.githubUrl, label: user.githubUrl }}
                    />
                  )}
                  {user.linkedinUrl && (
                    <SpreadAttribute
                      attribute="LinkedIn"
                      value={{
                        href: user.linkedinUrl,
                        label: user.linkedinUrl,
                      }}
                    />
                  )}
                  {user.personalSiteUrl && (
                    <SpreadAttribute
                      attribute="Website"
                      value={{
                        href: user.personalSiteUrl,
                        label: user.personalSiteUrl,
                      }}
                    />
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>
      </NoDataWrapper>
    </Body>
  );
};
export default Profile;
