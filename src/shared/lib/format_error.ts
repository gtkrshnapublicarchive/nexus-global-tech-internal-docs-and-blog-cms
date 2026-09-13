export interface FormIssue {
  field?: string;
  message: string;
}

export interface ParsedFeedback {
  summary: string;
  issues: FormIssue[];
}

export function parseErrorMessage(error: unknown): ParsedFeedback {
  if (!error) {
    return {
      summary: "An unexpected error occurred.",
      issues: [],
    };
  }

  const rawMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : JSON.stringify(error);

  // Try parsing stringified JSON (such as Zod issue arrays)
  const trimmed = rawMessage.trim();
  if (
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}"))
  ) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const issues: FormIssue[] = parsed.map((item) => {
          const fieldPath = Array.isArray(item.path)
            ? item.path.filter((p: unknown) => typeof p === "string").join(".")
            : item.field || undefined;
          return {
            field: fieldPath,
            message: item.message || "Invalid value provided.",
          };
        });

        return {
          summary: `Please review and correct ${issues.length} item${
            issues.length > 1 ? "s" : ""
          } before proceeding:`,
          issues,
        };
      }

      if (parsed && typeof parsed === "object" && parsed.message) {
        return {
          summary: String(parsed.message),
          issues: [],
        };
      }
    } catch {
      // Fall through to plain text parsing if JSON parse fails
    }
  }

  // Handle plain text error strings
  return {
    summary: rawMessage,
    issues: [],
  };
}
