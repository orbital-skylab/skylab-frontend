import {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { NextPage } from "next";
// Libraries
import {
  debounce,
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
// Hooks
import useFetch, { isFetching, isError } from "@/hooks/useFetch";
import useCohort from "@/hooks/useCohort";
// Types
import { STAFF_TYPES, STAFF_VALUES } from "@/types/staff";
import { Cohort } from "@/types/cohorts";
import { Facilitator } from "@/types/facilitators";
import { Adviser } from "@/types/advisers";
import { Mentor } from "@/types/mentors";

type GetFacilitatorsResponse = {
  facilitators: Facilitator[];
};

type GetAdvisersResponse = {
  advisers: Adviser[];
};

type GetMentorsResponse = {
  mentors: Mentor[];
};

type GetStaffResponse =
  | GetFacilitatorsResponse
  | GetAdvisersResponse
  | GetMentorsResponse;

const Staff: NextPage = () => {
  const [querySearch, setQuerySearch] = useState("");
  const [searchTextInput, setSearchTextInput] = useState("");
  const [selectedType, setSelectedType] = useState<STAFF_TYPES>(
    STAFF_VALUES[0]
  );
  const {
    currentCohortYear,
    cohorts,
    isLoading: isLoadingCohorts,
  } = useCohort();
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | undefined
  >(currentCohortYear);

  /** Fetching staff based on filters */
  const memoQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohortYear,
      search: querySearch,
    };
  }, [selectedCohortYear, querySearch]);
  const { data: staff, status: fetchStaffStatus } = useFetch<GetStaffResponse>({
    endpoint: `/${selectedType.toLowerCase()}`,
    queryParams: memoQueryParams,
  });

  const unwrapStaff = (staff: GetStaffResponse, selectedType: STAFF_TYPES) => {
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
      case STAFF_TYPES.FACILITATORS:
        staff = staff as GetFacilitatorsResponse;
        if (!staff.facilitators) {
          return [];
        }
        return staff.facilitators;
    }
  };

  /** Input Change Handlers */
  const handleTabChange = (event: SyntheticEvent, newType: STAFF_TYPES) => {
    setSelectedType(newType);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetQuerySearch = useCallback(
    debounce((val) => {
      setQuerySearch(val);
    }),
    []
  );

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTextInput(e.target.value);
    debouncedSetQuerySearch(e.target.value);
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
      <Body isError={isError(fetchStaffStatus)} isLoading={isLoadingCohorts}>
        <Stack direction="column" mt="0.5rem" mb="1rem">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            mb={{ md: "0.5rem" }}
          >
            <TextField
              label="Search"
              value={searchTextInput}
              onChange={handleSearchInputChange}
              size="small"
            />
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
