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
  name: keyof FormValuesType;
  label: string;
  options: DropdownOption[];
  formik: FormikProps<FormValuesType>;
  size?: "medium" | "small";
  isCombobox?: boolean;
};

function MultiDropdown<FormValuesType>({
  name,
  label,
  options,
  formik,
  size,
  isCombobox,
}: Props<FormValuesType>) {
  /** For combobox */
  const [inputValue, setInputValue] = useState("");
  const { values, handleChange, handleBlur, errors, touched, setFieldValue } =
    formik;

  //TODO:
  if (isCombobox) {
    return (
      <Autocomplete
        multiple
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value={(values[name] as any) ?? []}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(event, newValues) => {
          setFieldValue(name as string, newValues);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={options}
        getOptionLabel={(option) => (option ? option.label : "")}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    );
  }

  return (
    <FormControl>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name as string}
        multiple
        label={label}
        value={(values[name] as unknown as DropdownOption["value"][]) ?? []}
        onChange={handleChange}
        onBlur={handleBlur}
        input={<OutlinedInput label="Chip" />}
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
