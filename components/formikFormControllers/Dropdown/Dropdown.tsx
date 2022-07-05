import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FormikProps } from "formik";
import { useState } from "react";
import { DropdownOption } from "./Dropdown.types";

type Props<FormValuesType> = {
  name: keyof FormValuesType;
  label: string;
  options: DropdownOption[];
  formik: FormikProps<FormValuesType>;
  size?: "medium" | "small";
  isCombobox?: boolean;
};

function Dropdown<FormValuesType>({
  name,
  label,
  options,
  formik,
  size = "medium",
  isCombobox,
}: Props<FormValuesType>) {
  /** For combobox */
  const [inputValue, setInputValue] = useState("");
  const { values, handleChange, handleBlur, errors, touched, setFieldValue } =
    formik;

  if (isCombobox) {
    return (
      <Autocomplete
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value={values[name] as any}
        onChange={(_, selectedOption) => {
          if (selectedOption) {
            setFieldValue(name as string, selectedOption.value);
          }
        }}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={options}
        getOptionLabel={(option) => {
          /**
           * option could be:
           * 1. DropdownOption object (when rendering label in the dropdown)
           * 2. value primitive (when rendering selected chips)
           */
          const foundOption = options.find(
            (opt) =>
              opt.value === (typeof option === "object" ? option.value : option)
          );
          return foundOption ? String(foundOption.label) : "";
        }}
        isOptionEqualToValue={(option, value) => {
          return option.value === value;
        }}
        renderInput={(params) => (
          <TextField {...params} label={label} value={values[name]} />
        )}
      />
    );
  }

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
