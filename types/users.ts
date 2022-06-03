export interface User {
  id: number;
  name: string;
  email: string;
  profilePicUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  personalSiteUrl?: string;
  selfIntro?: string;
  cohortId: number;
}

export interface Student {
  userId: number;
  teamId: number;
  nusnetId: string;
  matricNo: string;
  user: User;
}

export interface Adviser {
  user: User;
}

export interface Mentor {
  user: User;
}

export interface Administator {
  user: User;
}
export interface Facilitator {
  user: User;
}
