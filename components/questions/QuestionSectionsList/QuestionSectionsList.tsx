import { isSection } from "@/helpers/types";
import { UseAnswersActions } from "@/hooks/useAnswers";
import { generateIndexOffset } from "@/hooks/useAnswers/useAnswers.helpers";
import { LeanSection, Section } from "@/types/deadlines";
import { Answer } from "@/types/submissions";
import { LoadingButton } from "@mui/lab";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { FC } from "react";
import QuestionsList from "./QuestionsList";

type Props = {
  questionSections: (Section | LeanSection)[];
  answers: Map<Answer["questionId"], Answer["answer"]>;
  accessAnswersWithQuestionIndex?: boolean;
  answersActions: UseAnswersActions;
  submitAnswers: (options?: { isDraft: boolean }) => void;
  isSubmitting: boolean;
};

const QuestionSectionsList: FC<Props> = ({
  questionSections,
  answers,
  accessAnswersWithQuestionIndex,
  answersActions,
  submitAnswers,
  isSubmitting,
}) => {
  const { generateSetAnswer } = answersActions;

  const getSectionNumber = (section: Section | LeanSection, idx: number) => {
    if (isSection(section)) {
      return section.sectionNumber;
    } else if (idx !== undefined) {
      return idx + 1;
    } else {
      return -1;
    }
  };

  return (
    <Stack id="question-section-list-div" sx={{ gap: "2rem" }}>
      {questionSections.map((section: LeanSection, idx) => {
        const { name, desc, questions } = section;
        const sectionNumber = getSectionNumber(section, idx);
        // The amount to offset each question based on number of previous questions
        const indexOffset = accessAnswersWithQuestionIndex
          ? generateIndexOffset(questionSections, idx)
          : 0;

        return (
          <Card
            className="section-div"
            key={sectionNumber}
            sx={{
              borderLeft: 5,
              borderColor: "primary.main",
              position: "relative",
              overflow: "visible",
              marginTop: "2rem",
            }}
          >
            <Typography
              className="section-number-span"
              sx={{
                padding: "0.5rem 1rem",
                position: "absolute",
                bottom: "100%",
                backgroundColor: "primary.main",
                color: "white",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
              }}
              fontWeight={600}
            >{`Section ${sectionNumber} of ${questionSections.length}`}</Typography>
            <CardContent>
              <Stack spacing="0.5rem" marginBottom="1rem">
                <Typography
                  className="section-name-span"
                  fontWeight={600}
                  fontSize="1.2rem"
                >
                  {name
                    ? name
                    : "<Empty Section Name> (Will not be saved if a name is not provided)"}
                </Typography>
                {desc && (
                  <Typography
                    className="section-description-span"
                    variant="body1"
                  >
                    {desc}
                  </Typography>
                )}
              </Stack>

              <QuestionsList
                questions={questions}
                answers={answers}
                generateSetAnswer={generateSetAnswer}
                accessAnswersWithQuestionIndex={accessAnswersWithQuestionIndex}
                indexOffset={indexOffset}
              />
            </CardContent>
          </Card>
        );
      })}
      <Stack direction="row" justifyContent="end" gap="1rem">
        <Button onClick={() => submitAnswers({ isDraft: true })}>
          Save Draft
        </Button>
        <LoadingButton
          variant="contained"
          onClick={() => submitAnswers()}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Submit
        </LoadingButton>
      </Stack>
    </Stack>
  );
};
export default QuestionSectionsList;
