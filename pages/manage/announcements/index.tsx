import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
// Libraries
import { Button, MenuItem, Stack, TextField, debounce } from "@mui/material";
import { Add } from "@mui/icons-material";
// Components
import Body from "@/components/layout/Body";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import ManageAnnouncementCard from "@/components/cards/ManageAnnouncementCard";
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import useCohort from "@/contexts/useCohort";
import { useRouter } from "next/router";
// Types
import { Cohort } from "@/types/cohorts";
import { GetAnnouncementsResponse } from "@/types/api";
import { PAGES } from "@/helpers/navigation";

const Announcements: NextPage = () => {
  const router = useRouter();
  const { cohorts, currentCohortYear } = useCohort();
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | ""
  >("");
  const [searchTextInput, setSearchTextInput] = useState("");
  const [querySearch, setQuerySearch] = useState("");

  const memoAnnouncementsQueryParams = useMemo(() => {
    return {
      cohortYear: currentCohortYear,
      search: querySearch,
    };
  }, [currentCohortYear, querySearch]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    data: announcementsResponse,
    status: fetchAnnouncementsStatus,
    mutate: mutateAnnouncements,
  } = useFetch<GetAnnouncementsResponse>({
    endpoint: `/announcements`,
    queryParams: memoAnnouncementsQueryParams,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetQuerySearch = useCallback(
    debounce((val) => {
      setQuerySearch(val);
    }, 500),
    []
  );

  const handleCohortYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCohortYear(Number(e.target.value) as Cohort["academicYear"]);
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTextInput(e.target.value);
    debouncedSetQuerySearch(e.target.value);
  };

  useEffect(() => {
    if (currentCohortYear) {
      setSelectedCohortYear(currentCohortYear);
    }
  }, [currentCohortYear]);

  return (
    <>
      <Body>
        <AutoBreadcrumbs />
        <Stack
          direction="row"
          justifyContent="start"
          sx={{
            gap: "0.5rem",
            mb: "0.5rem",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            id="create-announcement-button"
            onClick={() => {
              router.push(PAGES.MANAGE_ANNOUNCEMENTS_ADD);
            }}
          >
            <Add fontSize="small" sx={{ marginRight: "0.2rem" }} />
            Announcement
          </Button>
          <TextField
            label="Cohort"
            value={selectedCohortYear}
            onChange={handleCohortYearChange}
            select
            sx={{
              ml: "auto",
            }}
            size="small"
          >
            {cohorts &&
              cohorts.map(({ academicYear }) => (
                <MenuItem key={academicYear} value={academicYear}>
                  {academicYear}
                </MenuItem>
              ))}
          </TextField>
        </Stack>
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
          {/* TODO: If we want to add a filter for target audience roles */}
          {/* <TextField
            label="Target Audience Role"
            value={selectedTargetAudienceRole}
            onChange={handleTargetAudienceRoleChange}
            select
            size="small"
            sx={{ ml: "auto" }}
          >
            {targetAudienceRoles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField> */}
        </Stack>
        <LoadingWrapper
          isLoading={isFetching(fetchAnnouncementsStatus)}
          loadingText="Loading announcements..."
          fullScreen
        >
          <NoDataWrapper
            noDataCondition={Boolean(
              announcementsResponse &&
                (announcementsResponse.announcements === undefined ||
                  announcementsResponse.announcements.length === 0)
            )}
            fallback={<NoneFound message="No announcements found" />}
          >
            <LoadingWrapper isLoading={false}>
              <Stack gap="1rem">
                {announcementsResponse?.announcements.map((announcement) => (
                  <ManageAnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    mutate={mutateAnnouncements}
                  />
                ))}
              </Stack>
            </LoadingWrapper>
          </NoDataWrapper>
        </LoadingWrapper>
      </Body>
    </>
  );
};

export default Announcements;
