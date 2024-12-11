import AddInternalVoterModalItem from "@/components/menus/AddInternalVoterMenuItem/AddInternalVoterModalItem";
import ImportInternalVoterCsvModalItem from "@/components/menus/AddInternalVoterMenuItem/ImportInternalVoterCsvModalItem";
import {
  createDynamicComponentFactory,
  FactoryConfig,
} from "@/helpers/factory";

export const internalVoterMenuConfig: FactoryConfig = {
  items: [
    {
      Component: AddInternalVoterModalItem,
      key: "add-internal-voter",
      getProps: (baseProps) => ({
        voteEventId: baseProps.voteEventId,
        handleCloseMenu: baseProps.handleCloseMenu,
        mutateInternalVoters: baseProps.mutateInternalVoters,
      }),
    },
    {
      Component: ImportInternalVoterCsvModalItem,
      key: "import-internal-voter-csv",
      getProps: (baseProps) => ({
        voteEventId: baseProps.voteEventId,
        handleCloseMenu: baseProps.handleCloseMenu,
        mutateInternalVoters: baseProps.mutateInternalVoters,
      }),
    },
  ],
};

export const AddInternalVoterMenuFactory = createDynamicComponentFactory(
  internalVoterMenuConfig
);
