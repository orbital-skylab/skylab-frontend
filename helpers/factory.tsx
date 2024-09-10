/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";

interface MenuItemConfig {
  Component: FC<any>;
  key: string;
  getProps: (baseProps: any) => any;
  condition?: (baseProps: any) => boolean; // Optional condition to include/exclude item
}

export interface FactoryConfig {
  items: MenuItemConfig[];
}

export const createDynamicComponentFactory = (config: FactoryConfig) => ({
  generateItems: (baseProps: any) => {
    return config.items
      .filter(
        (itemConfig) => !itemConfig.condition || itemConfig.condition(baseProps)
      )
      .map(({ Component, key, getProps }) => (
        <Component key={key} {...getProps(baseProps)} />
      ));
  },
});
