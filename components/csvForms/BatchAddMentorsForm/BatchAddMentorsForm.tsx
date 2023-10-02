import { Dispatch, FC, SetStateAction } from "react";
// Types
import {
  ADD_MENTORS_CSV_HEADERS,
  AddMentorsData,
} from "./BatchAddMentorsForm.types";
import BatchAddForm from "../BatchAddForm";
import { ADD_MENTORS_CSV_DESCRIPTION } from "./BatchAddMentorsForm.helpers";

type Props = {
  addMentorsData: AddMentorsData;
  setAddMentorsData: Dispatch<SetStateAction<AddMentorsData>>;
  handleAddMentors: () => void;
  handleClearAddMentors: () => void;
  isSubmitting: boolean;
};

const BatchAddMentorsForm: FC<Props> = ({
  addMentorsData,
  setAddMentorsData,
  handleAddMentors,
  handleClearAddMentors,
  isSubmitting,
}) => {
  return (
    <BatchAddForm
      headers={Object.values(ADD_MENTORS_CSV_HEADERS)}
      description={ADD_MENTORS_CSV_DESCRIPTION}
      addData={addMentorsData}
      setAddData={setAddMentorsData}
      handleAdd={handleAddMentors}
      handleClear={handleClearAddMentors}
      isSubmitting={isSubmitting}
    />
  );
};
export default BatchAddMentorsForm;
