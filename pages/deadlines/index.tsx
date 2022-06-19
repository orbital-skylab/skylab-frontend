import { useMemo, useState } from "react";
import type { NextPage } from "next";
// Libraries
import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
// Components
import Body from "@/components/layout/Body";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import DeadlineTable from "@/components/tables/DeadlineTable";
// Hooks
import useFetch, { isFetching, isError } from "@/hooks/useFetch";
// Types
import { Cohort } from "@/types/cohorts";
import { Deadline } from "@/types/deadlines";
import { Add } from "@mui/icons-material";
import AddDeadlineModal from "@/components/modals/AddDeadlineModal";

const Deadlines: NextPage = () => {
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);

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
  const { data: response, status: fetchDeadlinesStatus } = useFetch<{
    deadlines: Deadline[];
  }>({
    endpoint: `/deadlines`,
    queryParams: memoQueryParams,
  });
  // const deadlines: Deadline[] = [
  //   {
  //     id: 1,
  //     name: "Milestone 1",
  //     cohortYear: 2022,
  //     dueBy: "2022-06-27T15:59:00.000Z",
  //     type: DEADLINE_TYPE.MILESTONE,
  //   },
  //   {
  //     id: 2,
  //     name: "Milestone 2",
  //     cohortYear: 2022,
  //     dueBy: "2022-07-27T15:59:00.000Z",
  //     type: DEADLINE_TYPE.MILESTONE,
  //   },
  // ];
  // const fetchDeadlinesStatus = FETCH_STATUS.FETCHED;

  /** Input Change Handlers */
  const handleCohortYearChange = (e: SelectChangeEvent<number | null>) => {
    setSelectedCohortYear(e.target.value as Cohort["academicYear"]);
  };

  const handleOpenAddMilestoneModal = () => {
    setIsAddDeadlineOpen(true);
  };

  return (
    <>
      <AddDeadlineModal
        open={isAddDeadlineOpen}
        setOpen={setIsAddDeadlineOpen}
        cohortYear={selectedCohortYear as Cohort["academicYear"]}
      />
      <Body
        isError={isError(fetchDeadlinesStatus, fetchCohortsStatus)}
        isLoading={isFetching(fetchCohortsStatus)}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          width="100%"
          mt="0.5rem"
          mb="1rem"
        >
          <Button
            variant="contained"
            size="small"
            onClick={handleOpenAddMilestoneModal}
          >
            <Add fontSize="small" sx={{ marginRight: "0.2rem" }} />
            Deadline
          </Button>
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
          isLoading={isFetching(fetchDeadlinesStatus)}
          loadingText="Loading deadlines..."
        >
          <NoDataWrapper
            noDataCondition={Boolean(
              response &&
                (response.deadlines === undefined ||
                  response.deadlines?.length === 0)
            )}
            fallback={<NoneFound message="No deadlines found" />}
          >
            <DeadlineTable deadlines={response?.deadlines ?? []} />
          </NoDataWrapper>
        </LoadingWrapper>
      </Body>
    </>
  );
};

export default Deadlines;
