import { FormControlLabel, Switch as MUISwitch } from "@mui/material";
import { FormikProps } from "formik";

type Props<FormValuesType> = {
  label: string;
  name: keyof FormValuesType;
  formik: FormikProps<FormValuesType>;
  isDisabled?: boolean;
  labelPlacement?: "start";
};

function Switch<FormValuesType>({
  label,
  name,
  formik,
  isDisabled = false,
  labelPlacement,
}: Props<FormValuesType>) {
  const { values, handleChange, handleBlur } = formik;

  return (
    <FormControlLabel
      control={
        <MUISwitch
          color="secondary"
          size="small"
          value={values[name]}
          name={name as string}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isDisabled}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
    />
  );
}
export default Switch;
