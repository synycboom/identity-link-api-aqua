export const isErrorObject = (err: unknown): err is Error =>
  err instanceof Error;
