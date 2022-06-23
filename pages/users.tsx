import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import useCohort from "@/hooks/useCohort";
import { isFetching } from "@/hooks/useFetch";
import useInfiniteFetch, {
  createBottomOfPageRef,
} from "@/hooks/useInfiniteFetch";
import { Cohort } from "@/types/cohorts";
import { User } from "@/types/users";
import {
  Box,
  debounce,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Tabs,
  tabsClasses,
  TextField,
} from "@mui/material";
import type { NextPage } from "next";
import {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const users: User[] = [
  {
    id: 0,
    name: "Rayner",
    email: "raynerljm@u.nus.edu",
    student: {
      id: 1,
      cohortYear: 2022,
      projectId: 0,
      nusnetId: "e0572281",
      matricNo: "a0214871fx",
    },
  },
  {
    id: 1,
    name: "Zechary",
    email: "zecharyajw@u.nus.edu",
    adviser: {
      id: 23,
      cohortYear: 2022,
      projectIds: [0],
      nusnetId: "e0572281",
      matricNo: "a0214871fx",
    },
  },
  {
    id: 2,
    name: "Vijay",
    email: "nvjn@u.nus.edu",
    mentor: {
      id: 17,
      cohortYear: 2022,
      projectIds: [0],
    },
  },
];

const LIMIT = 50;

enum ROLES {
  ALL = "All",
  STUDENTS = "Students",
  ADVISERS = "Advisers",
  MENTORS = "Mentors",
}

const Users: NextPage = () => {
  const [selectedRole, setSelectedRole] = useState<ROLES>(ROLES.ALL);
  const [page, setPage] = useState(0);
  const [searchTextInput, setSearchTextInput] = useState(""); // The input value
  const [querySearch, setQuerySearch] = useState(""); // The debounced input value for searching
  const {
    cohorts,
    currentCohortYear,
    isLoading: isLoadingCohorts,
  } = useCohort();
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | undefined
  >(currentCohortYear);

  /** For fetching users based on filters */
  const memoQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohortYear,
      role: selectedRole,
      search: querySearch,
      limit: LIMIT,
    };
  }, [selectedCohortYear, selectedRole, querySearch]);
  const {
    data: usersTODO,
    status: fetchUsersStatus,
    hasMore,
  } = useInfiniteFetch<User>({
    endpoint: `/users`,
    queryParams: memoQueryParams,
    page,
  });

  /** Input Change Handlers */
  const handleTabChange = (event: SyntheticEvent, newRole: ROLES) => {
    setSelectedRole(newRole);
    setPage(0);
  };

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
    setPage(0);
  };

  const handleCohortYearChange = (e: SelectChangeEvent<number | null>) => {
    setSelectedCohortYear(e.target.value as Cohort["academicYear"]);
    setPage(0);
  };

  /** To fetch more projects when the bottom of the page is reached */
  const observer = useRef<IntersectionObserver | null>(null);
  const bottomOfPageRef = createBottomOfPageRef(
    isFetching(fetchUsersStatus),
    hasMore,
    setPage,
    observer
  );

  useEffect(() => {
    if (currentCohortYear) {
      setSelectedCohortYear(currentCohortYear);
    }
  }, [currentCohortYear]);

  return (
    <Body isLoading={isLoadingCohorts}>
      <Stack direction="column" mt="0.5rem" mb="1rem">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          mb={{ md: "0.5rem" }}
        >
          <TextField
            label="Search"
            value={searchTextInput}
            onChange={handleSearchInputChange}
            size="small"
          />
          <Select
            name="cohort"
            label="Cohort"
            value={selectedCohortYear}
            onChange={handleCohortYearChange}
            size="small"
          >
            {cohorts &&
              cohorts.map(({ academicYear }) => (
                <MenuItem key={academicYear} value={academicYear}>
                  {academicYear}
                </MenuItem>
              ))}
          </Select>
        </Stack>
        <Tabs
          value={selectedRole}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="project-level-tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: { color: "primary" },
            marginY: { xs: 2, md: 0 },
          }}
        >
          {Object.values(ROLES).map((level) => {
            return <Tab key={level} value={level} label={level} />;
          })}
        </Tabs>
      </Stack>
      <NoDataWrapper
        noDataCondition={users.length === 0}
        fallback={<NoneFound message="No such users found" />}
      >
        <div ref={bottomOfPageRef} />
        {isFetching(fetchUsersStatus) ? (
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              marginY: users.length === 0 ? "15vh" : 0,
            }}
          >
            <LoadingSpinner />
          </Box>
        ) : null}
      </NoDataWrapper>
    </Body>
  );
};
export default Users;
