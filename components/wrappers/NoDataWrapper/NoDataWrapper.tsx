import { FC, ReactElement } from "react";

type Props = {
  noDataCondition: boolean;
  fallback: ReactElement;
};

const NoDataWrapper: FC<Props> = ({ children, noDataCondition, fallback }) => {
  if (noDataCondition) {
    return fallback;
  }

  return <>{children}</>;
};
export default NoDataWrapper;
