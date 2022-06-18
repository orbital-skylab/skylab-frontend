import { DEADLINE_TYPE } from "@/types/deadlines";
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  Fade,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { Formik, FormikHelpers } from "formik";
import { Dispatch, FC, SetStateAction } from "react";

interface AddDeadlineFormValuesType {
  cohortYear: number;
  name: string;
  dueBy: string;
  type: DEADLINE_TYPE;
}

type Props = { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> };

const AddDeadlineModal: FC<Props> = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const initialValues: AddDeadlineFormValuesType = {
    cohortYear: 2022, // TODO: Link to cohort context
    name: "",
    dueBy: "",
    type: DEADLINE_TYPE.MILESTONE,
  };

  const handleSubmit = async (
    values: AddDeadlineFormValuesType,
    actions: FormikHelpers<AddDeadlineFormValuesType>
  ) => {
    const { name, dueBy, type, cohortYear } = values;
    alert("Submitted" + name + dueBy + type + cohortYear);
    actions.setSubmitting(false);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Fade in={open}>
            <Card
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <CardContent>
                <Container maxWidth="sm">
                  <Stack direction="column">
                    <Typography variant="h6">
                      Creating a new Deadline
                    </Typography>
                    <Button onClick={formik.submitForm}>Create</Button>
                  </Stack>
                </Container>
              </CardContent>
            </Card>
          </Fade>
        )}
      </Formik>
    </Modal>
  );
};
export default AddDeadlineModal;
