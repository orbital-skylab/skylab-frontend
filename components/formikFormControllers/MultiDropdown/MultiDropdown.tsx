import { ArrowDropDown } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Box,
  Chip,
  MenuItem,
  FormHelperText,
  Autocomplete,
  TextField,
} from "@mui/material";
import { FormikProps } from "formik";
import { useState } from "react";
import { DropdownOption } from "../Dropdown";

type Props<FormValuesType> = {
  id?: string;
  name: keyof FormValuesType;
  label: string;
  options: DropdownOption[];
  formik: FormikProps<FormValuesType>;
  size?: "medium" | "small";
  isCombobox?: boolean;
  isDisabled?: boolean;
  className?: string;
};

function MultiDropdown<FormValuesType>({
  id,
  name,
  label,
  options,
  formik,
  size,
  isCombobox,
  isDisabled = false,
  className,
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
          multiple
          disableCloseOnSelect
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value={values[name] as any}
          onChange={(_, newValues) => {
            // The newly selected value will be a DropdownOption object but the existing values will be the value primitives
            // Thus the DropdownOption objects need to be extracted into the primitves
            setFieldTouched(name as string, true);
            const extractedValues = newValues.map((value) =>
              typeof value === "object" ? value.value : value
            );
            setFieldValue(name as string, extractedValues);
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
                className={`${props.className} multidropdown-option`}
              >
                {option.label}
              </li>
            );
          }}
          popupIcon={<ArrowDropDown className="multidropdown-button" />}
        />
        {!!errors[name] && !!touched[name] ? (
          <FormHelperText error>{errors[name]}</FormHelperText>
        ) : null}
      </FormControl>
    );
  }

  return (
    <FormControl>
      <InputLabel>{label}</InputLabel>
      <Select
        id={id}
        className={className}
        name={name as string}
        multiple
        label={label}
        value={(values[name] as unknown as DropdownOption["value"][]) ?? []}
        onChange={handleChange}
        onBlur={handleBlur}
        input={<OutlinedInput label="Chip" />}
        disabled={isDisabled}
        renderValue={(selected: DropdownOption["value"][]) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={{ disableScrollLock: true }}
        size={size}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {!!errors[name] && !!touched[name] ? (
        <FormHelperText>{errors[name]}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
export default MultiDropdown;
