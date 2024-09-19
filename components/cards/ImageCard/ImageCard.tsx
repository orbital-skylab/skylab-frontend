import { noImageAvailableSrc } from "@/helpers/errors";
import { A4_ASPECT_RATIO, BASE_TRANSITION } from "@/styles/constants";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import React, { FC } from "react";

type Props = {
  id: string;
  idDisplay: string;
  title: string;
  imageSrc?: string;
  actionButton?: React.ReactNode;
  extraContent?: React.ReactNode;
  onCardClick?: () => void;
  cardClasses?: string;
  imgAlt?: string;
};

const ImageCard: FC<Props> = ({
  id,
  idDisplay,
  title,
  imageSrc,
  actionButton,
  extraContent,
  onCardClick,
  cardClasses,
  imgAlt,
}) => {
  return (
    <Card
      id={id}
      className={cardClasses}
      sx={{
        height: "100%",
        transition: BASE_TRANSITION,
        position: "relative",
        "&:hover": {
          transform: "scale(102%)",
        },
      }}
      onClick={onCardClick}
    >
      <Typography
        sx={{
          position: "absolute",
          top: "0",
          left: "0",
          padding: "2px 6px",
          borderRadius: "0 0 4px 0",
          backgroundColor: "primary.main",
          color: "white",
        }}
        fontWeight={600}
      >
        {idDisplay}
      </Typography>
      <CardContent
        sx={{
          height: "100%",
        }}
      >
        <Stack sx={{ height: "100%", gap: "0.5rem" }}>
          <Typography
            align="center"
            fontWeight={600}
            sx={{
              paddingX: "1.5rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
              transition: BASE_TRANSITION,
              "&:hover": {
                textDecoration: "underline",
                color: "secondary.main",
              },
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              width: "100%",
              aspectRatio: A4_ASPECT_RATIO,
              display: "flex",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: "0.5rem",
            }}
          >
            <Box
              component="img"
              src={imageSrc ?? noImageAvailableSrc}
              alt={imgAlt}
              sx={{
                width: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
          {extraContent}
          <Stack
            direction={{ xs: "column-reverse", md: "row" }}
            gap="0.5rem"
            sx={{ marginTop: "auto" }}
          >
            {actionButton}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
