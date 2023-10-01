import { Dispatch, FC, SetStateAction } from "react";
// Types
import {
  ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS,
  AddProjectsAndStudentsData,
} from "./BatchAddProjectsAndStudentsForm.types";
import { ADD_PROJECTS_AND_STUDENTS_CSV_DESCRIPTION } from "./BatchAddProjectsAndStudentsForm.helpers";
import BatchAddForm from "../BatchAddForm";

type Props = {
  setAddProjectsAndStudentsData: Dispatch<
    SetStateAction<AddProjectsAndStudentsData>
  >;
  handleAddProjectsAndStudents: () => void;
  handleClearProjectsAndStudents: () => void;
  isSubmitting: boolean;
};

const BatchAddStudentsForm: FC<Props> = ({
  setAddProjectsAndStudentsData,
  handleAddProjectsAndStudents,
  handleClearProjectsAndStudents,
  isSubmitting,
}) => {
  return (
    <BatchAddForm
      headers={Object.values(ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS)}
      description={ADD_PROJECTS_AND_STUDENTS_CSV_DESCRIPTION}
      setAddData={setAddProjectsAndStudentsData}
      handleAdd={handleAddProjectsAndStudents}
      handleClear={handleClearProjectsAndStudents}
      isSubmitting={isSubmitting}
    />
  );
};
export default BatchAddStudentsForm;
