import { TextField } from "@mui/material";
import { FormikProps } from "formik";

type Props<FormValuesType> = {
  label?: string;
  id?: string;
  name: keyof FormValuesType;
  type?: "email" | "text" | "password" | "date" | "time" | "datetime-local";
  formik: FormikProps<FormValuesType>;
  multiline?: boolean;
  minRows?: number;
  size?: "medium" | "small";
  disabled?: boolean;
};

function TextInput<FormValuesType>({
  label = "",
  type = "text",
  id,
  name,
  formik,
  multiline = false,
  minRows = 3,
  size = "medium",
  disabled = false,
}: Props<FormValuesType>) {
  const { values, errors, handleChange, handleBlur, touched } = formik;

  return (
    <TextField
      label={label}
      hiddenLabel={label === ""}
      type={type}
      value={values[name]}
      name={name as string}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!errors[name] && !!touched[name]}
      helperText={!!touched[name] && errors[name]}
      multiline={multiline}
      minRows={minRows}
      size={size}
      InputLabelProps={{
        shrink: type === "datetime-local" ? true : undefined,
      }}
      id={id}
      disabled={disabled}
    />
  );
}

export default TextInput;
