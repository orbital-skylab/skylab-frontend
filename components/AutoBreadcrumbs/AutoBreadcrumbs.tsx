import { Breadcrumbs, Link as MuiLink, SxProps } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

const acronyms = ["csv"];

type Props = {
  breadcrumbs?: Breadcrumb[];
  sx?: SxProps;
  replaceLast?: boolean;
};

type Breadcrumb = {
  label: string;
  href: string;
};

const AutoBreadcrumbs: FC<Props> = ({
  breadcrumbs = [],
  sx,
  replaceLast = false,
}) => {
  const router = useRouter();

  const renderBreadcrumbs = () => {
    if (!breadcrumbs.length || replaceLast) {
      const pathSegments = router.asPath.slice(1).split("/");
      let generatedBreadcrumbs = pathSegments.map((pathSegment, idx) => {
        return {
          label: pathSegment
            .split("-")
            .map((chars) => {
              if (acronyms.includes(chars)) {
                return chars.toUpperCase();
              } else {
                return chars.charAt(0).toUpperCase() + chars.slice(1);
              }
            })
            .join(" "),
          href: "/" + pathSegments.slice(0, idx + 1).join("/"),
        };
      });

      if (replaceLast && breadcrumbs.length) {
        generatedBreadcrumbs.splice(generatedBreadcrumbs.length - 1, 1);
        generatedBreadcrumbs = generatedBreadcrumbs.concat(breadcrumbs);
      }

      breadcrumbs = generatedBreadcrumbs;
    }

    return breadcrumbs.map(({ label, href }, idx) => (
      <Link key={href} href={href} passHref>
        <MuiLink
          underline={breadcrumbs.length - 1 === idx ? "none" : "hover"}
          color={breadcrumbs.length - 1 === idx ? "primary" : "inherit"}
        >
          {label}
        </MuiLink>
      </Link>
    ));
  };

  const breadcrumbsSx: SxProps = { mb: "1rem", ...sx };

  return <Breadcrumbs sx={breadcrumbsSx}>{renderBreadcrumbs()}</Breadcrumbs>;
};
export default AutoBreadcrumbs;
