import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import CandidatesTab from "@/components/tabs/voteEvent/CandidatesTab";
import GeneralSettingsTab from "@/components/tabs/voteEvent/GeneralSettingsTab";
import ResultsTab from "@/components/tabs/voteEvent/ResultsTab";
import VoteConfigTab from "@/components/tabs/voteEvent/VoteConfigTab";
import VoterManagementTab from "@/components/tabs/voteEvent/VoterManagementTab";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { GetVoteEventResponse } from "@/types/api";
import { ROLES } from "@/types/roles";
import { VOTE_EVENT_TABS } from "@/types/voteEvents";
import {
  Box,
  Tab,
  Tabs,
  tabsClasses,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const EditVoteEvent: NextPage = () => {
  const router = useRouter();
  const { voteEventId } = router.query;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedTab, setSelectedTab] = useState<VOTE_EVENT_TABS>(
    VOTE_EVENT_TABS.GENERAL_SETTINGS
  );

  const { data, status, mutate } = useFetch<GetVoteEventResponse>({
    endpoint: `/vote-events/${voteEventId}`,
    enabled: !!voteEventId,
  });

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: VOTE_EVENT_TABS
  ) => {
    setSelectedTab(newValue);
  };

  return (
    <Body
      isLoading={isFetching(status)}
      loadingText="Loading edit vote event..."
      authorizedRoles={[ROLES.ADMINISTRATORS]}
    >
      <NoDataWrapper
        noDataCondition={!data || !data.voteEvent}
        fallback={<NoneFound message="No such vote event found" />}
      >
        {data && (
          <>
            <Box
              sx={{
                bgcolor: "background.paper",
                display: "flex",
                marginTop: "1rem",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Tabs
                id="vote-event-tabs"
                value={selectedTab}
                onChange={handleTabChange}
                orientation={isSmallScreen ? "horizontal" : "vertical"}
                aria-label="vote-event-tabs"
                scrollButtons="auto"
                allowScrollButtonsMobile
                variant="scrollable"
                sx={{
                  [`& .${tabsClasses.scrollButtons}`]: { color: "primary" },
                  marginRight: { xs: 0, md: "1rem" },
                  borderRight: 1,
                  borderColor: "divider",
                  minWidth: "190px",
                  marginBottom: { xs: "1rem", md: 0 },
                }}
              >
                {Object.values(VOTE_EVENT_TABS).map((tab) => {
                  return (
                    <Tab
                      id={`${tab.toLowerCase().split(" ").join("-")}-tab`}
                      key={tab}
                      value={tab}
                      label={tab}
                    />
                  );
                })}
              </Tabs>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {selectedTab === VOTE_EVENT_TABS.GENERAL_SETTINGS && (
                  <GeneralSettingsTab
                    voteEvent={data.voteEvent}
                    mutate={mutate}
                  />
                )}
                {selectedTab === VOTE_EVENT_TABS.VOTER_MANAGEMENT && (
                  <VoterManagementTab
                    voteEvent={data.voteEvent}
                    mutate={mutate}
                  />
                )}
                {selectedTab === VOTE_EVENT_TABS.CANDIDATES && (
                  <CandidatesTab voteEventId={data.voteEvent.id} />
                )}
                {selectedTab === VOTE_EVENT_TABS.VOTE_CONFIG && (
                  <VoteConfigTab voteEvent={data.voteEvent} mutate={mutate} />
                )}
                {selectedTab === VOTE_EVENT_TABS.RESULTS && (
                  <ResultsTab voteEvent={data.voteEvent} mutate={mutate} />
                )}
              </Box>
            </Box>
          </>
        )}
      </NoDataWrapper>
    </Body>
  );
};

export default EditVoteEvent;
