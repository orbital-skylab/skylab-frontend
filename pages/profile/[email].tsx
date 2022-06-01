import Body from "@/components/Body";
import useFetch, { FETCH_STATUS } from "@/hooks/useFetch";
import { User } from "@/types/users";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const Profile: NextPage = () => {
  const router = useRouter();
  const { email } = router.query;

  const { data: user, status } = useFetch<User>({
    endpoint: `/users/${email}`,
  });

  // const dummyUser: User = {
  //   id: 1,
  //   name: "Loh Jia Ming, Rayner",
  //   email: "raynerljm@gmail.com",
  //   profilePicUrl: "https://avatars.githubusercontent.com/u/63008910?v=4",
  //   githubUrl: "https://github.com/raynerljm",
  //   linkedinUrl: "https://www.linkedin.com/in/rayner-loh-0a498a166/",
  //   personalSiteUrl: "https://www.raynerljm.me/",
  //   selfIntro:
  //     "Hey! My name is Rayner, and I love building software that makes a positive difference.",
  //   cohortId: 1,
  // };

  const attributes = [
    {
      label: "Email",
      value: email as string,
    },
    { label: "GitHub", value: user?.githubUrl },
    { label: "LinkedIn", value: user?.linkedinUrl },
    { label: "Website", value: user?.personalSiteUrl },
  ];

  return (
    <Body isLoading={status === FETCH_STATUS.FETCHING}>
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
          <CardContent
            sx={{
              marginTop: "100px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: "1rem", md: "2rem" } }}
              fontWeight={600}
              textAlign="center"
            >
              {user?.name}
            </Typography>
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
    </Body>
  );
};
export default Profile;
