import VoterManagementConfigModal from "@/components/modals/VoterManagementConfigModal";
import ExternalVoterTable from "@/components/tables/ExternalVoterTable";
import InternalVoterTable from "@/components/tables/InternalVoterTable";
import { Mutate } from "@/hooks/useFetch";
import { GetVoteEventResponse } from "@/types/api";
import { LIST_TYPES, VoterManagement } from "@/types/voteEvents";
import { Button, Stack, Tab, Tabs, tabsClasses } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEventId: number;
  voterManagement: VoterManagement;
  isRegistrationOpen: boolean;
  mutate: Mutate<GetVoteEventResponse>;
};

const VoterManagementTab: FC<Props> = ({
  voteEventId,
  voterManagement,
  isRegistrationOpen,
  mutate,
}) => {
  const { internalList, externalList } = voterManagement;
  const internalOnly = internalList && !externalList;
  const externalOnly = externalList && !internalList;
  const bothInternalAndExternal = internalList && externalList;
  const [selectedList, setSelectedList] = useState<LIST_TYPES>(
    externalOnly ? LIST_TYPES.EXTERNAL_VOTERS : LIST_TYPES.INTERNAL_VOTERS
  );

  const [isVoterManagementConfigOpen, setIsVoterManagementConfigOpen] =
    useState(!(voteEventId === voterManagement.voteEventId));

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: LIST_TYPES
  ) => {
    setSelectedList(newValue);
  };

  const handleOpenVoterManagementConfig = () => {
    setIsVoterManagementConfigOpen(true);
  };

  return (
    <>
      <VoterManagementConfigModal
        voteEventId={voteEventId}
        voterManagement={voterManagement}
        open={isVoterManagementConfigOpen}
        setOpen={setIsVoterManagementConfigOpen}
        mutate={mutate}
      />
      <Stack
        direction="row"
        spacing={1}
        justifyContent="flex-end"
        sx={{ marginBottom: "1rem", marginTop: "1rem" }}
      >
        <Button
          id="open-voter-management-config-button"
          variant="outlined"
          size="small"
          onClick={handleOpenVoterManagementConfig}
        >
          Management Config
        </Button>
      </Stack>
      {internalOnly && (
        <InternalVoterTable
          voteEventId={voteEventId}
          voterManagement={voterManagement}
          isRegistrationOpen={isRegistrationOpen}
          mutate={mutate}
        />
      )}
      {externalOnly && (
        <ExternalVoterTable
          voteEventId={voteEventId}
          voterManagement={voterManagement}
          mutate={mutate}
        />
      )}
      {bothInternalAndExternal && (
        <>
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
          {selectedList === LIST_TYPES.INTERNAL_VOTERS && (
            <InternalVoterTable
              voteEventId={voteEventId}
              voterManagement={voterManagement}
              isRegistrationOpen={isRegistrationOpen}
              mutate={mutate}
            />
          )}
          {selectedList === LIST_TYPES.EXTERNAL_VOTERS && (
            <ExternalVoterTable
              voteEventId={voteEventId}
              voterManagement={voterManagement}
              mutate={mutate}
            />
          )}
        </>
      )}
    </>
  );
};
export default VoterManagementTab;
