import { Dispatch, MutableRefObject, SetStateAction } from "react";

export const createBottomOfPageRef = (
  isLoading: boolean,
  hasMore: boolean,
  setPage: Dispatch<SetStateAction<number>>,
  observer: MutableRefObject<IntersectionObserver | null>
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const intersecting = (node: any) => {
    if (isLoading) {
      return;
    }
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) {
      observer.current.observe(node);
    }
  };

  return intersecting;
};
