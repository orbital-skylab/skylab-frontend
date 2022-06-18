import { UserMetadata } from "./users";

export type AdministratorMetadata = {
  startDate: string;
  endDate: string;
};

export type Administrator = UserMetadata &
  AdministratorMetadata & { administratorId: number };
