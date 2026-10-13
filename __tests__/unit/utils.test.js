const clampRating = require("../../utils/utils");

describe("clampRating", () => {
  test("returns the rating when it is between 1 and 5", () => {
    expect(clampRating(3)).toBe(3);
  });

  test("clamps ratings below 1 to 1", () => {
    expect(clampRating(0)).toBe(1);
    expect(clampRating(-5)).toBe(1);
  });

  test("clamps ratings above 5 to 5", () => {
    expect(clampRating(6)).toBe(5);
    expect(clampRating(10)).toBe(5);
  });

  test("allows the boundary values", () => {
    expect(clampRating(1)).toBe(1);
    expect(clampRating(5)).toBe(5);
  });

  // There is a gap in this testing, but what is it???
});