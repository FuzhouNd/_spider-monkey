export type Payload = {
  action: string;
  params: any[];
};

export type ActionMap = {
  [key: string]: (context: unknown, ...params: unknown[]) => unknown;
};