import { User } from "./users";

export type ForumPost = {
  id: number;
  title: string;
  body: string;
  userId: number;
  createdAt: string;
  category: string;
  user: {
    profilePicUrl: string;
    name: string;
  };
  isStickied: boolean;
};

export type ForumPostComment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  user: User;
  parentCommentId?: number;
  forumPostId: number;
};

export interface ForumPostWithCommentThreads extends ForumPost {
  postCommentThreads: ForumPostCommentThread[];
}

export type ForumPostCommentThread = ForumPostComment[];
