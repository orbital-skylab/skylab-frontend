/* eslint-disable no-undef */
import { userHasRole, checkIfProjectsAdviser } from "./roles";
import "jest";
import { ROLES } from "@/types/roles";
import { User } from "@/types/users";
import { DeepPartial } from "./types";
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";

/** Helper function to generate a user with a role */
const generateUser = (
  role: ROLES | undefined
): DeepPartial<User> | undefined => {
  if (!role) {
    return role;
  }

  switch (role) {
    case ROLES.STUDENTS:
      return { id: 1, student: { id: 1 } };
    case ROLES.ADVISERS:
      return { id: 1, adviser: { id: 1 } };
    case ROLES.MENTORS:
      return { id: 1, mentor: { id: 1 } };
    case ROLES.ADMINISTRATORS:
      return { id: 1, administrator: { id: 1 } };

    default:
      break;
  }
};

/** Helper function to generate a project with specific attributes */
const generateProject = (
  attributes?: Record<string, unknown>
): DeepPartial<Project> => {
  return {
    id: 1,
    name: "Test Project",
    proposalPdf: "http://www.africau.edu/images/default/sample.pdf",
    students: [generateUser(ROLES.STUDENTS)],
    adviser: generateUser(ROLES.ADVISERS),
    mentor: generateUser(ROLES.MENTORS),
    achievement: LEVELS_OF_ACHIEVEMENT.VOSTOK,
    cohortYear: 2022,
    ...attributes,
  };
};

describe("#userHasRole", () => {
  it("can check a single student role", () => {
    const student = generateUser(ROLES.STUDENTS) as User;
    expect(userHasRole(student, ROLES.STUDENTS)).toBeTruthy();
    expect(userHasRole(student, ROLES.ADMINISTRATORS)).toBeFalsy();
  });

  it("can check a single adviser role", () => {
    const student = generateUser(ROLES.ADVISERS) as User;
    expect(userHasRole(student, ROLES.ADVISERS)).toBeTruthy();
    expect(userHasRole(student, ROLES.STUDENTS)).toBeFalsy();
  });

  it("can check a single mentor role", () => {
    const student = generateUser(ROLES.MENTORS) as User;
    expect(userHasRole(student, ROLES.MENTORS)).toBeTruthy();
    expect(userHasRole(student, ROLES.ADVISERS)).toBeFalsy();
  });

  it("can check a single administrator role", () => {
    const student = generateUser(ROLES.ADMINISTRATORS) as User;
    expect(userHasRole(student, ROLES.ADMINISTRATORS)).toBeTruthy();
    expect(userHasRole(student, ROLES.MENTORS)).toBeFalsy();
  });

  it("can check a single student role with multiple options", () => {
    const student = generateUser(ROLES.STUDENTS) as User;
    expect(
      userHasRole(student, [ROLES.STUDENTS, ROLES.ADMINISTRATORS])
    ).toBeTruthy();
    expect(userHasRole(student, ROLES.MENTORS)).toBeFalsy();
  });

  it("can check a single administrator role with multiple options", () => {
    const student = generateUser(ROLES.ADMINISTRATORS) as User;
    expect(
      userHasRole(student, [
        ROLES.ADMINISTRATORS,
        ROLES.ADMINISTRATORS,
        ROLES.ADMINISTRATORS,
        ROLES.ADVISERS,
      ])
    ).toBeTruthy();
    expect(userHasRole(student, ROLES.MENTORS)).toBeFalsy();
  });

  it("can check a single adviser role with no options", () => {
    const student = generateUser(ROLES.ADVISERS) as User;
    expect(userHasRole(student, [ROLES.ADVISERS])).toBeTruthy();
    expect(userHasRole(student, [])).toBeFalsy();
  });

  it("can check a non existing user", () => {
    const student = generateUser(undefined) as User;
    expect(userHasRole(student, [ROLES.ADVISERS])).toBeFalsy();
    expect(
      userHasRole(student, [ROLES.ADVISERS, ROLES.ADMINISTRATORS])
    ).toBeFalsy();
    expect(userHasRole(student, [])).toBeFalsy();
  });
});

describe("#checkIfProjectsAdviser", () => {
  it("can confirm that an adviser is a project's adviser", () => {
    const project = generateProject({ adviser: { adviserId: 1 } });
    const user = generateUser(ROLES.ADVISERS);
    expect(
      checkIfProjectsAdviser(project as Project, user as User)
    ).toBeTruthy();
  });

  it("can confirm that an adviser is NOT a project's adviser", () => {
    const project = generateProject({ adviser: { adviserId: 2 } });
    const user = generateUser(ROLES.ADVISERS);
    expect(
      checkIfProjectsAdviser(project as Project, user as User)
    ).toBeFalsy();
  });

  it("can confirm that an adviser is NOT an undefined project's adviser", () => {
    const user = generateUser(ROLES.ADVISERS);
    expect(checkIfProjectsAdviser(undefined, user as User)).toBeFalsy();
  });

  it("can confirm that an undefined user is NOT a project's adviser", () => {
    const project = generateProject({ adviser: { adviserId: 2 } });
    expect(checkIfProjectsAdviser(project as Project, undefined)).toBeFalsy();
  });

  it("can confirm that an undefined user is NOT an undefined project's adviser", () => {
    expect(checkIfProjectsAdviser(undefined, undefined)).toBeFalsy();
  });
});
