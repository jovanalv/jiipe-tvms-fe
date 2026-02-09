export function parseRemoveSpecialCharacterAndTrim(input) {
  const cleaned = input.replace(/[^a-zA-Z0-9]+/g, "");
  return cleaned.trim();
}
