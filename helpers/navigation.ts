export enum PAGES {
  LANDING = "/",
  PROJECTS = "/projects",
  PROFILE = "/profile",
  FORGOT_PASSWORD = "/forgot-password",
}

export enum NAVBAR_ACTIONS {
  SIGN_OUT = "signOut",
}

export const NAVBAR_OPTIONS = [
  { label: "Profile", route: PAGES.PROFILE },
  { label: "Projects", route: PAGES.PROJECTS },
  { label: "Sign Out", action: NAVBAR_ACTIONS.SIGN_OUT },
];
