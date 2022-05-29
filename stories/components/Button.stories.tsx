import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "@mui/material";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { options: ["contained", "outlined", "text"], control: "select" },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Contained = Template.bind({});
Contained.args = {
  variant: "contained",
  children: "Contained",
};

export const Outlined = Template.bind({});
Outlined.args = {
  variant: "outlined",
  children: "Outlined",
};

export const Text = Template.bind({});
Text.args = {
  variant: "text",
  children: "Text",
};
