import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { tasks } from "../src/data/tasks.ts";
import { reflectionPrompts } from "../src/data/reflectionPrompts.ts";
import { challengeTasks } from "../src/data/challengeTasks.ts";
import { getLifeTheme, lifeThemes } from "../src/data/themes.ts";

// Exercise the production reducer without mounting React or browser storage.
const source = readFileSync(new URL("../src/state/LoveBookContext.tsx", import.meta.url), "utf8");
const reducerSource = source.slice(source.indexOf("function reducer("), source.indexOf("type LoveContextValue"));
const { outputText } = ts.transpileModule(reducerSource, { compilerOptions: { target: ts.ScriptTarget.ES2022 } });
const reducer = runInNewContext(`${outputText}\nreducer`, { tasks, reflectionPrompts, challengeTasks, getLifeTheme });
const restore = (payload) => reducer({}, { type: "hydrate", payload });

test("theme selector restores without the legacy love mode", () => {
  assert.equal(restore({ page: "themes" }).page, "themes");
});

for (const responseMode of ["choice", "write"]) {
  test(`${responseMode} answers and progress survive restoration`, () => {
    const theme = lifeThemes.find((item) => item.responseMode === responseMode);
    const ids = theme.items.slice(0, 3).map((item) => item.id);
    const answers = responseMode === "choice"
      ? { themeChoiceAnswers: { [ids[0]]: theme.choices[0].value } }
      : { themeWrittenAnswers: { [ids[0]]: "GitHub Pages 功能测试" } };
    const saved = { selectedThemeId: theme.id, selectedThemeItemIds: ids, themeIndex: 1, ...answers };
    const result = restore({ ...saved, page: responseMode === "choice" ? "themeChoice" : "themeWrite" });
    assert.equal(result.page, responseMode === "choice" ? "themeChoice" : "themeWrite");
    assert.equal(result.themeIndex, 1);
    assert.equal(result[Object.keys(answers)[0]][ids[0]], Object.values(answers)[0][ids[0]]);
    assert.equal(restore({ ...saved, page: "themeResult", themeIndex: 3 }).page, "themeResult");
  });
}

test("legacy progress is independent of themes and still requires its mode", () => {
  const saved = { page: "questions", selectedTaskIds: [tasks[0].id], currentIndex: 0 };
  assert.equal(restore({ ...saved, mode: "self" }).page, "questions");
  assert.equal(restore(saved).page, "mode");
  assert.equal(restore({ page: "themeResult", selectedThemeId: "missing" }).page, "themes");
});
