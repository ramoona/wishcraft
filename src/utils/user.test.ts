import { getDaysUntilBirthday } from "./user";

const mockDateNow = jest.fn();
const originalDateNow = Date.now;

beforeAll(() => {
  Date.now = mockDateNow;
});

afterAll(() => {
  Date.now = originalDateNow;
});

describe("getDaysUntilBirthday", () => {
  beforeEach(() => {
    mockDateNow.mockClear();
  });

  it("should return null for nullish day or month", () => {
    expect(getDaysUntilBirthday({ dayOfBirth: null, monthOfBirth: null })).toBe(null);
    expect(getDaysUntilBirthday({ dayOfBirth: 1, monthOfBirth: null })).toBe(null);
    expect(getDaysUntilBirthday({ dayOfBirth: null, monthOfBirth: 1 })).toBe(null);
  });

  it("should return 0 if birthday is today", () => {
    mockDateNow.mockReturnValue(new Date(2021, 0, 15).getTime());

    const result = getDaysUntilBirthday({ dayOfBirth: 15, monthOfBirth: 1 });
    expect(result).toBe(0);
  });

  it("should return correct days for future birthday in same month", () => {
    mockDateNow.mockReturnValue(new Date(2021, 0, 15).getTime());

    const result = getDaysUntilBirthday({ dayOfBirth: 20, monthOfBirth: 1 });
    expect(result).toBe(5);
  });

  it("should return correct days for future birthday in different month", () => {
    mockDateNow.mockReturnValue(new Date(2021, 0, 15).getTime());

    const result = getDaysUntilBirthday({ dayOfBirth: 15, monthOfBirth: 3 });
    expect(result).toBe(59);
  });

  it("should return correct days for birthday next year when current birthday has passed", () => {
    mockDateNow.mockReturnValue(new Date(2021, 11, 20).getTime());

    const result = getDaysUntilBirthday({ dayOfBirth: 15, monthOfBirth: 1 });
    expect(result).toBe(26);
  });

  it("should handle leap year correctly", () => {
    mockDateNow.mockReturnValue(new Date(2024, 1, 28).getTime());

    const result = getDaysUntilBirthday({ dayOfBirth: 1, monthOfBirth: 3 });
    expect(result).toBe(2);
  });

  it("should handle non-leap year correctly", () => {
    mockDateNow.mockReturnValue(new Date(2023, 1, 28).getTime());

    const result = getDaysUntilBirthday({ dayOfBirth: 1, monthOfBirth: 3 });
    expect(result).toBe(1);
  });

  it("should return 1 for birthday tomorrow", () => {
    mockDateNow.mockReturnValue(new Date(2021, 0, 14).getTime());

    const result = getDaysUntilBirthday({ dayOfBirth: 15, monthOfBirth: 1 });
    expect(result).toBe(1);
  });

  it("should handle month boundary correctly", () => {
    mockDateNow.mockReturnValue(new Date(2021, 0, 31).getTime());

    const result = getDaysUntilBirthday({ dayOfBirth: 1, monthOfBirth: 2 });
    expect(result).toBe(1);
  });

  it("should handle year boundary correctly", () => {
    mockDateNow.mockReturnValue(new Date(2021, 11, 31).getTime());

    const result = getDaysUntilBirthday({ dayOfBirth: 1, monthOfBirth: 1 });
    expect(result).toBe(1);
  });

  it("should handle edge case of 31st day in months with 30 days", () => {
    mockDateNow.mockReturnValue(new Date(2021, 3, 30).getTime());

    const result = getDaysUntilBirthday({ dayOfBirth: 31, monthOfBirth: 5 });
    expect(result).toBe(31);
  });

  it("should calculate days until next year's birthday when current birthday has passed", () => {
    mockDateNow.mockReturnValue(new Date(2021, 2, 20).getTime());

    const result = getDaysUntilBirthday({ dayOfBirth: 15, monthOfBirth: 1 });
    expect(result).toBe(301);
  });

  it("should handle birthday that just passed", () => {
    mockDateNow.mockReturnValue(new Date(2021, 0, 16).getTime());

    const result = getDaysUntilBirthday({ dayOfBirth: 15, monthOfBirth: 1 });
    expect(result).toBe(364);
  });
});
