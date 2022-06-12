import { SyntheticEvent, useCallback, useMemo, useState } from "react";
import type { NextPage } from "next";
// Libraries
import {
  debounce,
  Grid,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  tabsClasses,
  TextField,
} from "@mui/material";
// Components
import Body from "@/components/layout/Body";
import StaffCard from "@/components/cards/StaffCard";
// Constants
import { STAFF_VALUES } from "@/types/staff";
import useFetch, { FETCH_STATUS } from "@/hooks/useFetch";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoStaffFound from "@/components/emptyStates/NoStaffFound";
import { User } from "@/types/users";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import { Cohort } from "@/types/cohorts";

const Staff: NextPage = () => {
  /** For query searching with string pattern matching */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [querySearch, setQuerySearch] = useState("");
  const [searchTextInput, setSearchTextInput] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetQuerySearch = useCallback(
    debounce((val) => {
      setQuerySearch(val);
    }),
    []
  );

  /** For fetching cohorts and setting default as latest cohort */
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | null
  >(null);
  const { data: cohorts, status: fetchCohortsStatus } = useFetch<Cohort[]>({
    endpoint: "/cohorts",
    onFetch: (cohorts) =>
      setSelectedCohortYear(cohorts.length ? cohorts[0].academicYear : null),
  });

  const [selectedType, setSelectedType] = useState<string>(STAFF_VALUES[0]);
  const memoQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohortYear,
    };
  }, [selectedCohortYear]);

  const { data: staff, status: fetchStaffStatus } = useFetch<User[]>({
    endpoint: `/${selectedType.toLowerCase()}`,
    queryParams: memoQueryParams,
  });

  const handleTabChange = (event: SyntheticEvent, newType: string) => {
    setSelectedType(newType);
  };

  return (
    <>
      <Body
        isError={
          fetchStaffStatus === FETCH_STATUS.ERROR ||
          fetchCohortsStatus === FETCH_STATUS.ERROR
        }
        isLoading={fetchCohortsStatus === FETCH_STATUS.FETCHING}
      >
        <Stack direction="column" mt={{ md: "0.5rem" }} mb="1rem">
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
              onChange={(e) => {
                setSearchTextInput(e.target.value);
                debouncedSetQuerySearch(e.target.value);
              }}
              size="small"
            />
            <Select
              name="cohort"
              label="Cohort"
              value={selectedCohortYear}
              onChange={(e) =>
                setSelectedCohortYear(e.target.value as Cohort["academicYear"])
              }
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
          isLoading={fetchStaffStatus === FETCH_STATUS.FETCHING}
          loadingText="Loading projects..."
        >
          <NoDataWrapper
            noDataCondition={staff === undefined || staff?.length === 0}
            fallback={<NoStaffFound />}
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
