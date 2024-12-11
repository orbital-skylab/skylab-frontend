import AddCandidateMenuItem from "@/components/menus/AddCandidateMenu/AddCandidateMenuItem";
import BatchAddCandidateMenuItem from "@/components/menus/AddCandidateMenu/BatchAddCandidateMenuItem";
import {
  createDynamicComponentFactory,
  FactoryConfig,
} from "@/helpers/factory";

const candidateMenuConfig: FactoryConfig = {
  items: [
    {
      Component: AddCandidateMenuItem,
      key: "add-candidate",
      getProps: (baseProps) => ({
        voteEventId: baseProps.voteEventId,
        handleCloseMenu: baseProps.handleCloseMenu,
        mutateCandidates: baseProps.mutateCandidates,
      }),
    },
    {
      Component: BatchAddCandidateMenuItem,
      key: "batch-add-candidate",
      getProps: (baseProps) => ({
        voteEventId: baseProps.voteEventId,
        handleCloseMenu: baseProps.handleCloseMenu,
        mutateCandidates: baseProps.mutateCandidates,
      }),
    },
  ],
};

export const AddCandidateMenuFactory =
  createDynamicComponentFactory(candidateMenuConfig);
