import { noImageAvailableSrc } from "@/helpers/errors";
import { getThumbnailUrl } from "@/helpers/images";
import { A4_ASPECT_RATIO, BASE_TRANSITION } from "@/styles/constants";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React, { FC } from "react";

type Props = {
  id: string;
  idDisplay: string;
  title: string;
  titleHref: string;
  imageSrc?: string;
  actionButton?: React.ReactNode;
  extraContent?: React.ReactNode;
  onCardClick?: () => void;
  cardClasses?: string;
  imgAlt?: string;
  hoverEffect?: boolean;
  priority?: boolean;
};

const ImageCard: FC<Props> = ({
  id,
  idDisplay,
  title,
  titleHref,
  imageSrc,
  actionButton,
  extraContent,
  onCardClick,
  cardClasses,
  imgAlt,
  hoverEffect = true,
  priority = false,
}) => {
  const thumbnailUrl = getThumbnailUrl(imageSrc, 500, 20);

  return (
    <Card
      id={id}
      className={cardClasses}
      sx={{
        height: "100%",
        transition: BASE_TRANSITION,
        position: "relative",
        "&:hover": hoverEffect
          ? {
              transform: "scale(102%)",
            }
          : {},
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
          <Link href={titleHref} passHref>
            <Typography
              align="center"
              fontWeight={600}
              sx={{
                paddingX: "1.5rem",
                whiteSpace: "normal", // Allow text to wrap
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
                transition: BASE_TRANSITION,
                "&:hover": {
                  textDecoration: "underline",
                  color: "secondary.main",
                },
                // Responsive font size
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
              }}
            >
              {title}
            </Typography>
          </Link>
          <div
            title="Click to view full image in new tab"
            style={{
              width: "100%",
              aspectRatio: A4_ASPECT_RATIO,
              display: "flex",
              justifyContent: "center",
              alignSelf: "center",
              overflow: "hidden",
              borderRadius: "0.5rem",
              marginTop: "auto",
              backgroundColor: "black",
            }}
            onClick={() => {
              window.open(imageSrc ?? noImageAvailableSrc, "_blank");
            }}
          >
            <img
              src={thumbnailUrl ?? noImageAvailableSrc}
              alt={imgAlt}
              loading={priority ? "eager" : "lazy"}
              {...{ fetchpriority: priority ? "high" : "low" }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
          {extraContent}
          <Stack direction={{ xs: "column-reverse", md: "row" }} gap="0.5rem">
            {actionButton}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
