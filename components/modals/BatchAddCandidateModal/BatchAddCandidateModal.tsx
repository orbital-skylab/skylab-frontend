import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import Dropdown from "@/components/formikFormControllers/Dropdown";
import Modal from "@/components/modals/Modal";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { ERRORS } from "@/helpers/errors";
import useApiCall from "@/hooks/useApiCall";
import useFetch, { Mutate, isFetching } from "@/hooks/useFetch";
import {
  GetCandidatesResponse,
  GetCohortsResponse,
  HTTP_METHOD,
} from "@/types/api";
import { LEVELS_OF_ACHIEVEMENT_WITH_ALL } from "@/types/projects";
import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";
import { Formik } from "formik";
import { Dispatch, FC, SetStateAction } from "react";
import * as Yup from "yup";

type Props = {
  voteEventId: number;
  open: boolean;
  handleCloseMenu: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetCandidatesResponse>;
};

const BatchAddCandidateModal: FC<Props> = ({
  voteEventId,
  open,
  handleCloseMenu,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const { data: cohortsData, status } = useFetch<GetCohortsResponse>({
    endpoint: "/cohorts",
  });

  const batchAddCandidate = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/vote-events/${voteEventId}/candidates/batch`,
    onSuccess: ({ candidates }: GetCandidatesResponse) => {
      mutate(() => {
        const newCandidates = [...candidates];

        return { candidates: newCandidates };
      });
    },
  });

  const initialValues = {
    cohort: "",
    achievement: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await batchAddCandidate.call({
        cohort: parseInt(values.cohort),
        achievement: values.achievement,
      });
      setOpen(false);
      handleCloseMenu();
      setSuccess(
        `You have successfully added candidates of ${values.cohort} cohort and ${values.achievement} achievement!`
      );
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Modal
      id="batch-add-candidate-modal"
      open={open}
      handleClose={handleCloseModal}
      title="Batch Add Candidate"
      subheader={`Batch add projects from a specific cohort and achievement level as candidates. 
        This will perform a union of new candidates and existing candidates.`}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={batchAddCandidateValidationSchema}
      >
        {(formik) => (
          <>
            {isFetching(status) ? (
              <Stack justifyContent="center">
                <LoadingSpinner size={25} />
              </Stack>
            ) : (
              <Stack direction="row" marginTop="0.5rem" spacing={2}>
                <Dropdown
                  id="cohort-dropdown"
                  label="Cohort"
                  name="cohort"
                  formik={formik}
                  style={{ minWidth: "10rem" }}
                  options={
                    cohortsData
                      ? cohortsData.cohorts.map((cohort) => {
                          return {
                            label: `${cohort.academicYear}`,
                            value: cohort.academicYear,
                          };
                        })
                      : []
                  }
                />
                <Dropdown
                  id="achievement-dropdown"
                  label="Achievement"
                  name="achievement"
                  formik={formik}
                  style={{ minWidth: "10rem" }}
                  options={Object.values(LEVELS_OF_ACHIEVEMENT_WITH_ALL).map(
                    (achievement) => {
                      return {
                        label: achievement,
                        value: achievement,
                      };
                    }
                  )}
                />
              </Stack>
            )}
            <Stack
              direction="row"
              justifyContent="space-between"
              marginTop="1.5rem"
            >
              <Button
                id="batch-add-candidate-return-button"
                size="small"
                onClick={handleCloseModal}
                disabled={formik.isSubmitting}
              >
                Return
              </Button>
              <LoadingButton
                id="batch-add-candidate-button"
                size="small"
                variant="contained"
                onClick={formik.submitForm}
                disabled={formik.isSubmitting || isFetching(status)}
                loading={formik.isSubmitting}
              >
                Add
              </LoadingButton>
            </Stack>
          </>
        )}
      </Formik>
    </Modal>
  );
};
export default BatchAddCandidateModal;

const batchAddCandidateValidationSchema = Yup.object().shape({
  cohort: Yup.string().required(ERRORS.REQUIRED),
  achievement: Yup.string().required(ERRORS.REQUIRED),
});
