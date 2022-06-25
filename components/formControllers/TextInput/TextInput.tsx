import { TextField } from "@mui/material";
import { FormikProps } from "formik";

type Props<FormValuesType> = {
  label?: string;
  name: keyof FormValuesType;
  type?: "email" | "text" | "password" | "date" | "time" | "datetime-local";
  formik: FormikProps<FormValuesType>;
  multiline?: boolean;
  minRows?: number;
  size?: "medium" | "small";
};

function TextInput<FormValuesType>({
  label = "",
  type = "text",
  name,
  formik,
  multiline = false,
  minRows = 3,
  size = "medium",
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
      helperText={errors[name]}
      multiline={multiline}
      minRows={minRows}
      size={size}
      InputLabelProps={{
        shrink: type === "datetime-local" ? true : undefined,
      }}
    />
  );
}

export default TextInput;
