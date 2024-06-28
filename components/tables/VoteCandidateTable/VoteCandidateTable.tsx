import NoneFound from "@/components/emptyStates/NoneFound";
import Table from "@/components/tables/Table";
import VoteCandidateRow from "@/components/tables/VoteCandidateTable/VoteCandidateRow";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { FETCH_STATUS, isFetching } from "@/hooks/useFetch";
import { Project } from "@/types/projects";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  selectedCandidates: { [key: number]: boolean };
  candidates: Project[];
  status: FETCH_STATUS;
  setSelectedCandidates: Dispatch<SetStateAction<{ [key: number]: boolean }>>;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Project ID", align: "left" },
  { heading: "Name", align: "left" },
  { heading: "Vote", align: "right" },
];

const VoteCandidateTable: FC<Props> = ({
  selectedCandidates,
  candidates,
  status,
  setSelectedCandidates,
}) => {
  const voteCandidateRows = candidates.map((candidate) => (
    <VoteCandidateRow
      key={candidate.id}
      candidate={candidate}
      isSelected={!!selectedCandidates[candidate.id]}
      setSelectedCandidates={setSelectedCandidates}
    />
  ));

  return (
    <LoadingWrapper isLoading={isFetching(status)}>
      <NoDataWrapper
        noDataCondition={candidates.length === 0}
        fallback={<NoneFound title="" message="No candidates found" />}
      >
        <Table
          id="candidates-table"
          headings={columnHeadings}
          rows={voteCandidateRows}
        />
      </NoDataWrapper>
    </LoadingWrapper>
  );
};
export default VoteCandidateTable;
