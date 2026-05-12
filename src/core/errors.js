export class CLIError extends Error {
  constructor(message, code = 'CLI_ERROR', meta = {}) {
    super(message);
    this.name = 'CLIError';
    this.code = code;
    this.meta = meta;
  }
}

export class AuthError extends CLIError {
  constructor(message = 'Authentication required. Run: ghc auth login') {
    super(message, 'AUTH_ERROR');
    this.name = 'AuthError';
  }
}

export class APIError extends CLIError {
  constructor(message, statusCode, data) {
    super(message, 'API_ERROR', { statusCode, data });
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

export class RateLimitError extends CLIError {
  constructor(resetTimestamp) {
    const resetAt = resetTimestamp
      ? new Date(resetTimestamp * 1000).toLocaleTimeString()
      : 'soon';
    super(`GitHub API rate limit exceeded. Resets at ${resetAt}`, 'RATE_LIMIT');
    this.name = 'RateLimitError';
    this.resetTimestamp = resetTimestamp;
  }
}

export class NotFoundError extends CLIError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends CLIError {
  constructor(message, issues = []) {
    super(message, 'VALIDATION_ERROR', { issues });
    this.name = 'ValidationError';
  }
}

export class NetworkError extends CLIError {
  constructor(message = 'Network error. Check your internet connection.') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}
