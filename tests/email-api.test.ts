import { describe, it, expect } from "vitest";
import { accountInput } from "@/lib/validation";
describe("email API input", () => {
  it("rejects invalid login URL", () => expect(() => accountInput.parse({ email: "a@example.com", loginUrl: "javascript:alert(1)" })).toThrow());
  it("accepts minimal account", () => expect(accountInput.parse({ email: "a@example.com" }).email).toBe("a@example.com"));
});
