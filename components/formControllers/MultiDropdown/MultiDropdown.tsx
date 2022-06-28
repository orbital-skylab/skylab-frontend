import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Box,
  Chip,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { FormikProps } from "formik";
import { DropdownOption } from "../Dropdown";

type Props<FormValuesType> = {
  name: keyof FormValuesType;
  label: string;
  options: DropdownOption[];
  formik: FormikProps<FormValuesType>;
  size?: "medium" | "small";
};

function MultiDropdown<FormValuesType>({
  name,
  label,
  options,
  formik,
  size,
}: Props<FormValuesType>) {
  const { values, handleChange, handleBlur, errors, touched } = formik;

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
