export function formatPhoneNumber(phoneNumber) {
  const digits = phoneNumber.replace(/\D/g, "");

  if (digits.length <= 4) return digits;
  if (digits.length <= 8) {
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  }

  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 13)}`;
}
