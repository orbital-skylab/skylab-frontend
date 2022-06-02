import { FC } from "react";
import { StaticImageData } from "next/image";
// Libraries
import { Stack, Typography } from "@mui/material";

type Props = {
  name: string;
  image: StaticImageData;
};

const StaffCard: FC<Props> = ({ name, image }) => {
  return (
    <Stack>
      <Typography variant="h6" align="center">
        {name}
      </Typography>
      <div
        style={{
          width: "full",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img src={image.src} alt={name} height={345} width={345} />
      </div>
    </Stack>
  );
};
export default StaffCard;
