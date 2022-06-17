import { Deadline } from "@/types/deadlines";
import { FC } from "react";

type Props = { deadline: Deadline };

const DeadlineCard: FC<Props> = ({ deadline }) => {
  return (
    <>
      <div>{deadline.name}</div>
    </>
  );
};
export default DeadlineCard;
