import { AllFormikValues } from "@/types/formikValues";
import {
  FormControlLabel,
  FormGroup,
  Checkbox as MuiCheckbox,
} from "@mui/material";
import { FormikProps } from "formik";
import { FC } from "react";

type Props = {
  label: string;
  name: string;
  formik: FormikProps<AllFormikValues>;
};

const Checkbox: FC<Props> = ({ label, name, formik }) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={<MuiCheckbox name={name} onChange={formik.handleChange} />}
        label={label}
      />
    </FormGroup>
  );
};
export default Checkbox;
