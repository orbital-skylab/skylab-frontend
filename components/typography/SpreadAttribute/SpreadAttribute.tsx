import { isArray } from "@/helpers/types";
import { Box, Link, Typography } from "@mui/material";
import { FC } from "react";

type Props = {
  attribute: string;
  value:
    | string
    | number
    | { href: string; label: string }
    | string[]
    | number[]
    | { href: string; label: string }[];
};

/**
 * Renders an attribute and its value with the space in between spread out (justify-content: space-between)
 * The value accepts string(s) and href with label(s). When a href is provided, the value is rendered as as Link
 */
const SpreadAttribute: FC<Props> = ({ attribute, value }) => {
  if (!attribute || !value) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: "2rem",
      }}
    >
      <Typography fontWeight={600}>{attribute}:</Typography>

      {!isArray(value) ? (
        typeof value === "string" || typeof value === "number" ? (
          /* Single string value */
          <Typography
            variant="body1"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            {value}
          </Typography>
        ) : (
          /* Single link value */
          <Link
            href={value.href}
            variant="body1"
            underline="hover"
            target="_blank"
            rel="noreferrer"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            {value.label}
          </Link>
        )
      ) : value.length ? (
        typeof value[0] === "string" || typeof value[0] === "number" ? (
          /* Multiple string values */
          <Box sx={{ display: "flex", gap: "1rem" }}>
            {(value as string[]).map((val) => (
              <Typography
                key={val}
                variant="body1"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                {val}
              </Typography>
            ))}
          </Box>
        ) : (
          /* Multiple link values */
          <Box sx={{ display: "flex", gap: "1rem" }}>
            {(value as { href: string; label: string }[]).map(
              ({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  variant="body1"
                  underline="hover"
                  target="_blank"
                  rel="noreferrer"
                >
                  {label}
                </Link>
              )
            )}
          </Box>
        )
      ) : null}
    </Box>
  );
};
export default SpreadAttribute;
