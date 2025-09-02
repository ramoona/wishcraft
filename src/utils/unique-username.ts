import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";

export function generateUniqueUsername() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "-",
    length: 2,
  });
}
