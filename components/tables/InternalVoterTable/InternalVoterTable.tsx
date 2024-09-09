import NoneFound from "@/components/emptyStates/NoneFound";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { FETCH_STATUS, Mutate, isFetching } from "@/hooks/useFetch";
import { GetInternalVotersResponse } from "@/types/api";

import Table from "@/components/tables/Table";
import { User } from "@/types/users";
import { FC, useState } from "react";
import InternalVoterRow from "./InternalVoterRow";
import SearchInput from "@/components/search/SearchInput";

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
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (searchText: string) => {
    setSearchText(searchText);
  };

  const filteredInternalVoters = internalVoters.filter(
    (internalVoter) =>
      internalVoter.email.toLowerCase().includes(searchText.toLowerCase()) ||
      internalVoter.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const internalVoterRows = filteredInternalVoters.map((internalVoter) => (
    <InternalVoterRow
      key={internalVoter.id}
      voteEventId={voteEventId}
      internalVoter={internalVoter}
      mutate={mutate}
    />
  ));

  return (
    <>
      <SearchInput
        id="search-internal-voters"
        label="Search name or email"
        onChange={handleSearchChange}
      />
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
    </>
  );
};
export default InternalVoterTable;
