import { describe, expect, it } from "vitest";
import { formatCurrency, formatCurrencyInput, parseCurrencyInput, titleCase } from "./format";

describe("format utilities", () => {
  it("formats and parses currency inputs used by bidding", () => {
    expect(formatCurrency(49_000)).toBe("$49,000");
    expect(formatCurrency(null)).toBe("--");
    expect(formatCurrencyInput(48_100)).toBe("48,100");
    expect(parseCurrencyInput("$48,100")).toBe(48_100);
    expect(parseCurrencyInput("abc")).toBeNull();
  });

  it("title-cases machine-readable values for display", () => {
    expect(titleCase("single_speed")).toBe("Single Speed");
    expect(titleCase("clean title")).toBe("Clean Title");
  });

  it("preserves all-caps acronyms instead of lowercasing them", () => {
    expect(titleCase("SUV")).toBe("SUV");
    expect(titleCase("CVT")).toBe("CVT");
    expect(titleCase("4WD")).toBe("4WD");
  });
});
