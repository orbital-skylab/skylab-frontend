export enum COHORTS {
  Y2022 = 2022,
  Y2021 = 2021,
}

export const COHORTS_VALUES = (
  Object.values(COHORTS).filter(
    (val: string | number) => typeof val === "number"
  ) as number[]
).sort((a: number, b: number) => b - a);
