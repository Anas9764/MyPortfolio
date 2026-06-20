/**
 * Seed script — run the original backend seed against the same MongoDB database.
 * Usage: npm run seed
 *
 * This delegates to backend/scripts/seed.js to avoid duplicating large seed data.
 */
import { spawnSync } from "child_process";
import path from "path";

const backendSeed = path.resolve(__dirname, "../../backend/scripts/seed.js");

const result = spawnSync("node", [backendSeed], {
  stdio: "inherit",
  cwd: path.resolve(__dirname, "../../backend"),
});

process.exit(result.status ?? 1);
