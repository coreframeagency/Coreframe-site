import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import bcrypt from "bcryptjs";
import nextEnv from "@next/env";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const pw = (await rl.question("New admin password: ")).trim();
const pw2 = (await rl.question("Type it again: ")).trim();
rl.close();
if (!pw || pw !== pw2) { console.error("Passwords empty or don't match."); process.exit(1); }

const hash = bcrypt.hashSync(pw, 10);
const line = "ADMIN_PASSWORD=" + hash.replace(/\$/g, "\\$");
const file = ".env.local";
let env = existsSync(file) ? readFileSync(file, "utf8") : "";
env = /^ADMIN_PASSWORD=.*$/m.test(env)
  ? env.replace(/^ADMIN_PASSWORD=.*$/m, () => line)
  : env.replace(/\n?$/, "\n") + line + "\n";
writeFileSync(file, env);

nextEnv.loadEnvConfig(process.cwd(), true, console, true);
const loaded = process.env.ADMIN_PASSWORD;
const ok = loaded === hash && bcrypt.compareSync(pw, loaded);
console.log(ok ? "\nOK — .env.local updated and verified." : "\nFAILED — loaded value does not match.");
console.log("\nPaste this into Render → ADMIN_PASSWORD (raw, no quotes):\n" + hash);
console.log("\nNow restart the dev server.");
