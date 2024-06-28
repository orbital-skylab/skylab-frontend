import NoneFound from "@/components/emptyStates/NoneFound";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { FETCH_STATUS, Mutate, isFetching } from "@/hooks/useFetch";
import { GetInternalVotersResponse } from "@/types/api";

import Table from "@/components/tables/Table";
import { User } from "@/types/users";
import { FC } from "react";
import InternalVoterRow from "./InternalVoterRow";

type Props = {
  voteEventId: number;
  internalVoters: User[];
  status: FETCH_STATUS;
  mutate: Mutate<GetInternalVotersResponse>;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Email", align: "left" },
  { heading: "Name", align: "left" },
  { heading: "Role", align: "left" },
  { heading: "Actions", align: "right" },
];

const InternalVoterTable: FC<Props> = ({
  voteEventId,
  internalVoters,
  status,
  mutate,
}) => {
  const internalVoterRows = internalVoters.map((internalVoter) => (
    <InternalVoterRow
      key={internalVoter.id}
      voteEventId={voteEventId}
      internalVoter={internalVoter}
      mutate={mutate}
    />
  ));

  return (
    <LoadingWrapper isLoading={isFetching(status)}>
      <NoDataWrapper
        noDataCondition={internalVoters.length === 0}
        fallback={<NoneFound title="" message="No internal voters found" />}
      >
        <Table
          id="internal-voter-table"
          headings={columnHeadings}
          rows={internalVoterRows}
        />
      </NoDataWrapper>
    </LoadingWrapper>
  );
};
export default InternalVoterTable;
