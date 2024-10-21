import Table from "@/components/tables/Table";
import useAuth from "@/contexts/useAuth";
import { userHasRole } from "@/helpers/roles";
import { getVoteEventStatus } from "@/helpers/voteEvent";
import { Mutate } from "@/hooks/useFetch";
import { GetVoteEventsResponse } from "@/types/api";
import { ROLES } from "@/types/roles";
import { VOTE_EVENT_STATUS, VoteEvent } from "@/types/voteEvents";
import { FC } from "react";
import VoteEventRow from "./VoteEventRow";

type Props = {
  voteEvents: VoteEvent[] | undefined;
  mutate: Mutate<GetVoteEventsResponse>;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Title", align: "left" },
  { heading: "Start Time", align: "left" },
  { heading: "End Time", align: "left" },
  { heading: "Status", align: "left" },
  { heading: "Voter Actions", align: "right" },
];

const adminColumnHeadings: { heading: string; align: "left" | "right" }[] = [
  ...columnHeadings,
  { heading: "Admin Actions", align: "right" },
];

const sortVoteEvents = (voteEvents: VoteEvent[]) => {
  // Sort by title first
  voteEvents.sort((a, b) => a.title.localeCompare(b.title));

  return voteEvents.sort((a, b) => {
    const statusA = getVoteEventStatus(a);
    const statusB = getVoteEventStatus(b);

    if (statusA === statusB) {
      // If statuses are the same, sort by endTime for completed events
      if (statusA === VOTE_EVENT_STATUS.COMPLETED) {
        return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
      }

      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    }

    // Prioritize statuses
    const statusPriority = {
      [VOTE_EVENT_STATUS.UPCOMING]: 3,
      [VOTE_EVENT_STATUS.IN_PROGRESS]: 2,
      [VOTE_EVENT_STATUS.COMPLETED]: 4,
      [VOTE_EVENT_STATUS.INCOMPLETE]: 1,
    };

    return statusPriority[statusA] - statusPriority[statusB];
  });
};

const VoteEventTable: FC<Props> = ({ voteEvents = [], mutate }) => {
  const { user } = useAuth();

  const sortedVoteEvents = sortVoteEvents(voteEvents);
  const isAdmin = userHasRole(user, ROLES.ADMINISTRATORS);

  const voteEventRows = sortedVoteEvents.map((voteEvent) => (
    <VoteEventRow key={voteEvent.id} voteEvent={voteEvent} mutate={mutate} />
  ));

  return (
    <Table
      id="vote-events-table"
      headings={isAdmin ? adminColumnHeadings : columnHeadings}
      rows={voteEventRows}
    />
  );
};
export default VoteEventTable;
