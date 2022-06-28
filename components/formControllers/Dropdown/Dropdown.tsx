import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FormikProps } from "formik";
import { DropdownOption } from "./Dropdown.types";

type Props<FormValuesType> = {
  name: keyof FormValuesType;
  label: string;
  options: DropdownOption[];
  formik: FormikProps<FormValuesType>;
  size?: "medium" | "small";
};

function Dropdown<FormValuesType>({
  name,
  label,
  options,
  formik,
  size = "medium",
}: Props<FormValuesType>) {
  const { values, handleChange, handleBlur, errors, touched } = formik;

  return (
    <>
      <FormControl>
        <InputLabel>{label}</InputLabel>
        <Select
          name={name as string}
          label={label}
          value={values[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          MenuProps={{ disableScrollLock: true }}
          size={size}
        >
          {options.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
        {!!errors[name] && !!touched[name] ? (
          <FormHelperText>{errors[name]}</FormHelperText>
        ) : null}
      </FormControl>
    </>
  );
}
export default Dropdown;
