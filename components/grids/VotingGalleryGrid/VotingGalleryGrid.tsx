import VotingCard from "@/components/cards/VotingCard";
import NoneFound from "@/components/emptyStates/NoneFound";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { FETCH_STATUS, isFetching } from "@/hooks/useFetch";
import { Project } from "@/types/projects";
import { Grid } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  selectedCandidates: { [key: number]: boolean };
  candidates: Project[];
  status: FETCH_STATUS;
  setSelectedCandidates: Dispatch<SetStateAction<{ [key: number]: boolean }>>;
};

const VotingGalleryGrid: FC<Props> = ({
  selectedCandidates,
  candidates,
  status,
  setSelectedCandidates,
}: Props) => {
  return (
    <LoadingWrapper isLoading={isFetching(status)}>
      <NoDataWrapper
        noDataCondition={candidates === undefined || candidates.length === 0}
        fallback={<NoneFound message="No candidates found" />}
      >
        <div style={{ marginTop: "2rem" }}>
          <Grid id="voting-gallery-grid" container spacing={{ xs: 2, md: 4 }}>
            {candidates?.map((candidate) => (
              <Grid item key={candidate.id} xs={12} sm={6} md={3}>
                <VotingCard
                  isSelected={!!selectedCandidates[candidate.id]}
                  candidate={candidate}
                  setSelectedCandidates={setSelectedCandidates}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </NoDataWrapper>
    </LoadingWrapper>
  );
};

export default VotingGalleryGrid;
