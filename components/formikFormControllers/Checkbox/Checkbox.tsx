import { Info } from "@mui/icons-material";
import {
  FormControlLabel,
  FormGroup,
  Checkbox as MUICheckbox,
  FormHelperText,
  Tooltip,
  IconButton,
} from "@mui/material";
import { FormikProps } from "formik";

type Props<FormValuesType> = {
  id?: string;
  label: string;
  name: keyof FormValuesType;
  info?: string;
  disabled?: boolean;
  formik: FormikProps<FormValuesType>;
};

function Checkbox<FormValuesType>({
  id,
  label,
  name,
  formik,
  info,
  disabled = false,
}: Props<FormValuesType>) {
  const { values, handleChange, handleBlur, errors, touched } = formik;

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <MUICheckbox
            checked={!!values[name]}
            name={name as string}
            onChange={handleChange}
            onBlur={handleBlur}
            id={id}
            disabled={disabled}
          />
        }
        label={
          info ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              {label}
              <Tooltip title={info}>
                <IconButton size="small" sx={{ ml: 1 }}>
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          ) : (
            label
          )
        }
      />
      {!!errors[name] && !!touched[name] ? (
        <FormHelperText>{errors[name]}</FormHelperText>
      ) : null}
    </FormGroup>
  );
}
export default Checkbox;
