export const RefereeCall = {
  NONE: 0,
  RED: 1,
  BLUE: 2,
} as const;

export interface EndMatchRequest {
  referee_call: (typeof RefereeCall)[keyof typeof RefereeCall];
}

export interface EndMatchResponse {
  result: boolean;
}
