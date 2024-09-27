import NoneFound from "@/components/emptyStates/NoneFound";
import Table from "@/components/tables/Table";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { FETCH_STATUS, Mutate, isFetching } from "@/hooks/useFetch";
import { GetExternalVotersResponse } from "@/types/api";
import { ExternalVoter } from "@/types/voteEvents";
import { FC, useState } from "react";
import ExternalVoterRow from "./ExternalVoterRow";
import SearchInput from "@/components/search/SearchInput";
import { Stack } from "@mui/material";

type Props = {
  externalVoters: ExternalVoter[];
  status: FETCH_STATUS;
  mutate: Mutate<GetExternalVotersResponse>;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Voter ID", align: "left" },
  { heading: "Actions", align: "right" },
];

const ExternalVoterTable: FC<Props> = ({ externalVoters, status, mutate }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (searchText: string) => {
    setSearchText(searchText);
  };

  const filteredExternalVoters = externalVoters.filter(
    (externalVoter) =>
      externalVoter.id.toString().includes(searchText) ||
      externalVoter.id.toString().includes(searchText)
  );

  const externalVoterRows = filteredExternalVoters.map((externalVoter) => (
    <ExternalVoterRow
      key={externalVoter.id}
      externalVoter={externalVoter}
      mutate={mutate}
    />
  ));

  return (
    <Stack flexGrow={1}>
      <SearchInput
        id="search-external-voters"
        label="Search voter ID"
        onChange={handleSearchChange}
      />
      <LoadingWrapper isLoading={isFetching(status)}>
        <NoDataWrapper
          noDataCondition={externalVoters.length === 0}
          fallback={<NoneFound title="" message="No external voters found" />}
        >
          <Table
            id="external-voter-table"
            headings={columnHeadings}
            rows={externalVoterRows}
          />
        </NoDataWrapper>
      </LoadingWrapper>
    </Stack>
  );
};
export default ExternalVoterTable;
