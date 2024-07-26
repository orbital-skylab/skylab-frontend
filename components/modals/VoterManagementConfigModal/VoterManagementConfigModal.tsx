import Checkbox from "@/components/formikFormControllers/Checkbox";
import Dropdown from "@/components/formikFormControllers/Dropdown";
import SetVoterManagementConfigModal from "@/components/modals/SetVoterManagementConfigModal";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { PAGES } from "@/helpers/navigation";
import useApiCall from "@/hooks/useApiCall";
import useFetch, { Mutate, isFetching } from "@/hooks/useFetch";
import {
  EditVoteEventResponse,
  GetVoteEventResponse,
  GetVoteEventsResponse,
  HTTP_METHOD,
} from "@/types/api";
import { VoteEvent, VoterManagement } from "@/types/voteEvents";
import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";
import { Formik } from "formik";
import { Dispatch, FC, SetStateAction, useState } from "react";
import * as Yup from "yup";
import Modal from "../Modal";

export type EditVoterManagementFormValuesType = Omit<
  VoterManagement,
  "isRegistrationOpen"
> & {
  copyInternalVoteEventId: number | "";
  copyExternalVoteEventId: number | "";
};

type Props = {
  voteEvent: VoteEvent;
  voterManagement: VoterManagement;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetVoteEventResponse>;
};

const VoterManagementConfigModal: FC<Props> = ({
  voteEvent,
  voterManagement,
  open,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const { isRegistrationOpen, ...values } = voterManagement;
  const [isSetVoterManagementOpen, setIsSetVoterManagementOpen] =
    useState(false);
  const [voteEventData, setVoteEventData] = useState<{ voteEvent: VoteEvent }>({
    voteEvent,
  });

  const handleOpenSetVoterManagement = () => {
    setIsSetVoterManagementOpen(true);
  };

  const { data: allVoteEventData, status } = useFetch<GetVoteEventsResponse>({
    endpoint: PAGES.VOTE_EVENTS,
  });

  const setVoterManagement = useApiCall({
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
      setSuccess("You have successfully edited the voter management config!");
      setOpen(false);
    },
  });

  const initialValues: EditVoterManagementFormValuesType = {
    copyInternalVoteEventId: "",
    copyExternalVoteEventId: "",
    ...values,
  };

  const handleSubmit = async (values: EditVoterManagementFormValuesType) => {
    const processedValues = {
      voteEvent: {
        ...voteEvent,
        voterManagement: {
          hasInternalList: values.hasInternalList || false,
          hasExternalList: values.hasExternalList || false,
          isRegistrationOpen,
        },
      },
    };

    if (voteEvent.voterManagement) {
      setVoteEventData(processedValues);
      handleOpenSetVoterManagement();
      setOpen(false);
      return;
    }

    try {
      await setVoterManagement.call(processedValues);
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <SetVoterManagementConfigModal
        open={isSetVoterManagementOpen}
        processedValues={voteEventData}
        setOpen={setIsSetVoterManagementOpen}
        setOpenPrevious={setOpen}
        setVoterManagement={setVoterManagement}
      />
      <Modal
        id="edit-voter-management-config-modal"
        open={open}
        handleClose={handleCloseModal}
        title={`Edit Voter Management`}
        subheader="Select the lists below based on the type of voters you want 
        for this vote event. Internal voters are those with a Skylab account 
        while external voters are those that are given a voter ID to vote"
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
                  id="internal-list-checkbox"
                  label="Internal voter List"
                  name="hasInternalList"
                  formik={formik}
                />
                {formik.values.hasInternalList && (
                  <LoadingWrapper
                    isLoading={
                      allVoteEventData === undefined && isFetching(status)
                    }
                    loadingText="Loading vote events"
                  >
                    <Dropdown
                      id="copy-internal-voters-dropdown"
                      label="Copy internal voters from another event"
                      name="copyInternalVoteEventId"
                      formik={formik}
                      options={
                        allVoteEventData?.voteEvents
                          ? allVoteEventData.voteEvents
                              .filter((voteEvent) => {
                                return voteEvent.id !== voteEvent.id;
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
                )}
                <Checkbox
                  id="external-list-checkbox"
                  label="External voter List"
                  name="hasExternalList"
                  formik={formik}
                />
                {formik.values.hasExternalList && (
                  <LoadingWrapper
                    isLoading={
                      allVoteEventData === undefined && isFetching(status)
                    }
                    loadingText="Loading vote events"
                  >
                    <Dropdown
                      id="copy-external-voters-dropdown"
                      label="Copy external voters from another event"
                      name="copyExternalVoteEventId"
                      formik={formik}
                      options={
                        allVoteEventData?.voteEvents
                          ? allVoteEventData.voteEvents
                              .filter((voteEvent) => {
                                return voteEvent.id !== voteEvent.id;
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
                )}
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                marginTop="2rem"
              >
                <Button
                  id="cancel-edit-voter-management-config-button"
                  size="small"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>

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
