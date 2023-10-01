import { Box, FormControl, FormHelperText } from "@mui/material";
import { FormikProps } from "formik";
import dynamic from "next/dynamic";

type Props<FormValuesType> = {
  label?: string;
  id?: string;
  formik: FormikProps<FormValuesType>;
  name: keyof FormValuesType;
  height?: string;
  handleChange?: (value: string) => void;
};

// This is necessary as react-quill does not render properly in SSR environments
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

function RichTextEditor<FormValuesType>({
  id,
  formik,
  name,
  handleChange,
}: Props<FormValuesType>) {
  const { values, errors, setFieldValue, touched } = formik;

  return (
    <>
      <FormControl>
        <Box sx={{ width: "100%" }}>
          <ReactQuill
            id={id}
            theme="snow"
            value={values[name] as unknown as string}
            onChange={(e) => {
              setFieldValue(name as string, e);
              if (handleChange != undefined) {
                handleChange(e);
              }
            }}
          />
        </Box>
        {!!errors[name] && !!touched[name] ? (
          <FormHelperText error>{errors[name]}</FormHelperText>
        ) : null}
      </FormControl>
    </>
  );
}
export default RichTextEditor;
