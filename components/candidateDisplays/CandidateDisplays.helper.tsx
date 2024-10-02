/* eslint-disable @typescript-eslint/no-explicit-any */
import VotingForm from "@/components/forms/VotingForm";
import VotingGalleryGrid from "@/components/grids/VotingGalleryGrid";
import VoteCandidateTable from "@/components/tables/VoteCandidateTable";
import { DISPLAY_TYPES } from "@/types/voteEvents";

type DisplayOption = {
  component: React.ComponentType<any>;
  description: string;
};

export const DISPLAY_OPTIONS: Record<DISPLAY_TYPES, DisplayOption> = {
  [DISPLAY_TYPES.NONE]: {
    component: VotingForm,
    description:
      "No candidates will be displayed. Voters will have to enter the candidate ids into a textbox.",
  },
  [DISPLAY_TYPES.TABLE]: {
    component: VoteCandidateTable,
    description:
      "Display candidates in a tabular format with id and name shown.",
  },
  [DISPLAY_TYPES.GALLERY]: {
    component: VotingGalleryGrid,
    description:
      "Display candidates in a gallery grid with images of their posters, their names, and ids.",
  },
};
