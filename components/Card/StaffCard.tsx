import { FC } from "react";
import Image, { StaticImageData } from "next/image";
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
        <Image src={image} alt={name} />
      </div>
    </Stack>
  );
};
export default StaffCard;
