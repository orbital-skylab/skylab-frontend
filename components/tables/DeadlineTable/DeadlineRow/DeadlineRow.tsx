import { FC, useState } from "react";
// Components
import { Button, TableCell, TableRow } from "@mui/material";
// Helpers
import {
  formatDateForDateTimeLocalInput,
  formatFullDateWithTime,
} from "@/helpers/dates";
// Types
import { Deadline } from "@/types/deadlines";
import { Formik, FormikHelpers } from "formik";
import TextInput from "@/components/formControllers/TextInput";

interface EditDeadlineFormValuesType {
  name: string;
  dueBy: string;
}

type Props = { deadline: Deadline };

const DeadlineRow: FC<Props> = ({ deadline }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const initialValues: EditDeadlineFormValuesType = {
    name: deadline.name,
    dueBy: formatDateForDateTimeLocalInput(deadline.dueBy),
  };

  const handleSubmit = async (
    values: EditDeadlineFormValuesType,
    actions: FormikHelpers<EditDeadlineFormValuesType>
  ) => {
    const { name, dueBy } = values;
    alert("Submitted" + name + dueBy);
    actions.setSubmitting(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  if (isEditMode) {
    return (
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <TableRow>
            <TableCell>
              <TextInput name="name" formik={formik} size="small" />
            </TableCell>
            <TableCell>
              <TextInput
                name="dueBy"
                formik={formik}
                size="small"
                type="datetime-local"
              />
            </TableCell>
            <TableCell>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => {
                  toggleEditMode();
                  formik.resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={formik.submitForm}
              >
                Save
              </Button>
            </TableCell>
          </TableRow>
        )}
      </Formik>
    );
  }

  return (
    <TableRow>
      <TableCell>{deadline.name}</TableCell>
      <TableCell>{formatFullDateWithTime(deadline.dueBy)}</TableCell>
      <TableCell>
        <Button
          size="small"
          variant="contained"
          color="warning"
          onClick={toggleEditMode}
        >
          Edit
        </Button>
        <Button size="small" variant="contained" color="error">
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};
export default DeadlineRow;
