import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { NextPage } from "next";
// Libraries
import {
  Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  tabsClasses,
  TextField,
} from "@mui/material";
// Components
import Body from "@/components/layout/Body";
import StaffCard from "@/components/cards/StaffCard";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import CustomHead from "@/components/layout/CustomHead";
// Hooks
import useFetch, { isFetching, isError } from "@/hooks/useFetch";
import useCohort from "@/contexts/useCohort";
// Types
import { STAFF_TYPES, STAFF_VALUES } from "@/types/staff";
import { Cohort } from "@/types/cohorts";
import {
  GetAdvisersResponse,
  GetMentorsResponse,
  GetStaffsResponse,
} from "@/types/api";

const Staff: NextPage = () => {
  const [selectedType, setSelectedType] = useState<STAFF_TYPES>(
    STAFF_VALUES[0]
  );
  const {
    currentCohortYear,
    cohorts,
    isLoading: isLoadingCohorts,
  } = useCohort();
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | string
  >("");

  /** Fetching staff based on filters */
  const memoQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohortYear,
    };
  }, [selectedCohortYear]);
  const { data: staff, status: fetchStaffStatus } = useFetch<GetStaffsResponse>(
    {
      endpoint: `/${selectedType.toLowerCase()}`,
      queryParams: memoQueryParams,
    }
  );

  const unwrapStaff = (staff: GetStaffsResponse, selectedType: STAFF_TYPES) => {
    switch (selectedType) {
      case STAFF_TYPES.ADVISERS:
        staff = staff as GetAdvisersResponse;
        if (!staff.advisers) {
          return [];
        }
        return staff.advisers;
      case STAFF_TYPES.MENTORS:
        staff = staff as GetMentorsResponse;
        if (!staff.mentors) {
          return [];
        }
        return staff.mentors;
    }
  };

  /** Input Change Handlers */
  const handleTabChange = (event: SyntheticEvent, newType: STAFF_TYPES) => {
    setSelectedType(newType);
  };

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
      <CustomHead
        title="Staff Gallery"
        description="View the mentors, advisers and facilitators of NUS Orbital!"
      />
      <Body isError={isError(fetchStaffStatus)} isLoading={isLoadingCohorts}>
        <Stack direction="column" mt="0.5rem" mb="1rem">
          <Stack
            direction="row"
            justifyContent="end"
            alignItems="center"
            width="100%"
          >
            <TextField
              name="cohort"
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
          <Tabs
            value={selectedType}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="project-level-tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: { color: "primary" },
              marginY: { xs: 2, md: 0 },
            }}
          >
            {STAFF_VALUES.map((level) => {
              return <Tab key={level} value={level} label={level} />;
            })}
          </Tabs>
        </Stack>
        <LoadingWrapper
          isLoading={isFetching(fetchStaffStatus)}
          loadingText="Loading staff..."
        >
          <NoDataWrapper
            noDataCondition={
              !staff ||
              !Object.keys(staff) ||
              !unwrapStaff(staff, selectedType).length
            }
            fallback={<NoneFound message="No such staff found" />}
          >
            <Grid container spacing={{ xs: 2, md: 4, xl: 8 }} pb={"2rem"}>
              {staff
                ? unwrapStaff(staff, selectedType).map((person) => {
                    return (
                      <Grid item key={person.id} xs={6} md={3} xl={12 / 5}>
                        <StaffCard staff={person} />
                      </Grid>
                    );
                  })
                : null}
            </Grid>
          </NoDataWrapper>
        </LoadingWrapper>
      </Body>
    </>
  );
};

export default Staff;
