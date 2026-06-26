import { FC } from "react";
// Components
import HoverLink from "@/components/typography/HoverLink";
import { Box, TableCell, TableRow } from "@mui/material";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Types
import { Project } from "@/types/projects";
import { NUMBER_OF_EVALUATIONS_PER_TEAM } from "@/helpers/relations";

type Props = {
  groupedRelation: {
    team: Project;
    evaluatees: Project[];
    evaluators: Project[];
  };
  showAdviserColumn: boolean;
  onlyViewTeamsNotSatisfyingRequirements: boolean;
};

const RelationByTeamRow: FC<Props> = ({
  groupedRelation,
  showAdviserColumn,
  onlyViewTeamsNotSatisfyingRequirements,
}) => {
  const { team, evaluatees, evaluators } = groupedRelation;

  const doesTeamFulfilRequirement =
    evaluatees.length >= NUMBER_OF_EVALUATIONS_PER_TEAM &&
    evaluators.length >= NUMBER_OF_EVALUATIONS_PER_TEAM;

  if (onlyViewTeamsNotSatisfyingRequirements && doesTeamFulfilRequirement) {
    return null;
  }

  const renderProjectLink = (project: Project) => (
    <Box
      key={project.id}
      component="span"
      sx={{ color: project.hasDropped ? "red" : "inherit" }}
    >
      <HoverLink href={`${PAGES.PROJECTS}/${project.id}`}>
        {project.teamName}
      </HoverLink>
    </Box>
  );

  return (
    <>
      <TableRow
        sx={{
          background: doesTeamFulfilRequirement ? "" : "#FFE4E4",
        }}
      >
        <TableCell>{renderProjectLink(team)}</TableCell>
        <TableCell>
          {evaluatees.map((evaluatee) => renderProjectLink(evaluatee))}
        </TableCell>
        <TableCell>
          {evaluators.map((evaluator) => renderProjectLink(evaluator))}
        </TableCell>
        {showAdviserColumn && (
          <TableCell>
            {team.adviser && (
              <HoverLink href={`${PAGES.USERS}/${team.adviser.id}`}>
                {team.adviser.name}
              </HoverLink>
            )}
          </TableCell>
        )}
      </TableRow>
    </>
  );
};

export default RelationByTeamRow;
