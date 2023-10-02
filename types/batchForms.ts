export type WithDescriptionExampleValidator<T extends string> = Record<
  T,
  {
    description: string;
    example: string;
    validator: (value: string) => boolean | string;
  }
>;
