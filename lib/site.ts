const DEFAULT_PORT = "3002";

export const port = process.env.PORT || DEFAULT_PORT;

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${DEFAULT_PORT}`;
