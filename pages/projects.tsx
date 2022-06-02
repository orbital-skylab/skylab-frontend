import { SyntheticEvent, useState } from "react";
import type { NextPage } from "next";
// Libraries
import { Grid, Stack, Tab, Tabs, tabsClasses } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
// Components
import Body from "@/components/Body";
import ProjectCard from "@/components/Card/ProjectCard";
import Select from "@/components/FormControllers/Select";
// Constants
import PlaceholderImage from "@/images/stickninja.png";
import { COHORTS, LEVELS_OF_ACHIEVEMENT } from "@/types/projects";

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
          justifyContent="space-evenly"
          pt={4}
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
              maxWidth: "75%",
              [`& .${tabsClasses.scrollButtons}`]: { color: "primary" },
              marginY: { xs: 2, md: 0 },
            }}
          >
            {Object.values(LEVELS_OF_ACHIEVEMENT).map((level, key) => {
              return <Tab key={key} value={level} label={level} />;
            })}
          </Tabs>
        </Stack>
        <Grid
          container
          sx={{ margin: "auto" }}
          p={{ xs: 2, md: 4, xl: 8 }}
          spacing={{ xs: 2, md: 4, xl: 8 }}
        >
          {Array.from(Array(10).keys()).map((project) => {
            return (
              <Grid item key={project} xs={12} md={4} xl={3}>
                <ProjectCard
                  teamId={project}
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
