import { useMemo, useState } from "react";
import type { NextPage } from "next";
// Libraries
import { MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
// Components
import Body from "@/components/layout/Body";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
// Hooks
import useFetch, { isFetching, isError } from "@/hooks/useFetch";
// Types
import { Cohort } from "@/types/cohorts";
import { Milestone } from "@/types/milestones";
import MilestoneCard from "@/components/cards/MilestoneCard";

const Milestones: NextPage = () => {
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | null
  >(null);

  /** Fetching cohorts and setting latest cohort */
  const { data: cohorts, status: fetchCohortsStatus } = useFetch<Cohort[]>({
    endpoint: "/cohorts",
    onFetch: (cohorts) =>
      setSelectedCohortYear(cohorts.length ? cohorts[0].academicYear : null),
  });

  /** Fetching staff based on filters */
  const memoQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohortYear,
    };
  }, [selectedCohortYear]);
  const { data: milestones, status: fetchMilestonesStatus } = useFetch<
    Milestone[]
  >({
    endpoint: `/milestones`,
    queryParams: memoQueryParams,
  });

  /** Input Change Handlers */
  const handleCohortYearChange = (e: SelectChangeEvent<number | null>) => {
    setSelectedCohortYear(e.target.value as Cohort["academicYear"]);
  };

  return (
    <>
      <Body
        isError={isError(fetchMilestonesStatus, fetchCohortsStatus)}
        isLoading={isFetching(fetchCohortsStatus)}
      >
        <Stack
          direction="row"
          justifyContent="end"
          width="100%"
          mt="0.5rem"
          mb="1rem"
        >
          <Select
            name="cohort"
            label="Cohort"
            value={selectedCohortYear}
            onChange={handleCohortYearChange}
            size="small"
          >
            {cohorts &&
              cohorts.map(({ academicYear }) => (
                <MenuItem key={academicYear} value={academicYear}>
                  {academicYear}
                </MenuItem>
              ))}
          </Select>
        </Stack>
        <LoadingWrapper
          isLoading={isFetching(fetchMilestonesStatus)}
          loadingText="Loading milestones..."
        >
          <NoDataWrapper
            noDataCondition={
              milestones === undefined || milestones?.length === 0
            }
            fallback={<NoneFound message="No milestones found" />}
          >
            <Stack spacing="0.5rem">
              {milestones
                ? milestones.map((milestone) => {
                    return (
                      <MilestoneCard
                        milestone={milestone}
                        key={milestone.name + milestone.cohort.academicYear}
                      />
                    );
                  })
                : null}
            </Stack>
          </NoDataWrapper>
        </LoadingWrapper>
      </Body>
    </>
  );
};

export default Milestones;
