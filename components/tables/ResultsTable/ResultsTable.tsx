import NoneFound from "@/components/emptyStates/NoneFound";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { FETCH_STATUS, isFetching } from "@/hooks/useFetch";

import ResultRow from "@/components/tables/ResultsTable/ResultRow/ResultRow";
import Table from "@/components/tables/Table";
import { VoteEventResult } from "@/types/voteEvents";
import { FC, useState } from "react";
import SearchInput from "@/components/search/SearchInput";

type Props = {
  results: VoteEventResult[];
  status: FETCH_STATUS;
};

const resultsFactory = {
  generate: (results: VoteEventResult[]) => {
    const columnHeadings: { heading: string; align: "left" | "right" }[] = [
      { heading: "Project ID", align: "left" },
      { heading: "Project Name", align: "left" },
    ];

    if (results[0].rank) {
      columnHeadings.unshift({ heading: "Rank", align: "left" });
    }

    if (results[0].votes) {
      columnHeadings.push({ heading: "Votes", align: "left" });
    }

    if (results[0].points) {
      columnHeadings.push({ heading: "Points", align: "left" });
    }

    if (results[0].percentage) {
      columnHeadings.push({ heading: "Points Percentage", align: "left" });
    }

    const resultRows = results.map((result, idx) => {
      const { rank, project, votes, points, percentage } = result;
      return (
        <ResultRow
          key={idx}
          rank={rank}
          project={project}
          votes={votes}
          points={points}
          percentage={percentage}
        />
      );
    });

    return { columnHeadings, resultRows };
  },
};

const ResultsTable: FC<Props> = ({ results, status }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (searchText: string) => {
    setSearchText(searchText);
  };

  const filteredResults = results.filter(
    (result) =>
      result.project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      result.project.id.toString().includes(searchText)
  );

  const { columnHeadings, resultRows } =
    results.length > 0
      ? resultsFactory.generate(filteredResults)
      : { columnHeadings: [], resultRows: [] };

  return (
    <>
      <SearchInput
        id="search-results"
        label="Search name or ID"
        onChange={handleSearchChange}
      />
      <LoadingWrapper isLoading={isFetching(status)}>
        <NoDataWrapper
          noDataCondition={results.length === 0}
          fallback={<NoneFound title="" message="No results found" />}
        >
          <Table
            id="results-table"
            headings={columnHeadings}
            rows={resultRows}
          />
        </NoDataWrapper>
      </LoadingWrapper>
    </>
  );
};
export default ResultsTable;
