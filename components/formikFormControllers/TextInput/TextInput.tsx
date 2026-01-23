import React, { forwardRef } from "react";
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
  maxRows?: number;
  size?: "medium" | "small";
  disabled?: boolean;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  bordered?: boolean;
};

const TextInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Props<any>
>(function TextInput<FormValuesType>(
  {
    label = "",
    type = "text",
    id,
    name,
    formik,
    multiline = false,
    minRows = 3,
    maxRows,
    size = "medium",
    disabled = false,
    placeholder,
    onKeyDown,
    fullWidth,
    bordered = true,
  }: Props<FormValuesType>,
  ref: React.Ref<HTMLInputElement | HTMLTextAreaElement>
) {
  const { values, errors, handleChange, handleBlur, touched } = formik;

  const commonProps = {
    label,
    hiddenLabel: label === "",
    type,
    value: values[name],
    name: name as string,
    onChange: handleChange,
    onBlur: handleBlur,
    error: !!errors[name] && !!touched[name],
    helperText: !!touched[name] && errors[name],
    multiline,
    minRows,
    maxRows,
    size,
    id,
    disabled,
    placeholder,
    onKeyDown,
    fullWidth,
    inputRef: ref,
  };

  if (!bordered) {
    return (
      <TextField
        {...commonProps}
        variant="standard"
        InputProps={{ disableUnderline: true }}
      />
    );
  }

  return <TextField {...commonProps} variant="outlined" />;
});

export default TextInput;
