export const RefereeCall = {
  RED: 0,
  BLUE: 1,
  NONE: 2,
} as const;

export interface EndMatchRequest {
  referee_call: (typeof RefereeCall)[keyof typeof RefereeCall];
}

export interface EndMatchResponse {
  result: boolean;
}
