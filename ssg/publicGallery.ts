import { GetStaticPropsResult } from "next";
import { PublicGalleryPageProps, slugToLevel } from "@/helpers/publicGallery";
import { PAGE_SIZE, PUBLIC_GALLERY_BUILD_PAGE_SIZE } from "@/ssg/config/ssg";
import {
  fetchPublicProjectCohorts,
  fetchPublicProjects,
  fetchPublicProjectsCount,
} from "@/lib/api/projectsApi";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";

type BuildPublicGalleryPagePropsParams = {
  cohortYear: number;
  level: string;
  page: number;
  cohortYears?: number[];
};

export const getPublicGalleryStaticPaths = async () => {
  const cohortYears = await fetchPublicProjectCohorts();
  const levels = Object.values(LEVELS_OF_ACHIEVEMENT).map((l) =>
    l.toLowerCase()
  );
  const paths: {
    params: { cohortYear: string; level: string; page: string };
  }[] = [];

  for (const cohortYear of cohortYears) {
    for (const level of levels) {
      const countData = await fetchPublicProjectsCount(
        PAGE_SIZE,
        level,
        cohortYear
      );
      const totalPages = Math.max(countData.totalPages || 1, 1);

      for (let p = 1; p <= totalPages; p++) {
        paths.push({
          params: { cohortYear: String(cohortYear), level, page: String(p) },
        });
      }
    }
  }

  return paths;
};

export const buildPublicGalleryPageProps = async ({
  cohortYear,
  level,
  page,
  cohortYears,
}: BuildPublicGalleryPagePropsParams): Promise<
  GetStaticPropsResult<PublicGalleryPageProps>
> => {
  const achievementLevel = slugToLevel(level);

  if (!Number.isFinite(cohortYear) || cohortYear <= 0 || page <= 0) {
    return { notFound: true };
  }

  const [firstPageData, resolvedCohortYears] = await Promise.all([
    fetchPublicProjects(
      1,
      PUBLIC_GALLERY_BUILD_PAGE_SIZE,
      achievementLevel,
      cohortYear
    ),
    cohortYears ? Promise.resolve(cohortYears) : fetchPublicProjectCohorts(),
  ]);

  const displayTotalPages =
    firstPageData.total > 0 ? Math.ceil(firstPageData.total / PAGE_SIZE) : 0;

  if (
    (displayTotalPages === 0 && page > 1) ||
    (displayTotalPages > 0 && page > displayTotalPages)
  ) {
    return { notFound: true };
  }

  let allProjects = [...firstPageData.projects];

  for (let p = 2; p <= firstPageData.totalPages; p++) {
    const pageData = await fetchPublicProjects(
      p,
      PUBLIC_GALLERY_BUILD_PAGE_SIZE,
      achievementLevel,
      cohortYear
    );
    allProjects = allProjects.concat(pageData.projects);
  }

  return {
    props: {
      projects: allProjects,
      currentPage: page,
      totalPages: displayTotalPages || 1,
      total: firstPageData.total || 0,
      level,
      cohortYear,
      cohortYears: resolvedCohortYears,
    },
  };
};
