import Checkbox from "@/components/formikFormControllers/Checkbox";
import Dropdown from "@/components/formikFormControllers/Dropdown";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { PAGES } from "@/helpers/navigation";
import useApiCall from "@/hooks/useApiCall";
import useFetch, { Mutate, isFetching } from "@/hooks/useFetch";
import {
  EditVoterManagementResponse,
  GetVoteEventResponse,
  GetVoteEventsResponse,
  HTTP_METHOD,
} from "@/types/api";
import { VoterManagement } from "@/types/voteEvents";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import { Dispatch, FC, SetStateAction } from "react";
import * as Yup from "yup";
import Modal from "../Modal";

type EditVoterManagementFormValuesType = Omit<
  VoterManagement,
  "voteEventId"
> & {
  copyInternalVoteEventId: number | "";
  copyExternalVoteEventId: number | "";
};

type Props = {
  voteEventId: number;
  voterManagement: VoterManagement;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetVoteEventResponse>;
};

const VoterManagementConfigModal: FC<Props> = ({
  voteEventId,
  voterManagement,
  open,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const { voteEventId: voterManagementId, ...values } = voterManagement;

  const { data, status } = useFetch<GetVoteEventsResponse>({
    endpoint: PAGES.VOTING,
  });

  const editVoterManagement = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/vote-events/${voteEventId}/voter-management`,
    onSuccess: ({ voterManagement }: EditVoterManagementResponse) => {
      mutate((data) => {
        return {
          voteEvent: {
            ...data.voteEvent,
            voterManagement: voterManagement,
          },
        };
      });
    },
  });

  const initialValues: EditVoterManagementFormValuesType = {
    copyInternalVoteEventId: "",
    copyExternalVoteEventId: "",
    ...values,
  };

  const handleSubmit = async (values: EditVoterManagementFormValuesType) => {
    const processedValues = {
      voterManagement: {
        internalList: values.internalList || false,
        externalList: values.externalList || false,
        registration: values.registration || false,
        internalCsvImport: values.internalCsvImport || false,
        generation: values.generation || false,
        externalCsvImport: values.externalCsvImport || false,
      },
    };
    try {
      await editVoterManagement.call(processedValues);
      setSuccess("You have successfully edited the voter management config!");
      setOpen(false);
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    if (voterManagementId !== voteEventId) {
      setError("Initial config has to be saved before closing the modal");
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        title={`Edit Voter Management`}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={editVoterManagementValidationSchema}
        >
          {(formik) => (
            <>
              <Stack direction="column" spacing="1rem">
                <Checkbox
                  label="Internal List"
                  name="internalList"
                  formik={formik}
                />
                {formik.values.internalList && (
                  <>
                    <Typography variant="subtitle2">
                      Select additional methods to populate
                    </Typography>
                    <Stack direction="column" spacing="1rem" paddingLeft="2rem">
                      <Checkbox
                        label="Registration"
                        name="registration"
                        formik={formik}
                      />
                      <Checkbox
                        label="Import CSV"
                        name="internalCsvImport"
                        formik={formik}
                      />
                    </Stack>
                    <LoadingWrapper
                      isLoading={data === undefined && isFetching(status)}
                      loadingText="Loading vote events"
                    >
                      <Dropdown
                        label="Copy internal voters from another event"
                        name="copyInternalVoteEventId"
                        formik={formik}
                        options={
                          data?.voteEvents
                            ? data.voteEvents
                                .filter((voteEvent) => {
                                  return voteEvent.id !== voteEventId;
                                })
                                .map((voteEvent) => {
                                  return {
                                    label: `${voteEvent.id} - ${voteEvent.title}`,
                                    value: voteEvent.id,
                                  };
                                })
                            : []
                        }
                      />
                    </LoadingWrapper>
                  </>
                )}
                <Checkbox
                  label="External List"
                  name="externalList"
                  formik={formik}
                />
                {formik.values.externalList && (
                  <>
                    <Typography variant="subtitle2">
                      Select additional methods to populate
                    </Typography>
                    <Stack direction="column" spacing="1rem" paddingLeft="2rem">
                      <Checkbox
                        label="Auto id generation"
                        name="generation"
                        formik={formik}
                      />
                      <Checkbox
                        label="Import CSV"
                        name="externalCsvImport"
                        formik={formik}
                      />
                    </Stack>
                    <LoadingWrapper
                      isLoading={data === undefined && isFetching(status)}
                      loadingText="Loading vote events"
                    >
                      <Dropdown
                        label="Copy external voters from another event"
                        name="copyExternalVoteEventId"
                        formik={formik}
                        options={
                          data?.voteEvents
                            ? data.voteEvents
                                .filter((voteEvent) => {
                                  return voteEvent.id !== voteEventId;
                                })
                                .map((voteEvent) => {
                                  return {
                                    label: `${voteEvent.id} - ${voteEvent.title}`,
                                    value: voteEvent.id,
                                  };
                                })
                            : []
                        }
                      />
                    </LoadingWrapper>
                  </>
                )}
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                marginTop="2rem"
              >
                {voterManagementId === voteEventId && (
                  <Button size="small" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                )}
                <LoadingButton
                  id="confirm-edit-voter-management-config-button"
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
    </>
  );
};
export default VoterManagementConfigModal;

const editVoterManagementValidationSchema = Yup.object().shape(
  {
    internalList: Yup.bool().when("externalList", {
      is: false,
      then: Yup.bool().oneOf([true], "At least one list is required"),
    }),
    externalList: Yup.bool().when("internalList", {
      is: false,
      then: Yup.bool().oneOf([true], "At least one list is required"),
    }),
  },
  [["externalList", "internalList"]]
);
