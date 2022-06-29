import {
  ADD_MENTORS_CSV_HEADERS,
  AddMentorsData,
  BatchAddMentorsRequestType,
} from "./BatchAddMentorsForm.types";

export const processBatchAddMentorsData = (addMentorsData: AddMentorsData) => {
  const processedValues: BatchAddMentorsRequestType = {
    count: addMentorsData.length,
    mentors: addMentorsData.map((mentorData) => {
      return {
        user: {
          name: mentorData[ADD_MENTORS_CSV_HEADERS.NAME] as string,
          email: mentorData[ADD_MENTORS_CSV_HEADERS.EMAIL] as string,
        },
        mentor: {
          cohortYear: mentorData[ADD_MENTORS_CSV_HEADERS.COHORT_YEAR] as number,
        },
      };
    }),
  };

  return processedValues;
};
