import type { NextPage } from "next";
import Navbar from "@/components/Navbar";
import Checkbox from "@/components/FormControllers/Checkbox";
import Body from "@/components/Body";
import { useFormik } from "formik";
import { Button } from "@mui/material";

const Home: NextPage = () => {
  const formik = useFormik({
    initialValues: { test: false },
    onSubmit: (values) => console.log(values),
  });

  return (
    <Body>
      <Button onClick={formik.submitForm}>Button</Button>
    </Body>
  );
};

export default Home;
