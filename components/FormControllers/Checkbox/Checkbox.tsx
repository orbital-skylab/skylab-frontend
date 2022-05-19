import {
  FormControlLabel,
  FormGroup,
  Checkbox as MuiCheckbox,
} from "@mui/material";
import { FormikProps } from "formik";

type Props<FormValuesType> = {
  label: string;
  name: string;
  formik: FormikProps<FormValuesType>;
};

function Checkbox<FormValuesType>({
  label,
  name,
  formik,
}: Props<FormValuesType>) {
  return (
    <FormGroup>
      <FormControlLabel
        control={<MuiCheckbox name={name} onChange={formik.handleChange} />}
        label={label}
      />
    </FormGroup>
  );
}
export default Checkbox;
