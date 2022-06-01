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
      <Image src={image} alt={name} layout="responsive" width={1} height={1} />
    </Stack>
  );
};
export default StaffCard;
