import { FC } from "react";
import { StaticImageData } from "next/image";
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
    <Stack style={{ margin: "auto" }}>
      <Typography variant="h6" align="center">
        {`Team ${teamId}: ${teamName}`}
      </Typography>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={image.src}
          alt={`${teamName}s Project`}
          height={345}
          width={345}
        />
      </div>
      <Stack direction="row" justifyContent="center">
        <CardAction>Poster</CardAction>
        <CardAction>Video</CardAction>
      </Stack>
      <Stack pl={2} mt={2} alignItems="center">
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
        marginX: 2,
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
