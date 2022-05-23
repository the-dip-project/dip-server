export type LoginQuestionCheckBody = {
  question: string;
  exp: number;
  userId: number;
};

export type LoginChallenge = {
  question: string;
  questionCheckBody: LoginQuestionCheckBody;
  questionCheck: string;
};
