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
import CustomHead from "@/components/CustomHead";
// Hooks
import useAuth from "@/hooks/useAuth";
import useFetch, { FETCH_STATUS } from "@/hooks/useFetch";
// Helpers
import { PAGES } from "@/helpers/navigation";
import { useRouter } from "next/router";
// Types
import { GetUserResponse } from "@/types/api";
import GoBackButton from "@/components/buttons/GoBackButton";

const Profile: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data: userResponse, status } = useFetch<GetUserResponse>({
    endpoint: `/users/${userId}`,
    enabled: !!userId,
  });

  const user = userResponse ? userResponse.user : undefined;

  const isCurrentUser = useAuth()?.user?.id === user?.id;

  return (
    <>
      <CustomHead
        title={`User Profile ${
          userResponse ? `(${userResponse.user.name})` : ""
        }`}
        description="View user profiles!"
      />
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
          <GoBackButton />
          <Stack direction="column" alignItems="center">
            <Avatar
              id="profile-picture-div"
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
                <NextLink href={`${PAGES.USERS}/${user?.id}/edit`} passHref>
                  <Button
                    id="edit-profile-button"
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
                    id="profile-name-span"
                    fontWeight={600}
                    textAlign="center"
                  >
                    {user.name}
                  </Typography>
                ) : null}
                {user?.selfIntro ? (
                  <Typography
                    id="profile-self-intro-span"
                    variant="body2"
                    marginY="0.5rem"
                    textAlign="center"
                  >
                    &quot;{user?.selfIntro}&quot;
                  </Typography>
                ) : null}
                {user && (
                  <Stack spacing="0.5rem">
                    <SpreadAttribute attribute="User ID" value={user.id} />
                    <SpreadAttribute
                      attribute="Email"
                      value={{
                        href: `mailto:${user.email}`,
                        label: user.email,
                      }}
                    />
                    {user.githubUrl && (
                      <SpreadAttribute
                        id="profile-github-link"
                        attribute="GitHub"
                        value={{ href: user.githubUrl, label: user.githubUrl }}
                      />
                    )}
                    {user.linkedinUrl && (
                      <SpreadAttribute
                        id="profile-linkedin-link"
                        attribute="LinkedIn"
                        value={{
                          href: user.linkedinUrl,
                          label: user.linkedinUrl,
                        }}
                      />
                    )}
                    {user.personalSiteUrl && (
                      <SpreadAttribute
                        id="profile-personal-site-link"
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
    </>
  );
};
export default Profile;
