import type { NextPage } from "next";
import Body from "@/components/layout/Body";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { GetAnnouncementsResponse } from "@/types/api";
import { TargetAudienceRole, targetAudienceRoles } from "@/types/announcements";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import useCohort from "@/contexts/useCohort";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import AnnouncementCard from "@/components/cards/AnnouncementCard.tsx";
import { MenuItem, Stack, TextField, debounce } from "@mui/material";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import useAuth from "@/contexts/useAuth";
import { userHasRole } from "@/helpers/roles";
import { ROLES } from "@/types/roles";

const Announcements: NextPage = () => {
  const { currentCohortYear } = useCohort();
  const [selectedTargetAudienceRole, setSelectedTargetAudienceRole] =
    useState<TargetAudienceRole>("All");
  const [searchTextInput, setSearchTextInput] = useState("");
  const [querySearch, setQuerySearch] = useState("");
  const { user, isLoading } = useAuth();

  /** For fetching users based on filters */
  const memoAnnouncementsQueryParams = useMemo(() => {
    return {
      cohortYear: currentCohortYear,
      targetAudienceRole: selectedTargetAudienceRole,
      search: querySearch,
    };
  }, [currentCohortYear, selectedTargetAudienceRole, querySearch]);

  const { data: announcementsResponse, status: announcementsStatus } =
    useFetch<GetAnnouncementsResponse>({
      endpoint: `/announcements`,
      queryParams: memoAnnouncementsQueryParams,
      enabled: Boolean(currentCohortYear),
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetQuerySearch = useCallback(
    debounce((val) => {
      setQuerySearch(val);
    }, 500),
    []
  );

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTextInput(e.target.value);
    debouncedSetQuerySearch(e.target.value);
  };

  const handleTargetAudienceRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedTargetAudienceRole(e.target.value as TargetAudienceRole);
  };

  const targetRolesToDisplay = targetAudienceRoles.filter((role) => {
    // Administrator should be able to view all target roles
    if (userHasRole(user, ROLES.ADMINISTRATORS)) {
      return true;
    }

    switch (role) {
      case "All":
        return true;
      case "Student":
        return userHasRole(user, ROLES.STUDENTS);
      case "Adviser":
        return userHasRole(user, ROLES.ADVISERS);
      case "Mentor":
        return userHasRole(user, ROLES.MENTORS);
    }
  });

  return (
    <Body isLoading={isLoading}>
      <Stack
        direction="row"
        justifyContent="start"
        sx={{
          gap: "0.5rem",
          my: "0.5rem",
        }}
      >
        <TextField
          label="Search"
          value={searchTextInput}
          onChange={handleSearchInputChange}
          size="small"
        />
        {targetRolesToDisplay.length > 1 ? (
          <TextField
            label="Target Audience Role"
            value={selectedTargetAudienceRole}
            onChange={handleTargetAudienceRoleChange}
            select
            size="small"
            sx={{ ml: "auto" }}
          >
            {targetRolesToDisplay.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
      </Stack>
      <NoDataWrapper
        noDataCondition={
          !announcementsResponse?.announcements ||
          !announcementsResponse?.announcements.length
        }
        fallback={<div>No announcements found</div>}
      >
        <LoadingWrapper isLoading={isFetching(announcementsStatus)}>
          <Stack gap="1rem">
            {announcementsResponse?.announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
              />
            ))}
          </Stack>
        </LoadingWrapper>
      </NoDataWrapper>
    </Body>
  );
};

export default Announcements;
