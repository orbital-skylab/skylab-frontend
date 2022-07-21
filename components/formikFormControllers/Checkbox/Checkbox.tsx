import {
  FormControlLabel,
  FormGroup,
  Checkbox as MUICheckbox,
  FormHelperText,
} from "@mui/material";
import { FormikProps } from "formik";

type Props<FormValuesType> = {
  label: string;
  name: keyof FormValuesType;
  formik: FormikProps<FormValuesType>;
};

function Checkbox<FormValuesType>({
  label,
  name,
  formik,
}: Props<FormValuesType>) {
  const { values, handleChange, handleBlur, errors, touched } = formik;

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <MUICheckbox
            checked={!!values[name]}
            name={name as string}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        }
        label={label}
      />
      {!!errors[name] && !!touched[name] ? (
        <FormHelperText>{errors[name]}</FormHelperText>
      ) : null}
    </FormGroup>
  );
}
export default Checkbox;
