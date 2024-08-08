import BatchAddForm from "@/components/csvForms/BatchAddForm";
import { ADD_INTERNAL_VOTERS_CSV_DESCRIPTION } from "@/components/csvForms/BatchAddInternalVotersForm/BatchAddInternalVotersForm.helper";
import {
  ADD_INTERNAL_VOTERS_CSV_HEADERS,
  AddInternalVotersData,
} from "@/components/csvForms/BatchAddInternalVotersForm/BatchAddInternalVotersForm.types";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  addInternalVotersData: AddInternalVotersData;
  setAddInternalVotersData: Dispatch<SetStateAction<AddInternalVotersData>>;
  handleAddInternalVoters: () => void;
  handleClearAddInternalVoters: () => void;
  isSubmitting: boolean;
};

const BatchAddInternalVotersForm: FC<Props> = ({
  addInternalVotersData,
  setAddInternalVotersData,
  handleAddInternalVoters,
  handleClearAddInternalVoters,
  isSubmitting,
}) => {
  return (
    <BatchAddForm
      headers={Object.values(ADD_INTERNAL_VOTERS_CSV_HEADERS)}
      description={ADD_INTERNAL_VOTERS_CSV_DESCRIPTION}
      addData={addInternalVotersData}
      setAddData={setAddInternalVotersData}
      handleAdd={handleAddInternalVoters}
      handleClear={handleClearAddInternalVoters}
      isSubmitting={isSubmitting}
    />
  );
};
export default BatchAddInternalVotersForm;
