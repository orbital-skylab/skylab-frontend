import NoneFound from "@/components/emptyStates/NoneFound";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { FETCH_STATUS, Mutate, isFetching } from "@/hooks/useFetch";
import { GetCandidatesResponse } from "@/types/api";

import CandidateRow from "@/components/tables/CandidateTable/CandidateRow";
import Table from "@/components/tables/Table";
import { Project } from "@/types/projects";
import { FC } from "react";

type Props = {
  voteEventId: number;
  candidates: Project[];
  status: FETCH_STATUS;
  mutate: Mutate<GetCandidatesResponse>;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Project ID", align: "left" },
  { heading: "Name", align: "left" },
  { heading: "cohort", align: "left" },
  { heading: "achievement", align: "left" },
  { heading: "Actions", align: "right" },
];

const CandidateTable: FC<Props> = ({
  voteEventId,
  candidates,
  status,
  mutate,
}) => {
  const candidateRows = candidates.map((candidate) => (
    <CandidateRow
      key={candidate.id}
      voteEventId={voteEventId}
      candidate={candidate}
      mutate={mutate}
    />
  ));

  return (
    <LoadingWrapper isLoading={isFetching(status)}>
      <NoDataWrapper
        noDataCondition={candidates.length === 0}
        fallback={<NoneFound title="" message="No candidates found" />}
      >
        <Table
          id="candidate-table"
          headings={columnHeadings}
          rows={candidateRows}
        />
      </NoDataWrapper>
    </LoadingWrapper>
  );
};
export default CandidateTable;
