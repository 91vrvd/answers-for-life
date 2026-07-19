import { writeFile } from "node:fs/promises";
import { lifeThemes } from "../src/data/themes.ts";

const themes = lifeThemes.map(({ id, family, responseMode, kicker, title, subtitle, description, choicePrompt, choices, items }) => ({
  id, family, responseMode, kicker, title, subtitle, description, choicePrompt, choices, items,
}));

await writeFile(new URL("../miniprogram/data/themes.js", import.meta.url), `// 由 scripts/build-miniprogram-data.mjs 生成，请勿手动编辑。\nmodule.exports = ${JSON.stringify({ themes }, null, 2)};\n`);
