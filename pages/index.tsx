import type { NextPage } from "next";
import Body from "@/components/Body";
import Select from "@/components/FormControllers/Select";
import { Formik } from "formik";
import { Button } from "@mui/material";
import { ApiServiceBuilder } from "@/helpers/api";
import useFetch from "@/hooks/useFetch";

interface Test {
  test: string;
}

const Home: NextPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, status } = useFetch<any>({ endpoint: "/users" });
  console.log(status, data);

  const initialValues: Test = { test: "" };
  const handleSubmit = async (values: Test) => {
    values;
    const apiServiceBuilder = new ApiServiceBuilder();
    apiServiceBuilder.setEndpoint("/users");
    const apiService = apiServiceBuilder.build();
    const res = await apiService();
    const data = await res.json();
    console.log(data);
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
