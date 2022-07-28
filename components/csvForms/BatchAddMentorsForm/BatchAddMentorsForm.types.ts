import { MentorMetadata } from "@/types/mentors";
import { UserMetadata } from "@/types/users";

/**
 * The headers used to generate the CSV Template file for adding mentors
 */
export enum ADD_MENTORS_CSV_HEADERS {
  NAME = "Name",
  EMAIL = "Email",
  COHORT_YEAR = "Cohort Year",
}

/**
 * The data type that the student CSV data will be parsed into
 */
export type AddMentorsData = Record<ADD_MENTORS_CSV_HEADERS, string | number>[];

export type BatchAddMentorsRequestType = {
  count: number;
  mentors: {
    user: Omit<UserMetadata, "id">;
    mentor: Omit<MentorMetadata, "teamIds">;
  }[];
};
