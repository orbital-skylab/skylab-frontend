import { AddUserFormValuesType } from "@/components/modals/AddUserModal/AddUserModal";
import { FormikProps } from "formik";
import { FC } from "react";

type Props = {
  formik: FormikProps<AddUserFormValuesType>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MentorDetailsForm: FC<Props> = ({ formik }) => {
  return (
    <>
      {/* TODO: Add more details if Mentors have more fields in the future */}
    </>
  );
};
export default MentorDetailsForm;
