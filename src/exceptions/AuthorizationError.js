const clientError = require('./ClientError');

class authorizationError extends clientError {
  constructor(message) {
    super(message, 403);
    this.name = 'authorizationError';
  }
}

module.exports = authorizationError;
