import {
  FormControlLabel,
  FormGroup,
  Checkbox as MUICheckbox,
  FormHelperText,
} from "@mui/material";
import { FormikProps } from "formik";

type Props<FormValuesType> = {
  id?: string;
  label: string;
  name: keyof FormValuesType;
  formik: FormikProps<FormValuesType>;
};

function Checkbox<FormValuesType>({
  id,
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
            id={id}
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
