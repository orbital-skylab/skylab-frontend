import AddExternalVoterMenu from "@/components/menus/AddExternalVoterMenu";
import AddInternalVoterMenu from "@/components/menus/AddInternalVoterMenu";
import InternalVoterRegistrationModal from "@/components/modals/InternalVoterRegistrationModal";
import VoterManagementConfigModal from "@/components/modals/VoterManagementConfigModal";
import ExternalVoterTable from "@/components/tables/ExternalVoterTable";
import InternalVoterTable from "@/components/tables/InternalVoterTable";
import { DEFAULT_REGISTRATION_PERIOD } from "@/helpers/voteEvent";
import useFetch, { Mutate } from "@/hooks/useFetch";
import {
  GetExternalVotersResponse,
  GetInternalVotersResponse,
  GetVoteEventResponse,
} from "@/types/api";
import { LIST_TYPES, VoteEvent } from "@/types/voteEvents";
import {
  Box,
  Button,
  Grid,
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
  ...DEFAULT_REGISTRATION_PERIOD,
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
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

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

    setSelectedList(
      internal ? LIST_TYPES.INTERNAL_VOTERS : LIST_TYPES.EXTERNAL_VOTERS
    );
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
      <InternalVoterRegistrationModal
        voteEventId={voteEventId}
        voterManagement={voterManagement}
        open={isRegistrationModalOpen}
        handleCloseMenu={() => setIsRegistrationModalOpen(false)}
        setOpen={setIsRegistrationModalOpen}
        mutate={mutate}
      />
      {voterManagementSet ? (
        <Stack flexGrow={1}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            direction={{ xs: "column", md: "row" }}
          >
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent={{
                xs: "center",
                md: "left",
              }}
              direction={{ xs: "column", md: "row" }}
              gap={1}
            >
              {voterManagementConfigButton}
              {selectedList === LIST_TYPES.INTERNAL_VOTERS && (
                <Button
                  id="open-registration-modal-button"
                  variant="contained"
                  onClick={() => setIsRegistrationModalOpen(true)}
                >
                  Self Registration
                </Button>
              )}
            </Grid>
            <Grid item xs={12} md={4} display="flex" justifyContent="center">
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
                  {Object.values(LIST_TYPES).map((type) => (
                    <Tab
                      id={`${type.split(" ")[0].toLowerCase()}-tab`}
                      key={type}
                      value={type}
                      label={type}
                    />
                  ))}
                </Tabs>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent={{
                xs: "center",
                md: "right",
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
            </Grid>
          </Grid>
          <Box mt={2}>
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
          </Box>
        </Stack>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          {voterManagementConfigButton}
        </Box>
      )}
    </>
  );
};

export default VoterManagementTab;
