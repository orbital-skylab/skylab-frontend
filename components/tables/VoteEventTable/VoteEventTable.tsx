import Table from "@/components/tables/Table";
import { Mutate } from "@/hooks/useFetch";
import { GetVoteEventsResponse } from "@/types/api";
import { VoteEvent } from "@/types/voteEvents";
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
  { heading: "Actions", align: "right" },
];

const VoteEventTable: FC<Props> = ({ voteEvents = [], mutate }) => {
  const voteEventRows = voteEvents.map((voteEvent) => (
    <VoteEventRow key={voteEvent.id} voteEvent={voteEvent} mutate={mutate} />
  ));

  return <Table headings={columnHeadings} rows={voteEventRows} />;
};
export default VoteEventTable;
