/* eslint-disable react/prop-types */
import { GetStaticProps } from "next";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { fetchPublicProjectCohorts } from "@/lib/api/projectsApi";

type Props = {
  latestCohortYear: number | null;
};

/**
 * Public gallery index page
 * This page routes to the newest cohort's Artemis page on the client.
 */
const PublicGalleryIndex: NextPage<Props> = ({ latestCohortYear }) => {
  const router = useRouter();

  useEffect(() => {
    if (latestCohortYear) {
      router.replace(`/public-gallery/${latestCohortYear}/artemis/page/1/`);
    }
  }, [latestCohortYear, router]);

  return null;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const cohortYears = await fetchPublicProjectCohorts();
  const latestCohortYear = cohortYears[0];

  return {
    props: {
      latestCohortYear: latestCohortYear || null,
    },
  };
};

export default PublicGalleryIndex;
