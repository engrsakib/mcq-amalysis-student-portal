export const PHONE_DIGIT_COUNT = 11;
export const PHONE_LENGTH_ERROR = "Phone number must be 11 digits.";

export function digitsOnly(value: string, maxLength = PHONE_DIGIT_COUNT) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

export function isValidPhone(phone: string) {
  return /^\d{11}$/.test(phone);
}
