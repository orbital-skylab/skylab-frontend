import { ADD_EXTERNAL_VOTERS_CSV_DESCRIPTION } from "@/components/csvForms/BatchAddExternalVotersForm/BatchAddExternalVotersForm.helper";
import {
  ADD_EXTERNAL_VOTERS_CSV_HEADERS,
  AddExternalVotersData,
} from "@/components/csvForms/BatchAddExternalVotersForm/BatchAddExternalVotersForm.types";
import BatchAddForm from "@/components/csvForms/BatchAddForm";
import { Dispatch, SetStateAction } from "react";

type Props = {
  addExternalVotersData: AddExternalVotersData;
  setAddExternalVotersData: Dispatch<SetStateAction<AddExternalVotersData>>;
  handleAddExternalVoters: () => void;
  handleClearAddExternalVoters: () => void;
  isSubmitting: boolean;
};

const BatchAddExternalVotersForm = ({
  addExternalVotersData,
  setAddExternalVotersData,
  handleAddExternalVoters,
  handleClearAddExternalVoters,
  isSubmitting,
}: Props) => {
  return (
    <BatchAddForm
      headers={Object.values(ADD_EXTERNAL_VOTERS_CSV_HEADERS)}
      description={ADD_EXTERNAL_VOTERS_CSV_DESCRIPTION}
      addData={addExternalVotersData}
      setAddData={setAddExternalVotersData}
      handleAdd={handleAddExternalVoters}
      handleClear={handleClearAddExternalVoters}
      isSubmitting={isSubmitting}
    />
  );
};
export default BatchAddExternalVotersForm;
