import NoneFound from "@/components/emptyStates/NoneFound";
import AddVoterModal from "@/components/modals/AddVoterModal";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import useFetch, { Mutate, isFetching } from "@/hooks/useFetch";
import { GetInternalVotersResponse, GetVoteEventResponse } from "@/types/api";
import { LIST_TYPES, VoterManagement } from "@/types/voteEvents";
import { Add } from "@mui/icons-material";
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FC, useState } from "react";
import InternalVoterRow from "./InternalVoterRow";

type Props = {
  voteEventId: number;
  voterManagement: VoterManagement;
  isRegistrationOpen: boolean;
  mutate: Mutate<GetVoteEventResponse>;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Email", align: "left" },
  { heading: "Actions", align: "right" },
];

const InternalVoterTable: FC<Props> = ({
  voteEventId,
  voterManagement,
  isRegistrationOpen,
  mutate,
}) => {
  const [isAddVoterOpen, setAddVoterOpen] = useState(false);

  const {
    data,
    status,
    mutate: mutateVoters,
  } = useFetch<GetInternalVotersResponse>({
    endpoint: `/vote-events/${voteEventId}/voter-management/internal-voters`,
  });

  const handleOpenAddVoterModal = () => {
    setAddVoterOpen(true);
  };

  return (
    <>
      <AddVoterModal
        voterManagement={voterManagement}
        selectedList={LIST_TYPES.INTERNAL_VOTERS}
        isRegistrationOpen={isRegistrationOpen}
        open={isAddVoterOpen}
        setOpen={setAddVoterOpen}
        mutateInternalVoters={mutateVoters}
        mutateExternalVoters={null}
        mutate={mutate}
      />
      <Stack
        direction="row"
        spacing={1}
        justifyContent="flex-end"
        sx={{ marginBottom: "1rem", marginTop: "1rem" }}
      >
        <Button
          id="add-voter-button"
          variant="outlined"
          size="small"
          onClick={handleOpenAddVoterModal}
        >
          <Add fontSize="small" sx={{ marginRight: "0.2rem" }} />
          {LIST_TYPES.INTERNAL_VOTERS}
        </Button>
      </Stack>
      <LoadingWrapper isLoading={isFetching(status)}>
        <NoDataWrapper
          noDataCondition={
            data?.internalVoters === undefined ||
            data?.internalVoters.length === 0
          }
          fallback={<NoneFound message="No internal voters found" />}
        >
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
                {data?.internalVoters &&
                  data?.internalVoters.map((internalVoter) => (
                    <InternalVoterRow
                      key={internalVoter.id}
                      voteEventId={voteEventId}
                      internalVoter={internalVoter}
                      mutate={mutateVoters}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </NoDataWrapper>
      </LoadingWrapper>
    </>
  );
};
export default InternalVoterTable;
