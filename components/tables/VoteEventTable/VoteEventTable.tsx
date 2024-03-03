import { FC } from "react";
import VoteEventRow from "./VoteEventRow";
import { VoteEvent } from "@/types/voteEvents";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Mutate } from "@/hooks/useFetch";
import { GetVoteEventsResponse } from "@/types/api";

type Props = {
  voteEvents: VoteEvent[] | undefined;
  mutate: Mutate<GetVoteEventsResponse>;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Title", align: "left" },
  { heading: "Start Time", align: "left" },
  { heading: "End Time", align: "left" },
  { heading: "Actions", align: "right" },
];

const VoteEventTable: FC<Props> = ({ voteEvents = [], mutate }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columnHeadings.map(({ heading, align }) => (
              <TableCell key={heading} align={align}>
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {voteEvents.map((voteEvent) => (
            <VoteEventRow
              key={voteEvent.id}
              voteEvent={voteEvent}
              mutate={mutate}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default VoteEventTable;
