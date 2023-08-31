import { ChangeEvent, useEffect, useState } from "react";
import type { NextPage } from "next";
// Libraries
import { Button, MenuItem, Stack, TextField } from "@mui/material";
// Components
import Body from "@/components/layout/Body";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
// Types
import { Cohort } from "@/types/cohorts";
import { Add } from "@mui/icons-material";
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
import { GetAnnouncementsResponse } from "@/types/api";
import useCohort from "@/contexts/useCohort";
import { useRouter } from "next/router";
import { PAGES } from "@/helpers/navigation";

const Announcements: NextPage = () => {
  const router = useRouter();
  const { cohorts, currentCohortYear } = useCohort();
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | ""
  >("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: announcementsResponse, status: fetchAnnouncementsStatus } =
    useFetch<GetAnnouncementsResponse>({
      endpoint: `/announcements?cohortYear=${currentCohortYear}`,
    });

  const handleCohortYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCohortYear(Number(e.target.value) as Cohort["academicYear"]);
  };

  useEffect(() => {
    if (currentCohortYear) {
      setSelectedCohortYear(currentCohortYear);
    }
  }, [currentCohortYear]);

  return (
    <>
      <Body>
        <AutoBreadcrumbs />
        <Stack
          direction="row"
          justifyContent="start"
          sx={{
            gap: "0.5rem",
            marginBottom: { md: "0.5rem" },
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              //TODO:
              router.push(PAGES.MANAGE_ANNOUNCEMENTS_ADD);
            }}
          >
            <Add fontSize="small" sx={{ marginRight: "0.2rem" }} />
            Announcement
          </Button>
          <Stack direction="row" spacing="1rem" marginLeft="auto">
            <TextField
              label="Cohort"
              value={selectedCohortYear}
              onChange={handleCohortYearChange}
              select
              size="small"
            >
              {cohorts &&
                cohorts.map(({ academicYear }) => (
                  <MenuItem key={academicYear} value={academicYear}>
                    {academicYear}
                  </MenuItem>
                ))}
            </TextField>
          </Stack>
        </Stack>
        <LoadingWrapper
          isLoading={isFetching(fetchAnnouncementsStatus)}
          loadingText="Loading announcements..."
          fullScreen
        >
          {/* <NoDataWrapper
            noDataCondition={Boolean(
              cohortsResponse &&
                (cohortsResponse.cohorts === undefined ||
                  cohortsResponse.cohorts.length === 0)
            )}
            fallback={<NoneFound message="No cohorts found" />}
          >
            <CohortTable
              cohorts={cohortsResponse?.cohorts ?? []}
              mutate={mutate}
            />
          </NoDataWrapper> */}
        </LoadingWrapper>
      </Body>
    </>
  );
};

export default Announcements;
