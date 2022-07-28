/* eslint-disable no-undef */
import {
  userHasRole,
  checkIfTeamsAdviser,
  toSingular,
  getUserRoles,
  getRoleId,
  generateAddUserOrRoleEmptyInitialValues,
} from "./roles";
import "jest";
import { ROLES, ROLES_WITH_ALL } from "@/types/roles";
import { User } from "@/types/users";
import { DeepPartial } from "./types";
import { LEVELS_OF_ACHIEVEMENT, Team } from "@/types/teams";

/** Helper function to generate a user with a role */
const generateUser = (role: ROLES | undefined): User => {
  if (!role) {
    return { id: 1 } as unknown as User;
  }
  switch (role) {
    case ROLES.STUDENTS:
      return {
        id: 1,
        student: { id: 2, nusnetId: "e2", matricNo: "a2" },
      } as unknown as User;
    case ROLES.ADVISERS:
      return {
        id: 1,
        adviser: { id: 3, nusnetId: "e3", matricNo: "a3" },
      } as unknown as User;
    case ROLES.MENTORS:
      return { id: 1, mentor: { id: 4 } } as unknown as User;
    case ROLES.ADMINISTRATORS:
      return { id: 1, administrator: { id: 5 } } as unknown as User;
  }
};

/** Helper function to add a role to a user */
const addRoleToUser = (role: ROLES, user: User): User => {
  switch (role) {
    case ROLES.STUDENTS:
      return { ...user, student: { id: 2 } } as unknown as User;
    case ROLES.ADVISERS:
      return { ...user, adviser: { id: 3 } } as unknown as User;
    case ROLES.MENTORS:
      return { ...user, mentor: { id: 4 } } as unknown as User;
    case ROLES.ADMINISTRATORS:
      return { ...user, administrator: { id: 5 } } as unknown as User;
  }
};

/** Helper function to generate a team with specific attributes */
const generateTeam = (
  attributes?: Record<string, unknown>
): DeepPartial<Team> => {
  return {
    id: 1,
    name: "Test Team",
    proposalPdf: "http://www.africau.edu/images/default/sample.pdf",
    students: [generateUser(ROLES.STUDENTS)],
    adviser: generateUser(ROLES.ADVISERS),
    mentor: generateUser(ROLES.MENTORS),
    achievement: LEVELS_OF_ACHIEVEMENT.VOSTOK,
    cohortYear: 2022,
    ...attributes,
  };
};

describe("#toSingular", () => {
  it("can convert a role into a singular", () => {
    expect(toSingular(ROLES.STUDENTS)).toBe("Student");
    expect(toSingular(ROLES.ADVISERS)).toBe("Adviser");
    expect(toSingular(ROLES.MENTORS)).toBe("Mentor");
    expect(toSingular(ROLES.ADMINISTRATORS)).toBe("Administrator");
    expect(toSingular(ROLES_WITH_ALL.STUDENTS)).toBe("Student");
    expect(toSingular(ROLES_WITH_ALL.ADVISERS)).toBe("Adviser");
    expect(toSingular(ROLES_WITH_ALL.MENTORS)).toBe("Mentor");
    expect(toSingular(ROLES_WITH_ALL.ADMINISTRATORS)).toBe("Administrator");
  });

  it("does not convert ALL or unprovided roles", () => {
    expect(toSingular(ROLES_WITH_ALL.ALL)).toBe("");
    expect(toSingular(null)).toBe("");
    expect(toSingular(undefined)).toBe("");
  });
});

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
    expect(userHasRole(undefined, [ROLES.ADVISERS])).toBeFalsy();
    expect(
      userHasRole(undefined, [ROLES.ADVISERS, ROLES.ADMINISTRATORS])
    ).toBeFalsy();
    expect(userHasRole(undefined, [])).toBeFalsy();
  });
});

describe("#getUserRoles", () => {
  it("can retrieve a user's student role", () => {
    const student = generateUser(ROLES.STUDENTS);
    expect(getUserRoles(student as User).length).toBe(1);
    expect(getUserRoles(student as User)[0]).toBe(ROLES.STUDENTS);
  });

  it("can retrieve a user's adviser role", () => {
    const adviser = generateUser(ROLES.ADVISERS);
    expect(getUserRoles(adviser as User).length).toBe(1);
    expect(getUserRoles(adviser as User)[0]).toBe(ROLES.ADVISERS);
  });

  it("can retrieve a user's mentor role", () => {
    const mentor = generateUser(ROLES.MENTORS);
    expect(getUserRoles(mentor as User).length).toBe(1);
    expect(getUserRoles(mentor as User)[0]).toBe(ROLES.MENTORS);
  });

  it("can retrieve a user's administrator role", () => {
    const administrator = generateUser(ROLES.ADMINISTRATORS);
    expect(getUserRoles(administrator as User).length).toBe(1);
    expect(getUserRoles(administrator as User)[0]).toBe(ROLES.ADMINISTRATORS);
  });

  it("can retrieve multiple of a user's role", () => {
    const administrator = generateUser(ROLES.ADMINISTRATORS);
    const studentAndAdministrator = addRoleToUser(
      ROLES.STUDENTS,
      administrator as User
    );
    expect(getUserRoles(studentAndAdministrator as User).length).toBe(2);
    expect(getUserRoles(studentAndAdministrator as User)[0]).toBe(
      ROLES.STUDENTS
    );
    expect(getUserRoles(studentAndAdministrator as User)[1]).toBe(
      ROLES.ADMINISTRATORS
    );
  });

  it("can retrieve none of a user's roles", () => {
    const userWithNoRoles = generateUser(undefined);
    expect(getUserRoles(userWithNoRoles as User).length).toBe(0);
  });
});

