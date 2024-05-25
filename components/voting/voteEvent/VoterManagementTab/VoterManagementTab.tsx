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
import { LIST_TYPES, VoterManagement } from "@/types/voteEvents";
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
  voteEventId: number;
  voterManagement: VoterManagement | undefined;
  mutate: Mutate<GetVoteEventResponse>;
};

const VoterManagementTab: FC<Props> = ({
  voteEventId,
  voterManagement,
  mutate,
}) => {
  const voterManagementSet = !!voterManagement;
  if (!voterManagement) {
    voterManagement = {
      hasInternalList: false,
      hasExternalList: false,
      hasGeneration: false,
      hasRegistration: false,
      hasInternalCsvImport: false,
      hasExternalCsvImport: false,
      isRegistrationOpen: false,
    };
  }
  const {
    hasInternalList,
    hasExternalList,
    hasGeneration,
    hasRegistration,
    hasInternalCsvImport,
    hasExternalCsvImport,
    isRegistrationOpen,
  } = voterManagement;
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
  } = useFetch<GetInternalVotersResponse>({
    endpoint: `/vote-events/${voteEventId}/voter-management/internal-voters`,
  });

  const {
    data: externalVotersData,
    status: externalStatus,
    mutate: mutateExternalVoters,
  } = useFetch<GetExternalVotersResponse>({
    endpoint: `/vote-events/${voteEventId}/voter-management/external-voters`,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: LIST_TYPES) => {
    setSelectedList(newValue);
  };

  const handleOpenVoterManagementConfig = () => {
    setIsVoterManagementConfigOpen(true);
  };

  const voterManagementConfigButton = (
    <Button
      id="open-voter-management-config-button"
      variant="outlined"
      size="small"
      onClick={handleOpenVoterManagementConfig}
    >
      Management Config
    </Button>
  );

  return (
    <>
      <VoterManagementConfigModal
        voteEventId={voteEventId}
        voterManagement={voterManagement}
        open={isVoterManagementConfigOpen}
        setOpen={setIsVoterManagementConfigOpen}
        mutate={mutate}
      />
      {voterManagementSet ? (
        <Stack flexGrow={1}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            sx={{ marginBottom: "1rem", marginTop: "1rem" }}
          >
            {voterManagementConfigButton}
            {internalOnly && <Typography>Internal Voters</Typography>}
            {externalOnly && <Typography>External Voters</Typography>}
            {bothInternalAndExternal && (
              <Tabs
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
                      id={`${type.toLowerCase()}-tab`}
                      key={type}
                      value={type}
                      label={type}
                    />
                  );
                })}
              </Tabs>
            )}
            {selectedList === LIST_TYPES.INTERNAL_VOTERS && (
              <AddInternalVoterMenu
                voteEventId={voteEventId}
                hasRegistration={hasRegistration}
                hasInternalCsvImport={hasInternalCsvImport}
                isRegistrationOpen={isRegistrationOpen}
                mutateInternalVoters={mutateInternalVoters}
                mutateVoteEvent={mutate}
              />
            )}
            {selectedList === LIST_TYPES.EXTERNAL_VOTERS && (
              <AddExternalVoterMenu
                voteEventId={voteEventId}
                hasGeneration={hasGeneration}
                hasExternalCsvImport={hasExternalCsvImport}
                mutate={mutateExternalVoters}
              />
            )}
          </Stack>
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
        <div>{voterManagementConfigButton}</div>
      )}
    </>
  );
};
export default VoterManagementTab;
