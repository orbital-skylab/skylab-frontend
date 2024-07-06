import NoneFound from "@/components/emptyStates/NoneFound";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { FETCH_STATUS, isFetching } from "@/hooks/useFetch";

import ResultRow from "@/components/tables/ResultsTable/ResultRow/ResultsRow";
import Table from "@/components/tables/Table";
import { VoteEventResult } from "@/types/voteEvents";
import { FC } from "react";

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
      columnHeadings.push({ heading: "Point Percentage", align: "left" });
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
  const { columnHeadings, resultRows } =
    results.length > 0
      ? resultsFactory.generate(results)
      : { columnHeadings: [], resultRows: [] };

  return (
    <LoadingWrapper isLoading={isFetching(status)}>
      <NoDataWrapper
        noDataCondition={results.length === 0}
        fallback={<NoneFound title="" message="No Results found" />}
      >
        <Table id="votes-table" headings={columnHeadings} rows={resultRows} />
      </NoDataWrapper>
    </LoadingWrapper>
  );
};
export default ResultsTable;
