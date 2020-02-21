import { createError } from "apollo-errors";

const AuthorizationError = createError('AuthorizationError', {
  message: 'You are not authorized.'
});

const UserNotFound = createError('UserNotFound', {
  message: 'Invalid User'
});

module.exports = { AuthorizationError, UserNotFound };
