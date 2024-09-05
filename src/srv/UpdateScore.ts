export const Command = {
  IS_AUTO: 0,
  SEEDLINGS: 1,
  IMMIGRATION: 2,
  TYPE_1_A: 3,
  TYPE_1_B: 4,
  TYPE_2: 5,
  V_GOAL: 6,
} as const;

export interface UpdateScoreRequest {
  command: (typeof Command)[keyof typeof Command];
  data: number;
}

export interface UpdateScoreResponse {
  result: boolean;
}
