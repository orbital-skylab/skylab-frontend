// Components
import { LANDING_SIGN_IN_ID } from "@/components/Hero/HeroSignIn";
import { Button } from "@mui/material";
import Link from "next/link";
// Hooks
import { useRouter } from "next/router";
// Helpers
import { PAGES } from "@/helpers/navigation";

const SignInButton = () => {
  const router = useRouter();

  if (router.pathname === PAGES.LANDING) {
    return (
      <Button
        variant="contained"
        onClick={() => {
          if (router.pathname === PAGES.LANDING) {
            const heroSignIn = document.querySelector("#" + LANDING_SIGN_IN_ID);
            heroSignIn?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }}
      >
        Sign In
      </Button>
    );
  } else {
    return (
      <Link href={PAGES.LANDING} passHref>
        <Button variant="contained">Sign In</Button>
      </Link>
    );
  }
};

export default SignInButton;
