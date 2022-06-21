import {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import type { NextPage } from "next";
// Libraries
import {
  debounce,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import { STAFF_VALUES } from "@/types/staff";
import { User } from "@/types/users";
import { Cohort } from "@/types/cohorts";

const Staff: NextPage = () => {
  const [querySearch, setQuerySearch] = useState("");
  const [searchTextInput, setSearchTextInput] = useState("");
  const [selectedType, setSelectedType] = useState<string>(STAFF_VALUES[0]);
  const {
    currentCohortYear,
    cohorts,
    isLoading: isLoadingCohorts,
  } = useCohort();
  const [selectedCohortYear, setSelectedCohortYear] =
    useState<Cohort["academicYear"]>(currentCohortYear);

  /** Fetching staff based on filters */
  const memoQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohortYear,
      search: querySearch,
    };
  }, [selectedCohortYear, querySearch]);
  const { data: staff, status: fetchStaffStatus } = useFetch<User[]>({
    endpoint: `/${selectedType.toLowerCase()}`,
    queryParams: memoQueryParams,
  });

  /** Input Change Handlers */
  const handleTabChange = (event: SyntheticEvent, newType: string) => {
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

  const handleCohortYearChange = (e: SelectChangeEvent<number | null>) => {
    setSelectedCohortYear(e.target.value as Cohort["academicYear"]);
  };

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
            noDataCondition={staff === undefined || staff?.length === 0}
            fallback={<NoneFound message="No such staff found" />}
          >
            <Grid container spacing={{ xs: 2, md: 4, xl: 8 }} pb={"2rem"}>
              {staff
                ? staff.map((person) => {
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
