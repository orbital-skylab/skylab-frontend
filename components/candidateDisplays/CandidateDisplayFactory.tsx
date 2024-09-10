import VotingForm from "@/components/forms/VotingForm";
import VotingGalleryGrid from "@/components/grids/VotingGalleryGrid";
import VoteCandidateTable from "@/components/tables/VoteCandidateTable";
import {
  createDynamicComponentFactory,
  FactoryConfig,
} from "@/helpers/factory";
import { DISPLAY_TYPES } from "@/types/voteEvents";

const candidateDisplayConfig: FactoryConfig = {
  items: [
    {
      Component: VotingGalleryGrid,
      key: "voting-gallery-grid",
      getProps: (baseProps) => ({
        candidates: baseProps.candidates,
        selectedCandidates: baseProps.selectedCandidates,
        status: baseProps.status,
        setSelectedCandidates: baseProps.setSelectedCandidates,
      }),
      condition: (baseProps) =>
        baseProps.voteConfig.displayType === DISPLAY_TYPES.GALLERY,
    },
    {
      Component: VoteCandidateTable,
      key: "vote-candidate-table",
      getProps: (baseProps) => ({
        candidates: baseProps.candidates,
        selectedCandidates: baseProps.selectedCandidates,
        status: baseProps.status,
        setSelectedCandidates: baseProps.setSelectedCandidates,
      }),
      condition: (baseProps) =>
        baseProps.voteConfig.displayType === DISPLAY_TYPES.TABLE,
    },
    {
      Component: VotingForm,
      key: "voting-form",
      getProps: (baseProps) => ({
        setSelectedCandidates: baseProps.setSelectedCandidates,
      }),
      condition: (baseProps) =>
        baseProps.voteConfig.displayType === DISPLAY_TYPES.NONE,
    },
  ],
};

export const CandidateDisplayFactory = createDynamicComponentFactory(
  candidateDisplayConfig
);
