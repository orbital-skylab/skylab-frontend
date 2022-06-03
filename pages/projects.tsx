import { SyntheticEvent, useMemo, useState } from "react";
import type { NextPage } from "next";
// Libraries
import {
  Grid,
  Select,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  tabsClasses,
} from "@mui/material";
// Components
import Body from "@/components/Body";
import ProjectCard from "@/components/cards/ProjectCard";
// Constants
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";
import { COHORTS, COHORTS_VALUES } from "@/types/cohorts";
import useFetch, { FETCH_STATUS } from "@/hooks/useFetch";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";

const Projects: NextPage = () => {
  const [selectedCohort, setSelectedCohort] = useState<COHORTS>(
    COHORTS_VALUES[0]
  );
  const [selectedLevel, setSelectedLevel] = useState<LEVELS_OF_ACHIEVEMENT>(
    LEVELS_OF_ACHIEVEMENT.ARTEMIS
  );
  const memoQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohort,
      achievement: selectedLevel,
    };
  }, [selectedCohort, selectedLevel]);

  const { data: projects, status } = useFetch<Project[]>({
    endpoint: `/projects`,
    queryParams: memoQueryParams,
  });

  const handleTabChange = (
    event: SyntheticEvent,
    newLevel: LEVELS_OF_ACHIEVEMENT
  ) => {
    setSelectedLevel(newLevel);
  };

  return (
    <>
      <Body
        isLoading={status === FETCH_STATUS.FETCHING}
        isError={status === FETCH_STATUS.ERROR}
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
            value={selectedLevel}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="project-level-tabs"
            variant="scrollable"
            scrollButtons={true}
            allowScrollButtonsMobile
            sx={{
              maxWidth: { xs: "100%", md: "75%" },
              [`& .${tabsClasses.scrollButtons}`]: { color: "primary" },
              marginY: { xs: 2, md: 0 },
            }}
          >
            {Object.values(LEVELS_OF_ACHIEVEMENT).map((level) => {
              return <Tab key={level} value={level} label={level} />;
            })}
          </Tabs>
        </Stack>
        <NoDataWrapper
          noDataCondition={projects?.length === 0}
          message="No projects were found"
        >
          <Grid container spacing={{ xs: 2, md: 4, xl: 8 }}>
            {(projects as Project[]).map((project) => {
              return (
                <Grid item key={project.id} xs={12} md={4} xl={3}>
                  <ProjectCard project={project} />
                </Grid>
              );
            })}
          </Grid>
        </NoDataWrapper>
      </Body>
    </>
  );
};
export default Projects;
