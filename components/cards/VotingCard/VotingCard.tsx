import ImageCard from "@/components/cards/ImageCard/ImageCard";
import { Project } from "@/types/projects";
import { Button } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  candidate: Project;
  isSelected: boolean;
  isDisabled: boolean;
  setSelectedCandidates: Dispatch<SetStateAction<{ [key: number]: boolean }>>;
};

const VotingCard: FC<Props> = ({
  candidate,
  isSelected,
  isDisabled,
  setSelectedCandidates,
}: Props) => {
  const handleToggleSelected = () => {
    setSelectedCandidates((prevSelectedCandidates) => ({
      ...prevSelectedCandidates,
      [candidate.id]: !isSelected,
    }));
  };

  return (
    <ImageCard
      id={`${candidate.id}-candidate-card`}
      idDisplay={candidate.id.toString()}
      title={candidate.name}
      imageSrc={candidate.posterUrl}
      imgAlt={`${candidate.name} Poster`}
      hoverEffect={false}
      actionButton={
        <Button
          id={`candidate-${candidate.id}-vote-button`}
          variant={isSelected ? "outlined" : "contained"}
          size="small"
          onClick={handleToggleSelected}
          sx={{
            width: "100%",
            textTransform: "none",
            alignSelf: "center",
          }}
          disabled={isDisabled && !isSelected}
        >
          {isSelected ? "Voted" : "Vote"}
        </Button>
      }
    />
  );
};
export default VotingCard;
