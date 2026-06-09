declare module "fuse.js" {
  type FuseKey<T> =
    | keyof T
    | string
    | { name: keyof T | string; weight?: number };

  type FuseOptions<T> = {
    keys?: FuseKey<T>[];
    threshold?: number;
    ignoreLocation?: boolean;
  };

  type FuseResult<T> = {
    item: T;
    refIndex: number;
    score?: number;
    matches?: unknown[];
  };

  export default class Fuse<T> {
    constructor(list: readonly T[], options?: FuseOptions<T>);
    search(pattern: string): FuseResult<T>[];
  }
}
