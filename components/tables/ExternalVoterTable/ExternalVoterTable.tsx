import NoneFound from "@/components/emptyStates/NoneFound";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import useFetch, { Mutate, isFetching } from "@/hooks/useFetch";
import { GetExternalVotersResponse, GetVoteEventResponse } from "@/types/api";
import { LIST_TYPES, VoterManagement } from "@/types/voteEvents";
import AddVoterModal from "@/components/modals/AddVoterModal";
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
import ExternalVoterRow from "./ExternalVoterRow";

type Props = {
  voteEventId: number;
  voterManagement: VoterManagement;
  mutate: Mutate<GetVoteEventResponse>;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Voter Id", align: "left" },
  { heading: "Actions", align: "right" },
];

const ExternalVoterTable: FC<Props> = ({
  voteEventId,
  voterManagement,
  mutate,
}) => {
  const [isAddVoterOpen, setAddVoterOpen] = useState(false);

  const {
    data,
    status,
    mutate: mutateVoters,
  } = useFetch<GetExternalVotersResponse>({
    endpoint: `/vote-events/${voteEventId}/voter-management/external-voters`,
  });

  const handleOpenAddVoterModal = () => {
    setAddVoterOpen(true);
  };

  return (
    <>
      <AddVoterModal
        voterManagement={voterManagement}
        selectedList={LIST_TYPES.EXTERNAL_VOTERS}
        isRegistrationOpen={false}
        open={isAddVoterOpen}
        setOpen={setAddVoterOpen}
        mutateInternalVoters={null}
        mutateExternalVoters={mutateVoters}
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
          {LIST_TYPES.EXTERNAL_VOTERS}
        </Button>
      </Stack>
      <LoadingWrapper isLoading={isFetching(status)}>
        <NoDataWrapper
          noDataCondition={
            data?.externalVoters === undefined ||
            data?.externalVoters.length === 0
          }
          fallback={<NoneFound message="No external voters found" />}
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
                {data?.externalVoters &&
                  data?.externalVoters.map((externalVoter) => (
                    <ExternalVoterRow
                      key={externalVoter.id}
                      externalVoter={externalVoter}
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
export default ExternalVoterTable;
