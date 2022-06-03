import { SyntheticEvent, useMemo, useState } from "react";
import type { NextPage } from "next";
// Libraries
import { Grid, MenuItem, Select, Stack, Tab, Tabs } from "@mui/material";
// Components
import Body from "@/components/Body";
import StaffCard from "@/components/cards/StaffCard";
// Constants
import { STAFF_TYPES, STAFF_VALUES } from "@/types/staff";
import useFetch, { FETCH_STATUS } from "@/hooks/useFetch";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoStaffFound from "@/components/emptyStates/NoStaffFound";
import { User } from "@/types/users";
import { COHORTS, COHORTS_VALUES } from "@/types/cohorts";

const Staff: NextPage = () => {
  const [selectedCohort, setSelectedCohort] = useState<COHORTS>(
    COHORTS_VALUES[0]
  );
  const [selectedType, setSelectedType] = useState<string>(STAFF_VALUES[1]);
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

  console.log(staff);

  return (
    <>
      <Body
        isError={status === FETCH_STATUS.ERROR}
        isLoading={status === FETCH_STATUS.FETCHING}
      >
        <NoDataWrapper
          noDataCondition={staff === undefined}
          fallback={<NoStaffFound />}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            my={4}
          >
            <Select
              name="cohort"
              label="Cohort"
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value as COHORTS)}
            >
              {COHORTS_VALUES.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            <Tabs
              value={selectedType}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="project-level-tabs"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {Object.values(STAFF_TYPES).map((type) => {
                return <Tab key={type} value={type} label={type} />;
              })}
            </Tabs>
          </Stack>
          <Grid
            container
            sx={{ margin: "auto" }}
            spacing={{ xs: 2, md: 4, xl: 8 }}
            pb="1rem"
          >
            {staff
              ? staff.map((person) => {
                  return (
                    <Grid item key={person.id} xs={12} md={4} xl={3}>
                      <StaffCard staff={person} />
                    </Grid>
                  );
                })
              : null}
          </Grid>
        </NoDataWrapper>
      </Body>
    </>
  );
};
export default Staff;
