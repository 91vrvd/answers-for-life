import assert from "node:assert/strict";
import test from "node:test";
import { createTaskSelection, getTaskContent, tasks } from "../src/data/tasks.ts";
import { createReflectionSelection, getReflectionPrompt, reflectionPrompts } from "../src/data/reflectionPrompts.ts";
import { challengeTasks } from "../src/data/challengeTasks.ts";

test("contains 100 complete dual-mode topics", () => {
  assert.equal(tasks.length, 100);
  assert.equal(new Set(tasks.map((task) => task.id)).size, 100);
  for (const task of tasks) {
    for (const mode of ["couple", "self"]) {
      const content = getTaskContent(task, mode);
      assert.ok(content.category.trim());
      assert.ok(content.title.trim());
      assert.ok(content.description.trim());
    }
  }
});

test("creates stable-sized unique and category-balanced selections", () => {
  for (const mode of ["couple", "self"]) {
    for (const count of [10, 15, 20, 30, 50, 100]) {
      const ids = createTaskSelection(count, mode);
      assert.equal(ids.length, count);
      assert.equal(new Set(ids).size, count);
      const categories = ids.map((id) => getTaskContent(tasks.find((task) => task.id === id), mode).category);
      const amounts = Object.values(Object.groupBy(categories, (category) => category)).map((items) => items.length);
      assert.ok(Math.max(...amounts) - Math.min(...amounts) <= 1);
    }
  }
});

test("contains balanced original written prompts for both love modes", () => {
  assert.equal(reflectionPrompts.filter((prompt) => prompt.mode === "self").length, 36);
  assert.equal(reflectionPrompts.filter((prompt) => prompt.mode === "couple").length, 36);
  assert.equal(new Set(reflectionPrompts.map((prompt) => prompt.id)).size, reflectionPrompts.length);
  for (const mode of ["couple", "self"]) {
    for (const count of [3, 6, 12]) {
      const ids = createReflectionSelection(mode, count);
      assert.equal(ids.length, count);
      assert.equal(new Set(ids).size, count);
      assert.ok(ids.every((id) => getReflectionPrompt(id)?.mode === mode));
    }
  }
});

test("contains 30 complete and editable self-challenge tasks", () => {
  assert.equal(challengeTasks.length, 30);
  assert.equal(new Set(challengeTasks.map((task) => task.id)).size, 30);
  assert.equal(challengeTasks[0].id, 1);
  assert.equal(challengeTasks.at(-1).id, 30);
  for (const task of challengeTasks) {
    assert.ok(task.category.trim());
    assert.ok(task.title.trim());
    assert.ok(task.description.trim());
  }
});
