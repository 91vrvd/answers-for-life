const { loadRun, saveRun, getTheme } = require("../../utils/run");

Page({
  data: { run: null, theme: null, item: null, answer: "", progress: 0, current: "01", total: "01", isLast: false },
  onLoad() { this.load(); },
  load() {
    const run = loadRun(); const theme = run && getTheme(run.themeId);
    if (!run || !theme || run.index >= run.itemIds.length) { wx.redirectTo({ url: "/pages/result/result" }); return; }
    const item = theme.items.find((entry) => entry.id === run.itemIds[run.index]);
    const answer = run.writtenAnswers[item.id] || "";
    this.setData({ run, theme, item, answer, progress: ((run.index + 1) / run.itemIds.length) * 100, current: String(run.index + 1).padStart(2, "0"), total: String(run.itemIds.length).padStart(2, "0"), isLast: run.index + 1 === run.itemIds.length });
  },
  input(event) {
    const run = this.data.run; const value = event.detail.value.slice(0, 1200);
    run.writtenAnswers[this.data.item.id] = value; saveRun(run); this.setData({ answer: value });
  },
  choose(event) {
    const run = this.data.run; run.choiceAnswers[this.data.item.id] = event.currentTarget.dataset.value; run.index += 1; saveRun(run);
    if (run.index >= run.itemIds.length) wx.redirectTo({ url: "/pages/result/result" }); else this.load();
  },
  next() {
    const run = this.data.run; run.index += 1; saveRun(run);
    if (run.index >= run.itemIds.length) wx.redirectTo({ url: "/pages/result/result" }); else this.load();
  },
  previous() {
    const run = this.data.run;
    if (run.index === 0) { wx.navigateBack(); return; }
    run.index -= 1; saveRun(run); this.load();
  },
});
