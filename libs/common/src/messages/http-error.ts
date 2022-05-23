/**
 USC = UserController
 */

export const HttpErrorMessages = {
  USC_USERNAME_NOT_FOUND: ['Username not found'],
  USC_QUESTION_CHECK_MISSING: ['Question check missing'],
  USC_QUESTION_CHECK_CAN_NOT_BE_DECODED: ['Question can not be decoded'],
  USC_QUESTION_CHECK_WRONG_SIGNATURE: ['Question check was incorectly signed'],
  USC_USER_NOT_FOUND: ['User not found'],
  USC_QUESTION_CHECK_EXPIRED: ['Question check has expired'],
  USC_ANSWER_IS_INCORRECT: ['Answer is incorrect'],
  USC_AUTH_REQUIRED: ['This action requires authenticated access'],
  USC_BAD_UID: [
    'userId can be either',
    '"me" or a number',
    '"me" is a shortcut for the current user',
  ],

  $_UNKNOWN_ERROR: ['Unknown error'],
};
