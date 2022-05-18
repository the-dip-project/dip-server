export type LoginChallenge = {
  requestId: string;
  question: string;
  answer: string;
  presignedToken: string;
};
