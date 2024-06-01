import { FC } from "react";

type Props = {
  voteEventId: number;
};

const CandidatesTab: FC<Props> = ({ voteEventId }) => {
  return <div>{`Vote event ${voteEventId} CandidatesTab`}</div>;
};
export default CandidatesTab;
