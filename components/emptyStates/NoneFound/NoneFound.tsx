import { PAGES } from "@/helpers/navigation";
import { FULL_HEIGHT_MINUS_NAV } from "@/styles/constants";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { FC } from "react";

type Props = {
  title?: string;
  message: string;
  showReturnHome?: boolean;
  actionPrompt?: React.ReactNode;
};

const NoneFound: FC<Props> = ({
  title = "Oops!",
  message,
  showReturnHome = false,
  actionPrompt,
}) => {
  return (
    <>
      <Box
        sx={{
          height: FULL_HEIGHT_MINUS_NAV,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="subtitle1">{message}</Typography>
        {showReturnHome ? (
          <Link href={PAGES.LANDING} passHref>
            <Button variant="contained">Return Home</Button>
          </Link>
        ) : null}
        {actionPrompt}
      </Box>
    </>
  );
};
export default NoneFound;
