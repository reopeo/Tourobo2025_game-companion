export const Command = {
  UNLOCK: 0,
  TYPE_1_A: 1,
  TYPE_1_B: 2,
  TYPE_1_C: 3,
  TYPE_2_A: 4,
  TYPE_2_B: 5,
  TYPE_2_C: 6,
  TYPE_3_A: 7,
  TYPE_3_B: 8,
  TYPE_3_C: 9,
  V_GOAL: 10
} as const;

export interface UpdateScoreRequest {
  command: (typeof Command)[keyof typeof Command];
  data: number;
}

export interface UpdateScoreResponse {
  result: boolean;
}
