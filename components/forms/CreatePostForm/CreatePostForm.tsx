import { FormikProps } from "formik";
import { FC } from "react";
import TextInput from "@/components/formikFormControllers/TextInput";
import Dropdown from "@/components/formikFormControllers/Dropdown";
import { categoryType } from "@/helpers/forumpost";
import RichTextEditor from "@/components/formikFormControllers/RichTextEditor";

interface FormValues {
  title: string;
  body: string;
  category: string;
}

type Props = {
  formik: FormikProps<FormValues>;
};

const CreatePostForm: FC<Props> = ({ formik }) => {
  const filteredOptions = Object.entries(categoryType).map(([key, value]) => ({
    label: key,
    value: value,
  }));

  return (
    <>
      <TextInput
        id="post-title-input"
        name="title"
        type="text"
        label="Title"
        size="small"
        formik={formik}
      />
      <Dropdown
        id="post-category-input"
        label="Category"
        name="category"
        formik={formik}
        options={filteredOptions}
      />
      <RichTextEditor
        id="post-body-input"
        label="Body"
        name="body"
        formik={formik}
      />
    </>
  );
};

export default CreatePostForm;
