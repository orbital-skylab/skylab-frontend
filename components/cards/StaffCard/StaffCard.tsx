import { FC, ReactNode } from "react";
// Libraries
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkIcon from "@mui/icons-material/Link";
import { User } from "@/types/users";
import { SQUARE_ASPECT_RATIO } from "@/styles/constants";

type Props = {
  staff: User;
};

const StaffCard: FC<Props> = ({ staff }) => {
  return (
    <Card raised>
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
        <Typography variant="h5" align="center" fontWeight={600}>
          {staff.name}
        </Typography>
      </CardContent>
      <CardActions sx={{ paddingTop: 0 }}>
        <Stack direction="row" sx={{ width: "100%" }} justifyContent="end">
          <SocialButton
            title="Github"
            icon={<GitHubIcon />}
            url={String(staff.githubUrl)}
          />
          <SocialButton
            title="LinkedIn"
            icon={<LinkedInIcon />}
            url={String(staff.linkedinUrl)}
          />
          <SocialButton
            title="Personal Portfolio"
            icon={<LinkIcon />}
            url={String(staff.personalSiteUrl)}
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
};

const SocialButton: FC<SocialButtonProps> = ({ title, icon, url }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Tooltip title={title}>
        <IconButton>{icon}</IconButton>
      </Tooltip>
    </a>
  );
};

export default StaffCard;
