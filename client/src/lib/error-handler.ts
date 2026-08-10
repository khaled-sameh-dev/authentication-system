interface AppError {
  message: string;
  code?: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const appError = error as Partial<AppError>;

    if (appError.code) {
      switch (appError.code) {
        case "INVALID_CREDENTIALS":
          return "Invalid email or password";

        case "USER_NOT_FOUND":
          return "Account does not exist";

        case "NETWORK_ERROR":
          return "Network error. Try again later";

        default:
          return appError.message ?? "Something went wrong";
      }
    }

    if (appError.message) {
      return appError.message;
    }
  }

  return "Something went wrong. Please try again";
};
