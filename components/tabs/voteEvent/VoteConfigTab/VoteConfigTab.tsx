import VoteConfigModal from "@/components/modals/VoteConfigModal";
import VotesTable from "@/components/tables/VotesTable";
import useFetch, { Mutate } from "@/hooks/useFetch";
import { GetVoteEventResponse, GetVoteEventVotesResponse } from "@/types/api";
import { VoteEvent } from "@/types/voteEvents";
import { Button, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEvent: VoteEvent;
  mutate: Mutate<GetVoteEventResponse>;
};

const VoteConfigTab: FC<Props> = ({ voteEvent, mutate }) => {
  const [openVoteConfigModal, setOpenVoteConfigModal] = useState(false);
  const isVoteConfigSet = !!voteEvent.voteConfig;

  const {
    data: votesData,
    status,
    mutate: mutateVotes,
  } = useFetch<GetVoteEventVotesResponse>({
    endpoint: `/vote-events/${voteEvent.id}/votes/all`,
  });

  const handleOpenVoteConfigModal = () => {
    setOpenVoteConfigModal(true);
  };

  const voteConfigButton = (
    <Button
      id="vote-config-modal-button"
      variant="contained"
      onClick={handleOpenVoteConfigModal}
    >
      Set Vote Config
    </Button>
  );

  return (
    <>
      <VoteConfigModal
        voteEvent={voteEvent}
        open={openVoteConfigModal}
        setOpen={setOpenVoteConfigModal}
        mutate={mutate}
      />
      {isVoteConfigSet ? (
        <Stack flexGrow={1}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              alignItems: "center",
            }}
          >
            <div
              style={{ gridColumn: 1, display: "flex", justifyContent: "left" }}
            >
              {voteConfigButton}
            </div>
            <div style={{ gridColumn: 2, textAlign: "center" }}>
              <Typography variant="h5" id="votes-header">
                Votes
              </Typography>
            </div>
          </div>
          <VotesTable
            votes={votesData?.votes || []}
            status={status}
            voteEventId={voteEvent.id}
            mutate={mutateVotes}
          />
        </Stack>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {voteConfigButton}
        </div>
      )}
    </>
  );
};
export default VoteConfigTab;
