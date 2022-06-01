import { SyntheticEvent, useState } from "react";
import type { NextPage } from "next";
// Libraries
import { Grid, Stack, Tab, Tabs } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
// Components
import Body from "@/components/Body";
import ProjectCard from "@/components/Card/ProjectCard";
import Select from "@/components/FormControllers/Select";
// Constants
import PlaceholderImage from "@/images/stickninja.png";
import {
  cohorts,
  getCurrentCohort,
  getHighestLevelOfAchievement,
  levelsOfAchievement,
  placeholderProjects,
} from "@/constants/Projects.constants";

interface CohortSelectFormValuesType {
  cohort: number;
}

const Projects: NextPage = () => {
  const [selectedCohort, setSelectedCohort] = useState<number>(
    getCurrentCohort()
  );
  const [selectedLevel, setSelectedLevel] = useState<string>(
    getHighestLevelOfAchievement()
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

  const selectOptions = cohorts.map((cohort) => {
    return {
      label: cohort.toString(),
      value: cohort.toString(),
    };
  });

  return (
    <>
      <Body>
        <Stack direction="row" justifyContent="space-between" px={20} pt={4}>
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
          >
            {levelsOfAchievement.map((level, key) => {
              return <Tab key={key} value={level} label={level} />;
            })}
          </Tabs>
        </Stack>
        <Grid container p={8} gap={4} justifyContent="center">
          {placeholderProjects.map((project, index) => {
            return (
              <Grid item key={index} xs={6} sm={4} md={3} xl={2}>
                <ProjectCard
                  teamId={index}
                  teamName={`Team Name ${project}`}
                  image={PlaceholderImage}
                  students="Super Long Name 1, Super Long Name 2"
                  advisor="Super Long Name 3"
                />
              </Grid>
            );
          })}
        </Grid>
      </Body>
    </>
  );
};
export default Projects;
