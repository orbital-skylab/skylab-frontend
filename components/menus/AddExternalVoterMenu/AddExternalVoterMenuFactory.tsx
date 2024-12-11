import AddExternalVoterModalItem from "@/components/menus/AddExternalVoterMenuItem/AddExternalVoterModalItem";
import ExternalVoterGenerationModalItem from "@/components/menus/AddExternalVoterMenuItem/ExternalVoterGenerationModalItem";
import ImportExternalVoterCsvModalItem from "@/components/menus/AddExternalVoterMenuItem/ImportExternalVoterCsvModalItem";
import {
  createDynamicComponentFactory,
  FactoryConfig,
} from "@/helpers/factory";

const externalVoterMenuConfig: FactoryConfig = {
  items: [
    {
      Component: AddExternalVoterModalItem,
      key: "add-external-voter",
      getProps: (baseProps) => ({
        voteEventId: baseProps.voteEventId,
        handleCloseMenu: baseProps.handleCloseMenu,
        mutateExternalVoters: baseProps.mutateExternalVoters,
      }),
    },
    {
      Component: ImportExternalVoterCsvModalItem,
      key: "import-external-voter-csv",
      getProps: (baseProps) => ({
        voteEventId: baseProps.voteEventId,
        handleCloseMenu: baseProps.handleCloseMenu,
        mutateExternalVoters: baseProps.mutateExternalVoters,
      }),
    },
    {
      Component: ExternalVoterGenerationModalItem,
      key: "external-voter-generation",
      getProps: (baseProps) => ({
        voteEventId: baseProps.voteEventId,
        handleCloseMenu: baseProps.handleCloseMenu,
        mutateExternalVoters: baseProps.mutateExternalVoters,
      }),
    },
  ],
};

export const AddExternalVoterMenuFactory = createDynamicComponentFactory(
  externalVoterMenuConfig
);
