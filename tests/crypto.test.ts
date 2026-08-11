import { describe,it,expect,beforeEach } from "vitest"; import { randomBytes } from "crypto";
beforeEach(()=>{process.env.VAULT_ENCRYPTION_KEY=randomBytes(32).toString("base64")});
describe("vault encryption",()=>{it("round-trips AES-256-GCM data",async()=>{const {encrypt,decrypt}=await import("@/lib/crypto");expect(decrypt(encrypt("secret-value"))).toBe("secret-value")});it("rejects tampered ciphertext",async()=>{const {encrypt,decrypt}=await import("@/lib/crypto");const raw=Buffer.from(encrypt("secret"),"base64");raw[28]^=1;expect(()=>decrypt(raw.toString("base64"))).toThrow()})});
