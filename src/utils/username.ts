import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";

export function generateUniqueUsername() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "-",
    length: 2,
  });
}

export function isValidUsername(input: string): boolean {
  if (input.length < 2 || input.length > 40) return false;
  if (input !== input.toLowerCase()) return false;
  // must start with a letter
  if (!/^[a-z]/.test(input)) return false;
  // allowed chars: letters, digits, hyphens
  if (!/^[a-z0-9-]+$/.test(input)) return false;
  // no consecutive hyphens
  return !input.includes("--");
}
