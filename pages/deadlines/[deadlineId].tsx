import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import useFetch, { isError, isFetching } from "@/hooks/useFetch";
import { Deadline, Question } from "@/types/deadlines";
import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const DeadlineQuestions: NextPage = () => {
  const router = useRouter();
  const { deadlineId } = router.query;

  const { data, status } = useFetch<{
    deadline: Deadline;
    questions: Question[];
  }>({
    endpoint: `/deadlines/${deadlineId}/questions`,
  });

  return (
    <Body isLoading={isFetching(status)} isError={isError(status)}>
      <Typography>{data?.deadline.name}</Typography>
      <NoDataWrapper
        noDataCondition={!data?.questions || !data?.questions.length}
        fallback={<NoneFound message="No questions were found" />}
      >
        {data?.questions.map((question) => (
          <div key={question.id}>{question.question}</div>
        ))}
      </NoDataWrapper>
    </Body>
  );
};
export default DeadlineQuestions;
