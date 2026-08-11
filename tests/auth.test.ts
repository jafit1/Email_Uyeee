import { describe,it,expect } from "vitest"; import { passwordHash,passwordVerify } from "@/lib/auth";
describe("master password",()=>{it("uses Argon2id verification",async()=>{const hash=await passwordHash("correct horse battery staple");expect(await passwordVerify(hash,"correct horse battery staple")).toBe(true);expect(await passwordVerify(hash,"wrong")).toBe(false)})});
