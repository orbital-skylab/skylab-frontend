import NoneFound from "@/components/emptyStates/NoneFound";
import Table from "@/components/tables/Table";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { FETCH_STATUS, Mutate, isFetching } from "@/hooks/useFetch";
import { GetExternalVotersResponse } from "@/types/api";
import { ExternalVoter } from "@/types/voteEvents";
import { FC } from "react";
import ExternalVoterRow from "./ExternalVoterRow";

type Props = {
  externalVoters: ExternalVoter[];
  status: FETCH_STATUS;
  mutate: Mutate<GetExternalVotersResponse>;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Voter Id", align: "left" },
  { heading: "Actions", align: "right" },
];

const ExternalVoterTable: FC<Props> = ({ externalVoters, status, mutate }) => {
  const externalVoterRows = externalVoters.map((externalVoter) => (
    <ExternalVoterRow
      key={externalVoter.id}
      externalVoter={externalVoter}
      mutate={mutate}
    />
  ));

  return (
    <LoadingWrapper isLoading={isFetching(status)}>
      <NoDataWrapper
        noDataCondition={externalVoters.length === 0}
        fallback={<NoneFound message="No external voters found" />}
      >
        <Table headings={columnHeadings} rows={externalVoterRows} />
      </NoDataWrapper>
    </LoadingWrapper>
  );
};
export default ExternalVoterTable;
