export type AllFormikValues = FormikSignInValues | TestValues;
export interface FormikSignInValues {
  email: string;
  password: string;
}

export interface TestValues {
  test: string;
}
