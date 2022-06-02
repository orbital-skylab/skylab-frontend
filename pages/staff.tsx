import { SyntheticEvent, useState } from "react";
import type { NextPage } from "next";
// Libraries
import { Grid, Stack, Tab, Tabs, tabsClasses } from "@mui/material";
// Components
import Body from "@/components/Body";
import StaffCard from "@/components/Card/StaffCard";
// Constants
import PlaceholderImage from "@/images/stickninja.png";
import { STAFF_TYPES } from "@/types/staff";

const Staff: NextPage = () => {
  const [selectedType, setSelectedType] = useState<string>(
    STAFF_TYPES.FACILITATORS
  );

  const handleTabChange = (event: SyntheticEvent, newType: string) => {
    setSelectedType(newType);
  };

  return (
    <>
      <Body>
        <Stack direction="row" justifyContent="center">
          <Tabs
            value={selectedType}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="project-level-tabs"
            variant="scrollable"
            scrollButtons={true}
            allowScrollButtonsMobile
            sx={{
              maxWidth: "75%",
              [`& .${tabsClasses.scrollButtons}`]: {
                color: "primary",
                fill: "primary",
              },
            }}
          >
            {Object.values(STAFF_TYPES).map((type) => {
              return <Tab key={type} value={type} label={type} />;
            })}
          </Tabs>
        </Stack>
        <Grid
          container
          sx={{ margin: "auto" }}
          p={{ xs: 2, md: 4, xl: 8 }}
          spacing={{ xs: 2, md: 4, xl: 8 }}
        >
          {Array.from(Array(10).keys()).map((staff) => {
            return (
              <Grid item key={staff} xs={12} md={4} xl={3}>
                <StaffCard name={staff.toString()} image={PlaceholderImage} />
              </Grid>
            );
          })}
        </Grid>
      </Body>
    </>
  );
};
export default Staff;
