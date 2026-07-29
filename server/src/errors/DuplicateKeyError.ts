import { AppError } from "./AppError";

export class DuplicateKeyError extends AppError {
  constructor(
    public readonly field: string,
    public readonly value: unknown,
  ) {
    super(`${field} already exists`, 409, "DUPLICATE_KEY");
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
      value: this.value,
    };
  }
}
