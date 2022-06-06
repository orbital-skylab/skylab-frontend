import { SyntheticEvent, useMemo, useState } from "react";
import type { NextPage } from "next";
// Libraries
import {
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
import Body from "@/components/Body";
import StaffCard from "@/components/cards/StaffCard";
// Constants
import { STAFF_VALUES } from "@/types/staff";
import useFetch, { FETCH_STATUS } from "@/hooks/useFetch";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoStaffFound from "@/components/emptyStates/NoStaffFound";
import { User } from "@/types/users";
import { COHORTS, COHORTS_VALUES } from "@/types/cohorts";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";

const Staff: NextPage = () => {
  const [searchTextInput, setSearchTextInput] = useState<string>("");
  const [selectedCohort, setSelectedCohort] = useState<COHORTS>(
    COHORTS_VALUES[0]
  );
  const [selectedType, setSelectedType] = useState<string>(STAFF_VALUES[0]);
  const memoQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohort,
    };
  }, [selectedCohort]);

  const { data: staff, status } = useFetch<User[]>({
    endpoint: `/${selectedType.toLowerCase()}`,
    queryParams: memoQueryParams,
  });

  const handleTabChange = (event: SyntheticEvent, newType: string) => {
    setSelectedType(newType);
  };

  return (
    <>
      <Body isError={status === FETCH_STATUS.ERROR}>
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
              }}
              size="small"
            />
            <Select
              name="cohort"
              label="Cohort"
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value as COHORTS)}
              size="small"
            >
              {COHORTS_VALUES.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
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
          isLoading={status === FETCH_STATUS.FETCHING}
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
