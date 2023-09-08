import { User } from "./users";

export const targetAudienceRoles = [
  "All",
  "Student",
  "Adviser",
  "Mentor",
] as const;

export type TargetAudienceRole = typeof targetAudienceRoles[number];

export type Announcement = {
  id: number;
  title: string;
  content: string;
  targetAudienceRole: TargetAudienceRole;
  createdAt: string;
  updatedAt: string;
  author: User;
  cohortYear: number;
  _count: {
    announcementComments: number;
  };
  announcementReadLogs: ReadLog[];
};

type ReadLog = {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export interface AnnouncementWithCommentThreads extends Announcement {
  announcementCommentThreads: AnnouncementCommentThread[];
}

export type AnnouncementComment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  author: User;
  parentCommentId?: number;
  announcementId: number;
};

export type AnnouncementCommentThread = AnnouncementComment[];
