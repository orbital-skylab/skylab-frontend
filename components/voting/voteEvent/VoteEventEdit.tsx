import GeneralSettingsTab from "@/components/voting/voteEvent/GeneralSettingsTab";
import VoterManagementTab from "@/components/voting/voteEvent/VoterManagementTab";
import { Mutate } from "@/hooks/useFetch";
import { GetVoteEventResponse } from "@/types/api";
import { VOTE_EVENT_TABS, VoteEvent } from "@/types/voteEvents";
import { Box, Tab, Tabs, tabsClasses } from "@mui/material";
import { FC, useState } from "react";
import CandidatesTab from "./CandidatesTab";
import ResultsTab from "./ResultsTab";
import VoteConfigTab from "./VoteConfigTab";

type Props = {
  voteEvent: VoteEvent;
  mutate: Mutate<GetVoteEventResponse>;
};

const VoteEventEdit: FC<Props> = ({ voteEvent, mutate }) => {
  let { voterManagement } = voteEvent;
  if (voterManagement === null || voterManagement === undefined) {
    voterManagement = {
      voteEventId: 0,
      hasInternalList: false,
      hasExternalList: false,
      hasExternalCsvImport: false,
      hasInternalCsvImport: false,
      hasGeneration: false,
      hasRegistration: false,
      isRegistrationOpen: false,
    };
  }
  const [selectedTab, setSelectedTab] = useState<VOTE_EVENT_TABS>(
    VOTE_EVENT_TABS.GENERAL_SETTINGS
  );

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: VOTE_EVENT_TABS
  ) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Box
        sx={{ bgcolor: "background.paper", display: "flex", marginTop: "1rem" }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          orientation="vertical"
          aria-label="vote-event-tabs"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: { color: "primary" },
            marginRight: "1rem",
            borderRight: 1,
            borderColor: "divider",
          }}
        >
          {Object.values(VOTE_EVENT_TABS).map((tab) => {
            return (
              <Tab
                id={`${tab.toLowerCase()}-tab`}
                key={tab}
                value={tab}
                label={tab}
              />
            );
          })}
        </Tabs>
        {selectedTab === VOTE_EVENT_TABS.GENERAL_SETTINGS && (
          <GeneralSettingsTab voteEvent={voteEvent} mutate={mutate} />
        )}
        {selectedTab === VOTE_EVENT_TABS.VOTER_MANAGEMENT && (
          <VoterManagementTab
            voteEventId={voteEvent.id}
            voterManagement={voterManagement}
            isRegistrationOpen={voterManagement.isRegistrationOpen}
            mutate={mutate}
          />
        )}
        {selectedTab === VOTE_EVENT_TABS.CANDIDATES && (
          <CandidatesTab voteEventId={voteEvent.id} />
        )}
        {selectedTab === VOTE_EVENT_TABS.VOTE_CONFIG && (
          <VoteConfigTab voteEventId={voteEvent.id} />
        )}
        {selectedTab === VOTE_EVENT_TABS.RESULTS && (
          <ResultsTab voteEventId={voteEvent.id} />
        )}
      </Box>
    </>
  );
};
export default VoteEventEdit;
