import Body from "@/components/Body";
import {
  Button,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import Link from "next/link";

const ForgotPassword: NextPage = () => {
  return (
    <Body>
      <Container maxWidth="xs">
        <Stack gap="1rem">
          <TextField label="Email" />
          <Button variant="contained">Reset Password</Button>
          <Divider />
          <Typography textAlign="center">
            Already have an account?
            <br />
            <Link href="/sign-in">Sign in</Link>
          </Typography>
        </Stack>
      </Container>
    </Body>
  );
};
export default ForgotPassword;
