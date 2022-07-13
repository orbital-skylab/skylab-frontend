import { isSection } from "@/helpers/types";
import { UseAnswersActions } from "@/hooks/useAnswers";
import { LeanSection, Section } from "@/types/deadlines";
import { Answer } from "@/types/submissions";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { FC } from "react";
import QuestionsList from "./QuestionsList";

type Props = {
  sections: (Section | LeanSection)[];
  answers: Record<Answer["questionId"], Answer["answer"]>;
  accessAnswersWithQuestionIndex?: boolean;
  answersActions: UseAnswersActions;
};

const QuestionSectionsList: FC<Props> = ({
  sections,
  answers,
  accessAnswersWithQuestionIndex,
  answersActions,
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
    <Stack sx={{ gap: "2rem" }}>
      {sections.map((section, idx) => {
        const { name, desc, questions } = section;
        const sectionNumber = getSectionNumber(section, idx);

        return (
          <Card
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
            >{`Section ${sectionNumber} of ${sections.length}`}</Typography>
            <CardContent>
              <Stack spacing="0.5rem" marginBottom="1rem">
                <Typography fontWeight={600} fontSize="1.2rem">
                  {name
                    ? name
                    : "<Empty Section Name> (Will not be saved if a name is not provided)"}
                </Typography>
                {desc && <Typography variant="body1">{desc}</Typography>}
              </Stack>

              <QuestionsList
                questions={questions}
                answers={answers}
                generateSetAnswer={generateSetAnswer}
                accessAnswersWithQuestionIndex={accessAnswersWithQuestionIndex}
                indexOffset={sections
                  .slice(0, idx)
                  .map((section) => section.questions.length)
                  .reduce((a, b) => a + b, 0)}
              />
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};
export default QuestionSectionsList;
