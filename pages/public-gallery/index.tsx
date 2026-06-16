/* eslint-disable react/prop-types */
import { GetStaticProps } from "next";
import type { NextPage } from "next";
import { Box, Container, Typography } from "@mui/material";
import CustomHead from "@/components/layout/CustomHead";
import PublicGalleryPage from "@/components/publicGallery/PublicGalleryPage";
import { PublicGalleryPageProps } from "@/helpers/publicGallery";
import { fetchPublicProjectCohorts } from "@/lib/api/projectsApi";
import { isPublicGallerySsgOffline } from "@/ssg/config/ssg";
import { buildPublicGalleryPageProps } from "@/ssg/publicGallery";
import { NAVBAR_HEIGHT_REM } from "@/styles/constants";

type Props = {
  galleryProps: PublicGalleryPageProps | null;
};

/**
 * Public gallery index page
 * This page statically renders the newest cohort's Artemis page.
 */
const PublicGalleryIndex: NextPage<Props> = ({ galleryProps }) => {
  if (galleryProps) {
    return <PublicGalleryPage {...galleryProps} />;
  }

  return (
    <>
      <CustomHead title="Public Project Gallery" />
      <Container
        maxWidth="xl"
        sx={{ pt: `calc(${NAVBAR_HEIGHT_REM} + 2rem)`, pb: 4 }}
      >
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Public Project Gallery
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No public projects found
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  if (isPublicGallerySsgOffline()) {
    return {
      props: {
        galleryProps: null,
      },
    };
  }

  const cohortYears = await fetchPublicProjectCohorts();
  const latestCohortYear = cohortYears[0];

  if (!latestCohortYear) {
    return {
      props: {
        galleryProps: null,
      },
    };
  }

  const result = await buildPublicGalleryPageProps({
    cohortYear: latestCohortYear,
    level: "artemis",
    page: 1,
    cohortYears,
  });

  return {
    props: {
      galleryProps: "props" in result ? result.props : null,
    },
  };
};

export default PublicGalleryIndex;
