import { SyntheticEvent, useState } from "react";
import type { NextPage } from "next";
// Libraries
import { Grid, Stack, Tab, Tabs, tabsClasses } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
// Components
import Body from "@/components/Body";
import ProjectCard from "@/components/cards/ProjectCard";
import Select from "@/components/FormControllers/Select";
// Constants
import { COHORTS, LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";

interface CohortSelectFormValuesType {
  cohort: number;
}

const Projects: NextPage = () => {
  const [selectedCohort, setSelectedCohort] = useState<number>(COHORTS.CURRENT);
  const [selectedLevel, setSelectedLevel] = useState<string>(
    LEVELS_OF_ACHIEVEMENT.ARTEMIS
  );

  const initialValues: CohortSelectFormValuesType = {
    cohort: selectedCohort,
  };

  const handleSubmit = async (
    values: CohortSelectFormValuesType,
    actions: FormikHelpers<CohortSelectFormValuesType>
  ) => {
    const { cohort } = values;
    setSelectedCohort(cohort);
    actions.setSubmitting(false);
  };

  const handleTabChange = (event: SyntheticEvent, newLevel: string) => {
    setSelectedLevel(newLevel);
  };

  const selectOptions = [COHORTS.CURRENT, COHORTS.PREVIOUS].map((cohort) => {
    return {
      label: cohort.toString(),
      value: cohort.toString(),
    };
  });

  return (
    <>
      <Body>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          my={4}
        >
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <Select
                  name="cohort"
                  label="Cohort"
                  options={selectOptions}
                  formik={formik}
                />
              </form>
            )}
          </Formik>
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
            {Object.values(LEVELS_OF_ACHIEVEMENT).map((level, key) => {
              return <Tab key={key} value={level} label={level} />;
            })}
          </Tabs>
        </Stack>
        <Grid container spacing={{ xs: 2, md: 4, xl: 8 }}>
          {DUMMY_PROJECTS.map((project) => {
            return (
              <Grid item key={project.id} xs={12} md={4} xl={3}>
                <ProjectCard project={project} />
              </Grid>
            );
          })}
        </Grid>
      </Body>
    </>
  );
};
export default Projects;

const DUMMY_PROJECTS: Project[] = [
  {
    id: 1,
    name: "Test Team",
    posterUrl: "https://nusskylab-dev.comp.nus.edu.sg/posters/2021/2680.jpg",
    students: [
      { id: 1, email: "1@gmail.com", name: "Student 1", cohortId: 0 },
      { id: 2, email: "2@gmail.com", name: "Student 2", cohortId: 0 },
    ],
    adviser: { id: 3, email: "3@gmail.com", name: "Adviser 3", cohortId: 0 },
    achievement: LEVELS_OF_ACHIEVEMENT.APOLLO,
    cohortId: 0,
  },
  {
    id: 2,
    name: "Test Team 2",
    posterUrl: "https://nusskylab-dev.comp.nus.edu.sg/posters/2021/2670.jpg",
    students: [
      {
        id: 1,
        email: "1@gmail.com",
        name: "Student with a very long name",
        cohortId: 0,
      },
      {
        id: 2,
        email: "2@gmail.com",
        name: "Another student with an even longer name",
        cohortId: 0,
      },
    ],
    adviser: {
      id: 3,
      email: "3@gmail.com",
      name: "Adviser who also happens to have a really long name",
      cohortId: 0,
    },
    achievement: LEVELS_OF_ACHIEVEMENT.APOLLO,
    cohortId: 0,
  },
];
