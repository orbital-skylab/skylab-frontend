/* eslint-disable react/prop-types */
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import PublicGalleryPage from "@/components/publicGallery/PublicGalleryPage";
import { PublicGalleryPageProps } from "@/helpers/publicGallery";
import {
  buildPublicGalleryPageProps,
  getPublicGalleryStaticPaths,
} from "@/ssg/publicGallery";

const PublicGalleryCohortLevelPage: NextPage<PublicGalleryPageProps> = (
  props
) => {
  return <PublicGalleryPage {...props} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getPublicGalleryStaticPaths();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PublicGalleryPageProps> = async ({
  params,
}) => {
  const level = (params?.level as string) || "artemis";
  const page = parseInt(params?.page as string) || 1;
  const cohortYear = Number(params?.cohortYear);

  return buildPublicGalleryPageProps({ cohortYear, level, page });
};

export default PublicGalleryCohortLevelPage;
