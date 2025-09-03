import { isValidUsername } from "./username";

describe("isValidUsername", () => {
  describe("valid usernames", () => {
    it("accepts minimum length (2)", () => {
      expect(isValidUsername("ab")).toBe(true);
    });

    it("accepts maximum length (40)", () => {
      const forty = "a".repeat(39) + "b";
      expect(isValidUsername(forty)).toBe(true);
    });

    it("accepts letters, digits, and single hyphens", () => {
      expect(isValidUsername("a1b2c3")).toBe(true);
      expect(isValidUsername("alpha-1")).toBe(true);
      expect(isValidUsername("alpha-beta")).toBe(true);
    });

    it("accepts trailing hyphen (current implementation)", () => {
      expect(isValidUsername("alpha-")).toBe(true);
    });
  });

  describe("invalid usernames", () => {
    it("rejects too short (<2)", () => {
      expect(isValidUsername("a")).toBe(false);
      expect(isValidUsername("")).toBe(false);
    });

    it("rejects too long (>40)", () => {
      const fortyOne = "a".repeat(41);
      expect(isValidUsername(fortyOne)).toBe(false);
    });

    it("rejects uppercase characters", () => {
      expect(isValidUsername("Abc")).toBe(false);
    });

    it("must start with a lowercase letter", () => {
      expect(isValidUsername("1abc")).toBe(false);
      expect(isValidUsername("-abc")).toBe(false);
    });

    it("rejects characters outside [a-z0-9-]", () => {
      expect(isValidUsername("ab_c")).toBe(false);
      expect(isValidUsername("ab.c")).toBe(false);
      expect(isValidUsername("ab c")).toBe(false);
      expect(isValidUsername("абв")).toBe(false);
      expect(isValidUsername("ábc")).toBe(false);
    });

    it("rejects consecutive hyphens", () => {
      expect(isValidUsername("alpha--beta")).toBe(false);
    });
  });
});
