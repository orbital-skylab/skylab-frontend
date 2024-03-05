import VoterManagementTab from "@/components/voting/voteEvent/VoterManagementTab";
import { Mutate } from "@/hooks/useFetch";
import { GetVoteEventResponse } from "@/types/api";
import { VOTE_EVENT_TABS, VoteEvent } from "@/types/voteEvents";
import { Tab, Tabs, tabsClasses } from "@mui/material";
import { FC, useState } from "react";
import GeneralSettings from "./GeneralSettings";

type Props = {
  voteEvent: VoteEvent;
  mutate: Mutate<GetVoteEventResponse>;
};

const VoteEventEdit: FC<Props> = ({ voteEvent, mutate }) => {
  let { voterManagement } = voteEvent;
  if (voterManagement === null || voterManagement === undefined) {
    voterManagement = {
      voteEventId: 0,
      internalList: false,
      externalList: false,
      registration: false,
      internalCsvImport: false,
      generation: false,
      externalCsvImport: false,
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
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="vote-event-tabs"
        scrollButtons="auto"
        centered={true}
        allowScrollButtonsMobile
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: { color: "primary" },
          marginY: { xs: 2, md: 2 },
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
        <GeneralSettings voteEvent={voteEvent} mutate={mutate} />
      )}
      {selectedTab === VOTE_EVENT_TABS.VOTER_MANAGEMENT && (
        <VoterManagementTab
          voteEventId={voteEvent.id}
          voterManagement={voterManagement}
          isRegistrationOpen={voteEvent.isRegistrationOpen}
          mutate={mutate}
        />
      )}
    </>
  );
};
export default VoteEventEdit;
