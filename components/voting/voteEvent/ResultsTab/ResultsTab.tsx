import { FC } from "react";

type Props = {
  voteEventId: number;
};

const ResultsTab: FC<Props> = ({ voteEventId }) => {
  return <div>{`Vote event ${voteEventId} ResultsTab`}</div>;
};
export default ResultsTab;
