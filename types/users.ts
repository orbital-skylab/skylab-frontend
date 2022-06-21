export interface User {
  id: number;
  name: string;
  email: string;
  profilePicUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  personalSiteUrl?: string;
  selfIntro?: string;
}

export interface Student extends User {
  teamId: number;
  nusnetId: string;
  matricNo: string;
}

export interface Adviser extends User {
  placeholder?: string;
}

export interface Mentor extends User {
  placeholder?: string;
}

export interface Administator extends User {
  placeholder?: string;
}
export interface Facilitator extends User {
  placeholder?: string;
}
