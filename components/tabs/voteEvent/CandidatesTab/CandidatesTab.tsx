import AddCandidateMenu from "@/components/menus/AddCandidateMenu";
import CandidateTable from "@/components/tables/CandidateTable";
import useFetch from "@/hooks/useFetch";
import { GetCandidatesResponse } from "@/types/api";
import { Stack, Typography } from "@mui/material";
import { FC } from "react";

type Props = {
  voteEventId: number;
};

const CandidatesTab: FC<Props> = ({ voteEventId }) => {
  const {
    data: candidatesData,
    status,
    mutate,
  } = useFetch<GetCandidatesResponse>({
    endpoint: `/vote-events/${voteEventId}/candidates`,
  });
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
          <Typography id="candidates-header">Candidates</Typography>
        </div>
        <div style={{ gridColumn: 3 }}>
          <AddCandidateMenu voteEventId={voteEventId} mutate={mutate} />
        </div>
      </div>
      <CandidateTable
        candidates={candidatesData?.candidates || []}
        status={status}
        voteEventId={voteEventId}
        mutate={mutate}
      />
    </Stack>
  );
};
export default CandidatesTab;
