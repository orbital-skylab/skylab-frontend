import AddExternalVoterMenu from "@/components/menus/AddExternalVoterMenu";
import AddInternalVoterMenu from "@/components/menus/AddInternalVoterMenu";
import VoterManagementConfigModal from "@/components/modals/VoterManagementConfigModal";
import ExternalVoterTable from "@/components/tables/ExternalVoterTable";
import InternalVoterTable from "@/components/tables/InternalVoterTable";
import useFetch, { Mutate } from "@/hooks/useFetch";
import {
  GetExternalVotersResponse,
  GetInternalVotersResponse,
  GetVoteEventResponse,
} from "@/types/api";
import { LIST_TYPES, VoteEvent } from "@/types/voteEvents";
import {
  Button,
  Stack,
  Tab,
  Tabs,
  Typography,
  tabsClasses,
} from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEvent: VoteEvent;
  mutate: Mutate<GetVoteEventResponse>;
};

const PRE_SET_VOTER_MANAGEMENT = {
  hasInternalList: false,
  hasExternalList: false,
  isRegistrationOpen: false,
};

const VoterManagementTab: FC<Props> = ({ voteEvent, mutate }) => {
  const { id: voteEventId } = voteEvent;
  const voterManagementSet = !!voteEvent.voterManagement;
  const voterManagement = voteEvent.voterManagement ?? PRE_SET_VOTER_MANAGEMENT;
  const { hasInternalList, hasExternalList } = voterManagement;
  const internalOnly = hasInternalList && !hasExternalList;
  const externalOnly = hasExternalList && !hasInternalList;
  const bothInternalAndExternal = hasInternalList && hasExternalList;
  const [selectedList, setSelectedList] = useState<LIST_TYPES>(
    externalOnly ? LIST_TYPES.EXTERNAL_VOTERS : LIST_TYPES.INTERNAL_VOTERS
  );
  const [isVoterManagementConfigOpen, setIsVoterManagementConfigOpen] =
    useState(false);

  const {
    data: internalVotersData,
    status: internalStatus,
    mutate: mutateInternalVoters,
    refetch: refetchInternalVoters,
  } = useFetch<GetInternalVotersResponse>({
    endpoint: `/vote-events/${voteEventId}/voter-management/internal-voters`,
    enabled: internalOnly || bothInternalAndExternal,
  });

  const {
    data: externalVotersData,
    status: externalStatus,
    mutate: mutateExternalVoters,
    refetch: refetchExternalVoters,
  } = useFetch<GetExternalVotersResponse>({
    endpoint: `/vote-events/${voteEventId}/voter-management/external-voters`,
    enabled: externalOnly || bothInternalAndExternal,
  });

  const fetchVoters = (internal: boolean, external: boolean) => {
    if (internal) {
      refetchInternalVoters();
    }
    if (external) {
      refetchExternalVoters();
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: LIST_TYPES) => {
    setSelectedList(newValue);
  };

  const handleOpenVoterManagementConfig = () => {
    setIsVoterManagementConfigOpen(true);
  };

  const voterManagementConfigButton = (
    <Button
      id="open-voter-management-config-button"
      variant="contained"
      onClick={handleOpenVoterManagementConfig}
    >
      Voter Management Config
    </Button>
  );

  return (
    <>
      <VoterManagementConfigModal
        voteEvent={voteEvent}
        voterManagement={voterManagement}
        open={isVoterManagementConfigOpen}
        setOpen={setIsVoterManagementConfigOpen}
        mutate={mutate}
        fetchVoters={fetchVoters}
      />
      {voterManagementSet ? (
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
              {voterManagementConfigButton}
            </div>
            <div style={{ gridColumn: 2, textAlign: "center" }}>
              {internalOnly && (
                <Typography variant="h5" id="internal-voters-header">
                  Internal Voters
                </Typography>
              )}
              {externalOnly && (
                <Typography variant="h5" id="external-voters-header">
                  External Voters
                </Typography>
              )}
              {bothInternalAndExternal && (
                <Tabs
                  id="voter-list-tabs"
                  value={selectedList}
                  onChange={handleTabChange}
                  aria-label="voter-list-tabs"
                  centered
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  sx={{
                    [`& .${tabsClasses.scrollButtons}`]: { color: "primary" },
                    marginY: { xs: 2, md: 0 },
                  }}
                >
                  {Object.values(LIST_TYPES).map((type) => {
                    return (
                      <Tab
                        id={`${type.split(" ")[0].toLowerCase()}-tab`}
                        key={type}
                        value={type}
                        label={type}
                      />
                    );
                  })}
                </Tabs>
              )}
            </div>
            <div
              style={{
                gridColumn: 3,
                display: "flex",
                justifyContent: "right",
              }}
            >
              {selectedList === LIST_TYPES.INTERNAL_VOTERS && (
                <AddInternalVoterMenu
                  voteEventId={voteEventId}
                  voterManagement={voterManagement}
                  mutateInternalVoters={mutateInternalVoters}
                  mutateVoteEvent={mutate}
                />
              )}
              {selectedList === LIST_TYPES.EXTERNAL_VOTERS && (
                <AddExternalVoterMenu
                  voteEventId={voteEventId}
                  mutate={mutateExternalVoters}
                />
              )}
            </div>
          </div>
          {internalOnly && (
            <InternalVoterTable
              voteEventId={voteEventId}
              internalVoters={internalVotersData?.internalVoters || []}
              status={internalStatus}
              mutate={mutateInternalVoters}
            />
          )}
          {externalOnly && (
            <ExternalVoterTable
              externalVoters={externalVotersData?.externalVoters || []}
              status={externalStatus}
              mutate={mutateExternalVoters}
            />
          )}
          {bothInternalAndExternal && (
            <>
              {selectedList === LIST_TYPES.INTERNAL_VOTERS && (
                <InternalVoterTable
                  voteEventId={voteEventId}
                  internalVoters={internalVotersData?.internalVoters || []}
                  status={internalStatus}
                  mutate={mutateInternalVoters}
                />
              )}
              {selectedList === LIST_TYPES.EXTERNAL_VOTERS && (
                <ExternalVoterTable
                  externalVoters={externalVotersData?.externalVoters || []}
                  status={externalStatus}
                  mutate={mutateExternalVoters}
                />
              )}
            </>
          )}
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
          {voterManagementConfigButton}
        </div>
      )}
    </>
  );
};
export default VoterManagementTab;
