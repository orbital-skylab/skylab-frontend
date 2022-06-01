import { FC } from "react";
import Image, { StaticImageData } from "next/image";
// Libraries
import { Button, Stack, Typography } from "@mui/material";

type Props = {
  teamId: number;
  teamName: string;
  image: StaticImageData;
  students: string;
  advisor: string;
  mentor?: string;
};

const ProjectCard: FC<Props> = ({
  teamId,
  teamName,
  image,
  students,
  advisor,
  mentor,
}) => {
  return (
    <Stack>
      <Typography variant="h6" align="center">
        Team {teamId}: {teamName}
      </Typography>
      <Image
        src={image}
        alt={`${teamName}'s Project`}
        layout="responsive"
        width={1}
        height={1}
      />
      <Stack direction="row">
        <CardAction>Poster</CardAction>
        <CardAction>Video</CardAction>
      </Stack>
      <Stack pl={2}>
        <NameList label="Students" names={students} />
        <NameList label="Advisors" names={advisor} />
        {mentor ? <NameList label="Mentors" names={mentor} /> : null}
      </Stack>
    </Stack>
  );
};

const CardAction: FC = ({ children }) => {
  return (
    <Button
      sx={{
        width: "50%",
        "&.MuiButtonBase-root:hover": {
          bgcolor: "transparent",
        },
      }}
    >
      {children}
    </Button>
  );
};

type NameListProps = {
  label: string;
  names: string;
};

export const NameList: FC<NameListProps> = ({ label, names }) => {
  return (
    <Typography variant="subtitle1" gutterBottom>
      <span style={{ fontWeight: "bold" }}>{label}:</span> {names}
    </Typography>
  );
};

export default ProjectCard;
