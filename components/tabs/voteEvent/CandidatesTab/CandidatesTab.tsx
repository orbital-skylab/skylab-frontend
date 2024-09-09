import AddCandidateMenu from "@/components/menus/AddCandidateMenu";
import SearchInput from "@/components/search/SearchInput";
import CandidateTable from "@/components/tables/CandidateTable";
import useFetch from "@/hooks/useFetch";
import { GetCandidatesResponse } from "@/types/api";
import { Stack, Typography } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEventId: number;
};

const CandidatesTab: FC<Props> = ({ voteEventId }) => {
  const [searchText, setSearchText] = useState("");
  const {
    data: candidatesData,
    status,
    mutate,
  } = useFetch<GetCandidatesResponse>({
    endpoint: `/vote-events/${voteEventId}/candidates`,
    enabled: !!voteEventId,
  });

  const handleSearchChange = (searchText: string) => {
    setSearchText(searchText);
  };

  const filteredCandidates =
    candidatesData?.candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
        candidate.id.toString().includes(searchText)
    ) || [];

  return (
    <Stack flexGrow={1}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          alignItems: "center",
        }}
      >
        <div style={{ gridColumn: 2, textAlign: "center" }}>
          <Typography variant="h5" id="candidates-header">
            Candidates
          </Typography>
        </div>
        <div
          style={{ gridColumn: 3, display: "flex", justifyContent: "right" }}
        >
          <AddCandidateMenu voteEventId={voteEventId} mutate={mutate} />
        </div>
      </div>
      <SearchInput
        id="search-candidates"
        label="Search name or ID"
        onChange={handleSearchChange}
      />
      <CandidateTable
        candidates={filteredCandidates}
        status={status}
        voteEventId={voteEventId}
        mutate={mutate}
      />
    </Stack>
  );
};
export default CandidatesTab;
