import { errorResult, type ToolResult } from "./types.js";

export class QiitaAPIError extends Error {
  constructor(
    public statusCode: number,
    public statusText: string,
    public body: unknown
  ) {
    super(`Qiita API Error ${statusCode} ${statusText}`);
    this.name = "QiitaAPIError";
  }
}

export class QiitaAuthError extends QiitaAPIError {
  constructor(body: unknown) {
    super(401, "Unauthorized", body);
    this.name = "QiitaAuthError";
  }
}

export class QiitaNotFoundError extends QiitaAPIError {
  constructor(body: unknown) {
    super(404, "Not Found", body);
    this.name = "QiitaNotFoundError";
  }
}

export class QiitaRateLimitError extends QiitaAPIError {
  constructor(body: unknown) {
    super(429, "Too Many Requests", body);
    this.name = "QiitaRateLimitError";
  }
}

export function withErrorHandler(
  handler: (args: Record<string, unknown>) => Promise<ToolResult>
): (args: Record<string, unknown>) => Promise<ToolResult> {
  return async (args) => {
    try {
      return await handler(args);
    } catch (error) {
      if (error instanceof QiitaAuthError) {
        return errorResult(
          "Authentication failed. Please check your QIITA_ACCESS_TOKEN."
        );
      }
      if (error instanceof QiitaNotFoundError) {
        return errorResult("Resource not found.");
      }
      if (error instanceof QiitaRateLimitError) {
        return errorResult(
          "Rate limit exceeded. Please wait a moment and try again."
        );
      }
      if (error instanceof QiitaAPIError) {
        return errorResult(
          `Qiita API error (${error.statusCode}): ${JSON.stringify(error.body)}`
        );
      }
      if (error instanceof Error) {
        return errorResult(`Error: ${error.message}`);
      }
      return errorResult(`Unknown error: ${String(error)}`);
    }
  };
}
