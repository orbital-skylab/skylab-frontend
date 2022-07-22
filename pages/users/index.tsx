import Body from "@/components/layout/Body";
import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import { PAGES } from "@/helpers/navigation";
import useAuth from "@/contexts/useAuth";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CurrentUserProfile: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(`${PAGES.USERS}/${user.id}`);
    } else {
      router.push(PAGES.LANDING);
    }
  }, [router, user]);

  return (
    <Body sx={{ display: "grid", placeItems: "center" }}>
      <LoadingSpinner />
    </Body>
  );
};

export default CurrentUserProfile;
