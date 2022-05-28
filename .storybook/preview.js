import { muiTheme } from "storybook-addon-material-ui";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: [
        "Introduction",
        "Documentation",
        [
          "Folder Structure",
          "Tech Stack",
          "Abstractions",
          "ESLint and Prettier",
          "Depedendencies",
          "Features",
          "Non Functional Requirements",
        ],
        "Components",
        ["Storybook"],
        "Timeline and Workflow",
        ["Team Structure", "Issue Tracking", "Git Workflow", "Conventions"],
      ],
    },
  },
};

export const decorators = [muiTheme()];
