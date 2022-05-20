import type { NextPage } from "next";
import Body from "@/components/Body";
import Select from "@/components/FormControllers/Select";
import { Formik } from "formik";
import { Button } from "@mui/material";

interface Test {
  test: string;
}

const Home: NextPage = () => {
  const initialValues: Test = { test: "" };
  const handleSubmit = (values: Test) => {
    console.log(values);
  };

  return (
    <Body>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <>
            <Select
              label="Test"
              name="test"
              options={[{ label: "1", value: "1" }]}
              formik={formik}
            />
            <Button onClick={formik.submitForm}>Submit</Button>
          </>
        )}
      </Formik>
    </Body>
  );
};

export default Home;
