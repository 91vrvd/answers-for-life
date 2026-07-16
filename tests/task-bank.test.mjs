import assert from "node:assert/strict";
import test from "node:test";
import { createTaskSelection, getTaskContent, tasks } from "../src/data/tasks.ts";

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
