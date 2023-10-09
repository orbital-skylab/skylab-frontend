import RelationByTeamsTable from "@/components/tables/RelationByTeamsTable";
import RelationCheckmarkTable from "@/components/tables/RelationCheckmarkTable";
import { transformTabNameIntoId } from "@/helpers/dashboard";
import { Mutate } from "@/hooks/useFetch";
import { GetRelationsResponse } from "@/types/api";
import { Project } from "@/types/projects";
import { EvaluationRelation } from "@/types/relations";
import {} from "@mui/icons-material";
import { TabContext, TabPanel } from "@mui/lab";
import {
  Box,
  FormControlLabel,
  Stack,
  Switch,
  Tab,
  Tabs,
  Typography,
  tabsClasses,
} from "@mui/material";
import { FC, useState } from "react";
import SidebarActions from "./SidebarActions/SidebarActions";
import {
  NUMBER_OF_EVALUATIONS_PER_TEAM,
  groupRelationsByTeam,
} from "@/helpers/relations";

enum TAB {
  VIEW_BY_TEAM = "View by team",
  VIEW_BY_RELATIONS = "View by relations",
}

type Props = {
  relations: EvaluationRelation[];
  mutateRelations: Mutate<GetRelationsResponse>;
  projects: Project[];
};

const AdviserManageRelationsContent: FC<Props> = ({
  relations,
  mutateRelations,
  projects,
}) => {
  const [selectedTab, setSelectedTab] = useState<TAB>(TAB.VIEW_BY_TEAM);
  const [
    onlyViewTeamsNotSatisfyingRequirements,
    setOnlyViewTeamsNotSatisfyingRequirements,
  ] = useState(false);
  const [selectedRelationIds, setSelectedRelationIds] = useState<Set<number>>(
    new Set()
  );

  /** Helper functions */
  const handleTabChange = (event: React.SyntheticEvent, newValue: TAB) => {
    setSelectedTab(newValue);
  };

  const handleSwitchClick = () => {
    setOnlyViewTeamsNotSatisfyingRequirements(
      !onlyViewTeamsNotSatisfyingRequirements
    );
  };

  const checkIfAllTeamsSatisfyRequirements = () => {
    const groupedRelations = groupRelationsByTeam(relations);
    const teamsThatDoNotSatisfy = Object.values(groupedRelations).filter(
      (groupedRelation) => {
        const { evaluatees, evaluators } = groupedRelation;
        return (
          evaluatees.length < NUMBER_OF_EVALUATIONS_PER_TEAM ||
          evaluators.length < NUMBER_OF_EVALUATIONS_PER_TEAM
        );
      }
    );

    return {
      teamsThatDoNotSatisfy,
      satisfies: teamsThatDoNotSatisfy.length === 0,
    };
  };

  const { teamsThatDoNotSatisfy, satisfies } =
    checkIfAllTeamsSatisfyRequirements();

  return (
    <>
      <Stack gap="0.25rem" mb="1rem">
        <Typography fontSize="1.5rem" fontWeight="bold">
          Summary
        </Typography>
        <Typography>{`You are currently assigned to ${projects.length} teams`}</Typography>
        {satisfies ? (
          <Typography
            fontWeight="bold"
            color="green"
          >{`All your teams satisfy the requirements of having ${NUMBER_OF_EVALUATIONS_PER_TEAM} evaluatees and ${NUMBER_OF_EVALUATIONS_PER_TEAM} evaluators`}</Typography>
        ) : (
          <Typography fontWeight="bold" color="red">{`${
            teamsThatDoNotSatisfy.length
          } of your team${
            teamsThatDoNotSatisfy.length > 1 ? "s" : ""
          } do not satisfy the requirement of evaluating and being evaluated by at least ${NUMBER_OF_EVALUATIONS_PER_TEAM} other teams`}</Typography>
        )}
      </Stack>
      <TabContext value={selectedTab}>
        <Tabs
          value={selectedTab}
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
          {Object.values(TAB).map((tab) => (
            <Tab
              key={tab}
              id={transformTabNameIntoId(tab)}
              value={tab}
              label={tab}
            />
          ))}
        </Tabs>
        <TabPanel value={TAB.VIEW_BY_TEAM}>
          <Box display="flex" gap="2rem">
            <Box width="100%">
              <FormControlLabel
                id="preview-questions-button"
                value={onlyViewTeamsNotSatisfyingRequirements}
                onClick={handleSwitchClick}
                control={<Switch />}
                label="Only view teams that do not satisfy the requirements"
                labelPlacement="end"
              />
              <RelationByTeamsTable
                relations={relations}
                onlyViewTeamsNotSatisfyingRequirements={
                  onlyViewTeamsNotSatisfyingRequirements
                }
              />
            </Box>
            <SidebarActions
              projects={projects}
              relations={relations}
              mutateRelations={mutateRelations}
            />
          </Box>
        </TabPanel>
        <TabPanel value={TAB.VIEW_BY_RELATIONS}>
          <Box display="flex" gap="2rem">
            <RelationCheckmarkTable
              relations={relations}
              selectedRelationIds={selectedRelationIds}
              setSelectedRelationIds={setSelectedRelationIds}
            />
            <SidebarActions
              selectedRelationIds={selectedRelationIds}
              projects={projects}
              relations={relations}
              mutateRelations={mutateRelations}
            />
          </Box>
        </TabPanel>
      </TabContext>
    </>
  );
};
export default AdviserManageRelationsContent;
