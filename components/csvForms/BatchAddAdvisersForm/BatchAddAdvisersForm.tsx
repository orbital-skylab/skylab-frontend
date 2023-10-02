import { Dispatch, FC, SetStateAction } from "react";
// Components
// Types
import {
  ADD_ADVISERS_CSV_HEADERS,
  AddAdvisersData,
} from "./BatchAddAdvisersForm.types";
import BatchAddForm from "../BatchAddForm";
import { ADD_ADVISERS_CSV_DESCRIPTION } from "./BatchAddAdvisersForm.helpers";

type Props = {
  addAdvisersData: AddAdvisersData;
  setAddAdvisersData: Dispatch<SetStateAction<AddAdvisersData>>;
  handleAddAdvisers: () => void;
  handleClearAddAdvisers: () => void;
  isSubmitting: boolean;
};

const BatchAddStudentsForm: FC<Props> = ({
  addAdvisersData,
  setAddAdvisersData,
  handleAddAdvisers,
  handleClearAddAdvisers,
  isSubmitting,
}) => {
  return (
    <BatchAddForm
      headers={Object.values(ADD_ADVISERS_CSV_HEADERS)}
      description={ADD_ADVISERS_CSV_DESCRIPTION}
      addData={addAdvisersData}
      setAddData={setAddAdvisersData}
      handleAdd={handleAddAdvisers}
      handleClear={handleClearAddAdvisers}
      isSubmitting={isSubmitting}
    />
  );
};
export default BatchAddStudentsForm;
