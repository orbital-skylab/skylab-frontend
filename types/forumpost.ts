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
};
