import { Milestone } from "@/types/milestones";
import { FC } from "react";

type Props = { milestone: Milestone };

const MilestoneCard: FC<Props> = ({ milestone }) => {
  return (
    <>
      <div>{milestone.name}</div>
    </>
  );
};
export default MilestoneCard;
