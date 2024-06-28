import { ArrowDropDown } from "@mui/icons-material";
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
  isDisabled?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
};

function Dropdown<FormValuesType>({
  name,
  label,
  options,
  formik,
  size = "medium",
  isCombobox,
  isDisabled = false,
  className,
  id,
  style = {},
}: Props<FormValuesType>) {
  /** For combobox */
  const [inputValue, setInputValue] = useState("");

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = formik;

  if (isCombobox) {
    return (
      <FormControl>
        <Autocomplete
          id={id}
          className={className}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value={values[name] as any}
          onChange={(_, selectedOption) => {
            setFieldTouched(name as string);
            if (selectedOption) {
              setFieldValue(name as string, selectedOption.value);
            } else if (selectedOption === null || selectedOption === "") {
              setFieldValue(name as string, "");
            }
          }}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
          }}
          size={size}
          options={options}
          disabled={isDisabled}
          getOptionLabel={(option) => {
            /**
             * option could be:
             * 1. DropdownOption object (when rendering label in the dropdown)
             * 2. value primitive (when rendering selected chips)
             */
            const foundOption = options.find(
              (opt) =>
                opt.value ===
                (typeof option === "object" ? option.value : option)
            );
            return foundOption ? String(foundOption.label) : "";
          }}
          isOptionEqualToValue={(option, value) => {
            return option.value === value;
          }}
          renderInput={(params) => (
            <TextField {...params} label={label} value={values[name]} />
          )}
          renderOption={(props, option) => {
            return (
              <li
                {...props}
                id={`${option.value}-option`}
                className={`${props.className} dropdown-option`}
              >
                {option.label}
              </li>
            );
          }}
          popupIcon={<ArrowDropDown className="dropdown-button" />}
        />
        {!!errors[name] && !!touched[name] ? (
          <FormHelperText error>{errors[name]}</FormHelperText>
        ) : null}
      </FormControl>
    );
  }

  return (
    <>
      <FormControl size={size}>
        <InputLabel>{label}</InputLabel>
        <Select
          id={id}
          className={className}
          name={name as string}
          label={label}
          value={values[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          MenuProps={{ disableScrollLock: true }}
          size={size}
          disabled={isDisabled}
          style={style}
        >
          {options.map(({ value, label }) => (
            <MenuItem id={`${value}-option`} key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
        {!!errors[name] && !!touched[name] ? (
          <FormHelperText error>{errors[name]}</FormHelperText>
        ) : null}
      </FormControl>
    </>
  );
}
export default Dropdown;
