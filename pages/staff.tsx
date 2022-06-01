import { SyntheticEvent, useState } from "react";
import type { NextPage } from "next";
// Libraries
import { Grid, Stack, Tab, Tabs } from "@mui/material";
// Components
import Body from "@/components/Body";
import StaffCard from "@/components/Card/StaffCard";
// Constants
import PlaceholderImage from "@/images/stickninja.png";
import { placeholderStaff, staffTypes } from "@/constants/Staff.constants";

const Staff: NextPage = () => {
  const [selectedType, setSelectedType] = useState<string>(staffTypes[0]);

  const handleTabChange = (event: SyntheticEvent, newType: string) => {
    setSelectedType(newType);
  };

  return (
    <>
      <Body>
        <Stack direction="row" justifyContent="center" px={20} pt={4}>
          <Tabs
            value={selectedType}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="project-level-tabs"
          >
            {staffTypes.map((type, index) => {
              return <Tab key={index} value={type} label={type} />;
            })}
          </Tabs>
        </Stack>
        <Grid container p={8} gap={4} justifyContent="center">
          {placeholderStaff.map((staff, index) => {
            return (
              <Grid item key={index} xs={2}>
                <StaffCard name={staff} image={PlaceholderImage} />
              </Grid>
            );
          })}
        </Grid>
      </Body>
    </>
  );
};
export default Staff;
