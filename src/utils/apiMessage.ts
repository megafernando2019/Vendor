export function getApiMessage(
  data: Record<string, unknown> | null | undefined,
  fallback: string
): string {
  if (!data) return fallback;

  if (typeof data.message === "string" && data.message.trim().length > 0) {
    return data.message;
  }

  if (typeof data.error === "string" && data.error.trim().length > 0) {
    return data.error;
  }

  if (typeof data.error_description === "string" && data.error_description.trim()) {
    return data.error_description;
  }

  if (typeof data.msg === "string" && data.msg.trim()) {
    return data.msg;
  }

  const errors = data.errors;
  if (errors && typeof errors === "object") {
    for (const value of Object.values(errors)) {
      if (typeof value === "string" && value.trim()) return value;
      if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim()) {
        return value[0];
      }
    }
  }

  return fallback;
}
