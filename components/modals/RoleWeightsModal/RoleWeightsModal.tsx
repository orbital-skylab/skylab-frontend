import TextInput from "@/components/formikFormControllers/TextInput";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { ERRORS } from "@/helpers/errors";
import useApiCall from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import {
  EditVoteEventResponse,
  GetVoteEventResponse,
  HTTP_METHOD,
} from "@/types/api";
import { VoteEvent } from "@/types/voteEvents";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import { Dispatch, FC, SetStateAction } from "react";
import * as Yup from "yup";
import Modal from "../Modal";

export type RoleWeightsFormValuesType = {
  studentWeight: string;
  adviserWeight: string;
  mentorWeight: string;
  administratorWeight: string;
  publicWeight: string;
};

type Props = {
  voteEvent: VoteEvent;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetVoteEventResponse>;
};

const RoleWeightsModal: FC<Props> = ({ voteEvent, open, setOpen, mutate }) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const { resultsFilter } = voteEvent;

  const editWeightsFilter = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/vote-events/${voteEvent.id}`,
    onSuccess: ({ voteEvent }: EditVoteEventResponse) => {
      mutate(() => {
        return {
          voteEvent: {
            ...voteEvent,
          },
        };
      });
    },
  });

  const initialValues: RoleWeightsFormValuesType = {
    studentWeight: resultsFilter.studentWeight.toString(),
    adviserWeight: resultsFilter.adviserWeight.toString(),
    mentorWeight: resultsFilter.mentorWeight.toString(),
    administratorWeight: resultsFilter.administratorWeight.toString(),
    publicWeight: resultsFilter.publicWeight.toString(),
  };

  const handleSubmit = async (values: RoleWeightsFormValuesType) => {
    const processedValues = {
      voteEvent: {
        ...voteEvent,
        resultsFilter: {
          ...resultsFilter,
          studentWeight: parseInt(values.studentWeight),
          adviserWeight: parseInt(values.adviserWeight),
          mentorWeight: parseInt(values.mentorWeight),
          administratorWeight: parseInt(values.administratorWeight),
          publicWeight: parseInt(values.publicWeight),
        },
      },
    };

    try {
      await editWeightsFilter.call(processedValues);
      setSuccess(`Successfully updated role weights`);
      setOpen(false);
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Modal
      id="role-weights-modal"
      open={open}
      handleClose={handleCloseModal}
      title={`Role Weights`}
      subheader={`If a user has multiple roles, the highest priority role in order of Administrator, 
      Mentor, Advisor and Student will be assigned. External voters will be assigned the Public role.`}
    >
      <Typography marginBottom={2}>
        <strong>Points per vote = weight * vote</strong>
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={roleWeightsValidationSchema}
      >
        {(formik) => (
          <>
            <Stack direction="column" spacing="1rem">
              <TextInput
                id="administrator-weight-input"
                name="administratorWeight"
                label="Administrator Weight"
                size="small"
                formik={formik}
              />
              <TextInput
                id="mentor-weight-input"
                name="mentorWeight"
                label="Mentor Weight"
                size="small"
                formik={formik}
              />
              <TextInput
                id="adviser-weight-input"
                name="adviserWeight"
                label="Adviser Weight"
                size="small"
                formik={formik}
              />
              <TextInput
                id="student-weight-input"
                name="studentWeight"
                label="Student Weight"
                size="small"
                formik={formik}
              />
              <TextInput
                id="public-weight-input"
                name="publicWeight"
                label="Public Weight"
                size="small"
                formik={formik}
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              marginTop="2rem"
            >
              <Button
                id="role-weights-return-button"
                size="small"
                onClick={handleCloseModal}
              >
                Return
              </Button>

              <LoadingButton
                id="save-role-weights-button"
                size="small"
                variant="contained"
                onClick={formik.submitForm}
                disabled={formik.isSubmitting}
                loading={formik.isSubmitting}
              >
                Save
              </LoadingButton>
            </Stack>
          </>
        )}
      </Formik>
    </Modal>
  );
};
export default RoleWeightsModal;

const weightSchema = Yup.number()
  .typeError("Weight must be an integer")
  .integer("Weight must be an integer")
  .required(ERRORS.REQUIRED)
  .min(0, "Weight cannot be less than 0")
  .max(100, "Weight cannot be greater than 100");

const roleWeightsValidationSchema = Yup.object().shape({
  administratorWeight: weightSchema,
  mentorWeight: weightSchema,
  adviserWeight: weightSchema,
  studentWeight: weightSchema,
  publicWeight: weightSchema,
});
