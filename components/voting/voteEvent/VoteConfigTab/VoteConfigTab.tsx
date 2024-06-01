import { FC } from "react";

type Props = {
  voteEventId: number;
};

const VoteConfigTab: FC<Props> = ({ voteEventId }) => {
  return <div>{`Vote event ${voteEventId} VoteConfigTab`}</div>;
};
export default VoteConfigTab;
