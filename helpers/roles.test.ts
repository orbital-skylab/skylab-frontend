/* eslint-disable no-undef */
import { userHasRole } from "./roles";
import { describe, expect } from "@jest/globals";
import { ROLES } from "@/types/roles";
import { User } from "@/types/users";
import { DeepPartial } from "./types";

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
