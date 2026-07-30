import winston from "winston";
import { getCorrelationId } from "./correlationStore";

export const DEFAULT_SENSITIVE_KEYS = [
  "password",
  "token",
  "authorization",
  "refreshtoken",
  "secret",
  "creditcard",
  "cardnumber",
  "cvv",
];

export interface ISanitizeOptions {
  keys?: string[];
  pickOnly?: string[];
  omitKeys?: string[];
}

/**
 * دالة دائرية لتنظيف الكائنات من البيانات الحساسة مع دعم كامل للمرونة
 */
export const sanitizeObject = (
  obj: unknown,
  options: ISanitizeOptions = {},
): unknown => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  let effectiveKeys = options.keys || DEFAULT_SENSITIVE_KEYS;

  if (options.pickOnly && options.pickOnly.length > 0) {
    effectiveKeys = options.pickOnly;
  } else if (options.omitKeys && options.omitKeys.length > 0) {
    const omitSet = new Set(options.omitKeys.map((k) => k.toLowerCase()));
    effectiveKeys = effectiveKeys.filter((k) => !omitSet.has(k.toLowerCase()));
  }

  const sensitiveSet = new Set(effectiveKeys.map((k) => k.toLowerCase()));

  // التعامل مع الـ Arrays بأسلوب ريكيرسيف صحيح
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, options));
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (sensitiveSet.has(key.toLowerCase())) {
      sanitized[key] = "***REDACTED***";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value, options);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// Winston Custom Format للـ PII Redaction
export const createSanitizeFormat = (options?: ISanitizeOptions) => {
  return winston.format((info) => {
    return sanitizeObject(info, options) as typeof info;
  })();
};

// Winston Custom Format لإرفاق الـ Correlation ID تلقائياً
export const traceFormat = winston.format((info) => {
  const correlationId = getCorrelationId();
  if (correlationId) {
    info.correlationId = correlationId;
  }
  return info;
})();
