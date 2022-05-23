/**
 USC = UserController
 AGM = AuthGuardMiddleware
 DMC = DomainController
 */

export const HttpErrorMessages = {
  USC_USERNAME_NOT_FOUND: ['username not found'],
  USC_QUESTION_CHECK_MISSING: ['question check missing'],
  USC_QUESTION_CHECK_CAN_NOT_BE_DECODED: ['question can not be decoded'],
  USC_QUESTION_CHECK_WRONG_SIGNATURE: ['question check was incorectly signed'],
  USC_USER_NOT_FOUND: ['user not found'],
  USC_QUESTION_CHECK_EXPIRED: ['question check has expired'],
  USC_ANSWER_IS_INCORRECT: ['answer is incorrect'],
  USC_AUTH_REQUIRED: ['this action requires authenticated access'],
  USC_BAD_UID: [
    'userId can be either',
    '"me" or a number',
    '"me" is a shortcut for the current user',
  ],

  AGM_AUTH_TOKEN_NOT_FOUND: ['required auth token not found'],
  AGM_INVALID_TOKEN: ['invalid token'],
  AGM_CARRIED_USER_NOT_FOUND: ["user in token's payload not found"],

  DMC_DOMAIN_NOT_FOUND: ['domain not found'],
  DMC_DOMAIN_BELONGS_TO_OTHER_USER: ['domain belongs to other user'],
  DMC_DOMAIN_ALREADY_EXISTS: ['domain already exists'],

  $_UNKNOWN_ERROR: ['unknown error'],
};
