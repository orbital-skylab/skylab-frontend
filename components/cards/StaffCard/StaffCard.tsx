import { FC, ReactNode } from "react";
// Components
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Link,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkIcon from "@mui/icons-material/Link";
import PersonIcon from "@mui/icons-material/Person";
// Types
import { Adviser } from "@/types/advisers";
import { Mentor } from "@/types/mentors";
// Constants
import { BASE_TRANSITION, SQUARE_ASPECT_RATIO } from "@/styles/constants";
import { PAGES } from "@/helpers/navigation";

type Props = {
  staff: Adviser | Mentor;
};

const StaffCard: FC<Props> = ({ staff }) => {
  return (
    <Card
      className={`staff-card ${staff.cohortYear} ${
        (staff as Adviser).adviserId ? "adviser" : "mentor"
      }`}
      raised
      sx={{
        transition: BASE_TRANSITION,
        "&:hover": {
          transform: "scale(102%)",
        },
      }}
    >
      <CardMedia
        component="img"
        image={staff.profilePicUrl}
        alt={staff.name}
        sx={{
          objectFit: "cover",
          aspectRatio: SQUARE_ASPECT_RATIO,
          borderRadius: "4px",
        }}
      />
      <CardContent>
        <Typography id="staff-name-span" align="center" fontWeight={600}>
          {staff.name}
        </Typography>
      </CardContent>
      <CardActions sx={{ paddingTop: 0 }}>
        <Stack direction="row" sx={{ width: "100%" }} justifyContent="end">
          <SocialButton
            title="View Profile"
            icon={<PersonIcon />}
            url={`${PAGES.USERS}/${staff.id}`}
            sx={{ marginRight: "auto" }}
          />
          <SocialButton
            title="Github"
            icon={<GitHubIcon />}
            url={String(staff.githubUrl)}
            isDisabled={!staff.githubUrl}
          />
          <SocialButton
            title="LinkedIn"
            icon={<LinkedInIcon />}
            url={String(staff.linkedinUrl)}
            isDisabled={!staff.linkedinUrl}
          />
          <SocialButton
            title="Personal Portfolio"
            icon={<LinkIcon />}
            url={String(staff.personalSiteUrl)}
            isDisabled={!staff.personalSiteUrl}
          />
        </Stack>
      </CardActions>
    </Card>
  );
};

type SocialButtonProps = {
  title: string;
  icon: ReactNode;
  url: string;
  isDisabled?: boolean;
  sx?: SxProps;
};

const SocialButton: FC<SocialButtonProps> = ({
  title,
  icon,
  url,
  isDisabled,
  sx,
}) => {
  const renderButton = () => {
    return (
      <Tooltip title={title}>
        <IconButton disabled={isDisabled}>{icon}</IconButton>
      </Tooltip>
    );
  };

  if (isDisabled) {
    return renderButton();
  }

  return (
    <Link sx={sx} href={url} target="_blank" rel="noopener noreferrer">
      {renderButton()}
    </Link>
  );
};

export default StaffCard;
