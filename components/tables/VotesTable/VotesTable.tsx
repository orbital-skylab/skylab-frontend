import NoneFound from "@/components/emptyStates/NoneFound";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { FETCH_STATUS, Mutate, isFetching } from "@/hooks/useFetch";
import { GetVoteEventVotesResponse } from "@/types/api";

import Table from "@/components/tables/Table";
import VoteRow from "@/components/tables/VotesTable/VoteRow";
import { Vote } from "@/types/voteEvents";
import { FC } from "react";

type Props = {
  voteEventId: number;
  votes: Vote[];
  status: FETCH_STATUS;
  mutate: Mutate<GetVoteEventVotesResponse>;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Voter ID", align: "left" },
  { heading: "Name", align: "left" },
  { heading: "Project ID", align: "left" },
  { heading: "Project Name", align: "left" },
  { heading: "Actions", align: "right" },
];

const VotesTable: FC<Props> = ({ voteEventId, votes, status, mutate }) => {
  votes = votes.sort((a, b) => a.projectId - b.projectId);
  const voteRows = votes.map((vote, idx) => (
    <VoteRow key={idx} voteEventId={voteEventId} vote={vote} mutate={mutate} />
  ));

  return (
    <LoadingWrapper isLoading={isFetching(status)}>
      <NoDataWrapper
        noDataCondition={votes.length === 0}
        fallback={<NoneFound title="" message="No votes found" />}
      >
        <Table id="votes-table" headings={columnHeadings} rows={voteRows} />
      </NoDataWrapper>
    </LoadingWrapper>
  );
};
export default VotesTable;
