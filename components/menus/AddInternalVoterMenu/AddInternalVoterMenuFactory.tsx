import AddInternalVoterModalItem from "@/components/menus/AddInternalVoterMenuItem/AddInternalVoterModalItem";
import ImportInternalVoterCsvModalItem from "@/components/menus/AddInternalVoterMenuItem/ImportInternalVoterCsvModalItem";
import InternalVoterRegistrationModalItem from "@/components/menus/AddInternalVoterMenuItem/InternalVoterRegistrationModalItem";
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
    {
      Component: InternalVoterRegistrationModalItem,
      key: "internal-voter-registration",
      getProps: (baseProps) => ({
        voteEventId: baseProps.voteEventId,
        voterManagement: baseProps.voterManagement,
        handleCloseMenu: baseProps.handleCloseMenu,
        mutateVoteEvent: baseProps.mutateVoteEvent,
      }),
    },
  ],
};

export const AddInternalVoterMenuFactory = createDynamicComponentFactory(
  internalVoterMenuConfig
);
