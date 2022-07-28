import { Adviser } from "./advisers";
import { Team } from "./teams";

export type EvaluationRelation = {
  id: number;
  fromTeamId: number;
  toTeamId: number;
  fromTeam?: Team;
  toTeam?: Team;
  adviser: Adviser;
};
