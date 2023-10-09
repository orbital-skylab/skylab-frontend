import { FC } from "react";
// Components
import HoverLink from "@/components/typography/HoverLink";
import { TableCell, TableRow } from "@mui/material";
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

  return (
    <>
      <TableRow
        sx={{
          background: doesTeamFulfilRequirement ? "" : "#FFE4E4",
        }}
      >
        <TableCell>
          <HoverLink href={`${PAGES.PROJECTS}/${team.id}`}>
            {team.teamName}
          </HoverLink>
        </TableCell>
        <TableCell>
          {evaluatees.map((evaluatee) => (
            <HoverLink
              key={evaluatee.id}
              href={`${PAGES.PROJECTS}/${evaluatee.id}`}
            >
              {evaluatee.teamName}
            </HoverLink>
          ))}
        </TableCell>
        <TableCell>
          {evaluators.map((evaluator) => (
            <HoverLink
              key={evaluator.id}
              href={`${PAGES.PROJECTS}/${evaluator.id}`}
            >
              {evaluator.teamName}
            </HoverLink>
          ))}
        </TableCell>
        {showAdviserColumn && (
          <TableCell>
            {team.adviser && (
              <HoverLink href={`${PAGES.USERS}/${team.adviser.adviserId}`}>
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
