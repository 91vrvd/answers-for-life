const { themes } = require("../data/themes");
const STORAGE_KEY = "life-answers-mini:v1";

function getTheme(id) { return themes.find((theme) => theme.id === id); }
function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const target = Math.floor(Math.random() * (i + 1));
    const value = copy[i]; copy[i] = copy[target]; copy[target] = value;
  }
  return copy;
}
function createSelection(theme, count) {
  const groups = {};
  theme.items.forEach((item) => { (groups[item.category] || (groups[item.category] = [])).push(item); });
  const queues = shuffle(Object.values(groups)).map(shuffle);
  const ids = [];
  let row = 0;
  while (ids.length < Math.min(count, theme.items.length)) {
    queues.forEach((queue) => { if (queue[row] && ids.length < count) ids.push(queue[row].id); });
    row += 1;
  }
  return ids;
}
function countOptions(theme) {
  const values = theme.responseMode === "write" ? [3, 6, 12, theme.items.length] : theme.items.length > 50 ? [12, 30, 50, theme.items.length] : [6, 12, 20, theme.items.length];
  return Array.from(new Set(values.filter((value) => value <= theme.items.length)));
}
function saveRun(run) { wx.setStorageSync(STORAGE_KEY, run); }
function loadRun() { return wx.getStorageSync(STORAGE_KEY) || null; }
function startRun(theme, count) {
  const run = { themeId: theme.id, mode: theme.responseMode, count, itemIds: createSelection(theme, count), index: 0, choiceAnswers: {}, writtenAnswers: {} };
  saveRun(run); return run;
}
module.exports = { themes, getTheme, countOptions, saveRun, loadRun, startRun };
