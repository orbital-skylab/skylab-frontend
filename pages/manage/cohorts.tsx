import { useState } from "react";
import type { NextPage } from "next";
// Libraries
import { Button, Stack } from "@mui/material";
// Components
import Body from "@/components/layout/Body";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import CohortTable from "@/components/tables/CohortTable";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
// Types
import { GetCohortsResponse } from "@/types/cohorts";
import { Add } from "@mui/icons-material";
import AddCohortModal from "@/components/modals/AddCohortModal";
import AutoBreadcrumbs from "@/components/AutoBreadcrumbs";

const Cohorts: NextPage = () => {
  const [isAddCohortOpen, setIsAddCohortOpen] = useState(false);

  const {
    data: cohortsResponse,
    status: fetchCohortsStatus,
    mutate,
  } = useFetch<GetCohortsResponse>({
    endpoint: "/cohorts",
  });

  /** Input Change Handlers */
  const handleOpenAddCohortModal = () => {
    setIsAddCohortOpen(true);
  };

  return (
    <>
      <AddCohortModal
        open={isAddCohortOpen}
        setOpen={setIsAddCohortOpen}
        mutate={mutate}
      />
      <Body>
        <AutoBreadcrumbs sx={{ mb: "0" }} />
        <Stack direction="row" justifyContent="end" width="100%">
          <Button variant="outlined" onClick={handleOpenAddCohortModal}>
            <Add fontSize="small" sx={{ marginRight: "0.2rem" }} />
            Cohort
          </Button>
        </Stack>
        <LoadingWrapper
          isLoading={isFetching(fetchCohortsStatus)}
          loadingText="Loading cohorts..."
          fullScreen
        >
          <NoDataWrapper
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
          </NoDataWrapper>
        </LoadingWrapper>
      </Body>
    </>
  );
};

export default Cohorts;
