import { useEffect, useMemo, useState } from "react";
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
import useCohort from "@/hooks/useCohort";

export type GetDeadlinesResponse = {
  deadlines: Deadline[];
};

const Deadlines: NextPage = () => {
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);
  const {
    cohorts,
    currentCohortYear,
    isLoading: isLoadingCohorts,
  } = useCohort();
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | null
  >(null);

  /** Fetching staff based on filters */
  const memoQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohortYear,
    };
  }, [selectedCohortYear]);
  const {
    data: response,
    status: fetchDeadlinesStatus,
    mutate,
  } = useFetch<GetDeadlinesResponse>({
    endpoint: `/deadlines`,
    queryParams: memoQueryParams,
  });

  /** Input Change Handlers */
  const handleCohortYearChange = (e: SelectChangeEvent<number | null>) => {
    setSelectedCohortYear(e.target.value as Cohort["academicYear"]);
  };

  const handleOpenAddMilestoneModal = () => {
    setIsAddDeadlineOpen(true);
  };

  useEffect(() => {
    if (currentCohortYear) {
      setSelectedCohortYear(currentCohortYear);
    }
  }, [currentCohortYear]);

  return (
    <>
      <AddDeadlineModal
        open={isAddDeadlineOpen}
        setOpen={setIsAddDeadlineOpen}
        cohortYear={selectedCohortYear as Cohort["academicYear"]}
        mutate={mutate}
      />
      <Body
        isError={isError(fetchDeadlinesStatus)}
        isLoading={isLoadingCohorts}
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
          fullScreen
        >
          <NoDataWrapper
            noDataCondition={Boolean(
              response &&
                (response.deadlines === undefined ||
                  response.deadlines?.length === 0)
            )}
            fallback={<NoneFound message="No deadlines found" />}
          >
            <DeadlineTable
              deadlines={response?.deadlines ?? []}
              mutate={mutate}
            />
          </NoDataWrapper>
        </LoadingWrapper>
      </Body>
    </>
  );
};

export default Deadlines;