describe("#getRoleId", () => {
  it("can return the role ID", () => {
    expect(getRoleId(generateUser(ROLES.STUDENTS), ROLES.STUDENTS)).toBe(2);
    expect(getRoleId(generateUser(ROLES.ADVISERS), ROLES.ADVISERS)).toBe(3);
    expect(getRoleId(generateUser(ROLES.MENTORS), ROLES.MENTORS)).toBe(4);
    expect(
      getRoleId(generateUser(ROLES.ADMINISTRATORS), ROLES.ADMINISTRATORS)
    ).toBe(5);
  });

  it("can return an invalid id", () => {
    expect(getRoleId(undefined, ROLES.STUDENTS)).toBe(-1);
    expect(getRoleId(generateUser(ROLES.STUDENTS), null)).toBe(-1);
    expect(getRoleId(generateUser(ROLES.STUDENTS), ROLES.ADVISERS)).toBe(-1);
    expect(getRoleId(undefined, null)).toBe(-1);
  });
});

describe("#generateAddUserOrRoleEmptyInitialValues", () => {
  it("can generate values without a user", () => {
    const expected = {
      name: "",
      email: "",
      cohortYear: 2022,
      nusnetId: "",
      matricNo: "",
      teamId: "",
      teamIds: [],
      startDate: "",
      endDate: "",
    };
    expect(generateAddUserOrRoleEmptyInitialValues(2022)).toEqual(expected);
  });

  it("can generate values with a non-student and non-adviser user", () => {
    const expected = {
      name: "",
      email: "",
      cohortYear: 2022,
      nusnetId: "",
      matricNo: "",
      teamId: "",
      teamIds: [],
      startDate: "",
      endDate: "",
    };
    expect(
      generateAddUserOrRoleEmptyInitialValues(
        2022,
        generateUser(ROLES.ADMINISTRATORS)
      )
    ).toEqual(expected);
  });

  it("can generate values with a student", () => {
    const expected = {
      name: "",
      email: "",
      cohortYear: 2022,
      nusnetId: "e2",
      matricNo: "a2",
      teamId: "",
      teamIds: [],
      startDate: "",
      endDate: "",
    };
    expect(
      generateAddUserOrRoleEmptyInitialValues(
        2022,
        generateUser(ROLES.STUDENTS)
      )
    ).toEqual(expected);
  });

  it("can generate values with an adviser", () => {
    const expected = {
      name: "",
      email: "",
      cohortYear: 2022,
      nusnetId: "e3",
      matricNo: "a3",
      teamId: "",
      teamIds: [],
      startDate: "",
      endDate: "",
    };
    expect(
      generateAddUserOrRoleEmptyInitialValues(
        2022,
        generateUser(ROLES.ADVISERS)
      )
    ).toEqual(expected);
  });

  it("can generate values with a student and adviser (prioritizes student)", () => {
    const expected = {
      name: "",
      email: "",
      cohortYear: 2022,
      nusnetId: "e3",
      matricNo: "a3",
      teamId: "",
      teamIds: [],
      startDate: "",
      endDate: "",
    };
    expect(
      generateAddUserOrRoleEmptyInitialValues(
        2022,
        addRoleToUser(ROLES.STUDENTS, generateUser(ROLES.ADVISERS))
      )
    ).toEqual(expected);
  });
});

describe("#checkIfTeamsAdviser", () => {
  it("can confirm that an adviser is a team's adviser", () => {
    const team = generateTeam({ adviser: { adviserId: 3 } });
    const user = generateUser(ROLES.ADVISERS);
    expect(checkIfTeamsAdviser(team as Team, user as User)).toBeTruthy();
  });

  it("can confirm that an adviser is NOT a team's adviser", () => {
    const team = generateTeam({ adviser: { adviserId: 2 } });
    const user = generateUser(ROLES.ADVISERS);
    expect(checkIfTeamsAdviser(team as Team, user as User)).toBeFalsy();
  });

  it("can confirm that an adviser is NOT an undefined team's adviser", () => {
    const user = generateUser(ROLES.ADVISERS);
    expect(checkIfTeamsAdviser(undefined, user as User)).toBeFalsy();
  });

  it("can confirm that an undefined user is NOT a team's adviser", () => {
    const team = generateTeam({ adviser: { adviserId: 2 } });
    expect(checkIfTeamsAdviser(team as Team, undefined)).toBeFalsy();
  });

  it("can confirm that an undefined user is NOT an undefined team's adviser", () => {
    expect(checkIfTeamsAdviser(undefined, undefined)).toBeFalsy();
  });
});
