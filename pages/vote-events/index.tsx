import NoneFound from "@/components/emptyStates/NoneFound";
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
import Body from "@/components/layout/Body";
import AddVoteEventModal from "@/components/modals/AddVoteEventModal/AddVoteEventModal";
import SearchInput from "@/components/search/SearchInput";
import VoteEventTable from "@/components/tables/VoteEventTable";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import useAuth from "@/contexts/useAuth";
import { PAGES } from "@/helpers/navigation";
import { userHasRole } from "@/helpers/roles";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { GetVoteEventsResponse } from "@/types/api";
import { ROLES } from "@/types/roles";
import { Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";

const VoteEvents: NextPage = () => {
  const [isAddVoteEventOpen, setIsAddVoteEventOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { user } = useAuth();
  const { data, status, mutate } = useFetch<GetVoteEventsResponse>({
    endpoint: PAGES.VOTE_EVENTS,
  });

  const isAdministrator = userHasRole(user, ROLES.ADMINISTRATORS);

  const handleOpenAddVoteEventModal = () => {
    setIsAddVoteEventOpen(true);
  };

  const handleSearchChange = (searchText: string) => {
    setSearchText(searchText);
  };

  const filteredVoteEvents =
    data?.voteEvents.filter((event) =>
      event.title.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

  return (
    <>
      <AddVoteEventModal
        open={isAddVoteEventOpen}
        setOpen={setIsAddVoteEventOpen}
        mutate={mutate}
      />
      <Body>
        <AutoBreadcrumbs />
        {isAdministrator && (
          <Stack
            direction="row"
            justifyContent="end"
            spacing="0.5rem"
            marginBottom="1rem"
          >
            <Button
              id="add-vote-event-modal-button"
              variant="outlined"
              size="small"
              onClick={handleOpenAddVoteEventModal}
            >
              <Add fontSize="small" sx={{ marginRight: "0.2rem" }} />
              New Vote Event
            </Button>
          </Stack>
        )}
        <LoadingWrapper
          isLoading={isFetching(status)}
          loadingText="Loading vote events..."
          fullScreen
        >
          <SearchInput
            id="search-vote-events"
            label="Search vote events"
            onChange={handleSearchChange}
          />
          <NoDataWrapper
            noDataCondition={Boolean(
              !data || !data.voteEvents || filteredVoteEvents.length === 0
            )}
            fallback={<NoneFound title="" message="No vote events found" />}
          >
            {data && (
              <VoteEventTable voteEvents={filteredVoteEvents} mutate={mutate} />
            )}
          </NoDataWrapper>
        </LoadingWrapper>
      </Body>
    </>
  );
};
export default VoteEvents;
