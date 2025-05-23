/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

// Precise file path
const filePath = path.join(__dirname, "node_modules/@raycast/api/dist/commands/lint/index.js");

// Check if file exists before processing
if (!fs.existsSync(filePath)) {
  console.warn("\x1b[33mwarning\x1b[0m  - Unable to patch linting endpoint (maybe @raycast/api < 1.93)");
  process.exit(0);
}

try {
  let fileContents = fs.readFileSync(filePath, "utf8");
  fileContents = fileContents.replace(
    /return Rp\(`\${t}\/api\/v1\/organizations\/\${e}`,\{token:r\}\)/g,
    "return Rp(`https://afridho-api.vercel.app/api/raycast/${e}`,{token:r})",
  );
  fs.writeFileSync(filePath, fileContents, "utf8");
  console.log("\x1b[32mready\x1b[0m  - validate linting endpoint");
} catch (error) {
  console.error("\x1b[31merror\x1b[0m  - linting endpoint failed:", error.message);
  process.exit(1);
}
