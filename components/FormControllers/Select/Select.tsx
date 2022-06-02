import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import { FormikProps } from "formik";
import { SelectOption } from "./Select.types";

type Props<FormValuesType> = {
  name: keyof FormValuesType;
  label: string;
  options: SelectOption[];
  formik: FormikProps<FormValuesType>;
};

function Select<FormValuesType>({
  name,
  label,
  options,
  formik,
}: Props<FormValuesType>) {
  const { values, handleChange, handleBlur, errors, touched } = formik;

  return (
    <>
      <FormControl>
        <InputLabel>{label}</InputLabel>
        <MuiSelect
          name={name as string}
          label={label}
          value={values[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          MenuProps={{ disableScrollLock: true }}
        >
          {options.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </MuiSelect>
        {!!errors[name] && !!touched[name] ? (
          <FormHelperText>{errors[name]}</FormHelperText>
        ) : null}
      </FormControl>
    </>
  );
}
export default Select;
