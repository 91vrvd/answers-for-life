const { themes, loadRun, getTheme } = require("../../utils/run");

Page({
  data: { themes, filters: ["全部", "成长", "生活", "关系", "现实"], active: "全部", visibleThemes: themes, showThemes: false, resume: null },
  onShow() {
    const run = loadRun();
    const theme = run && getTheme(run.themeId);
    this.setData({ resume: theme && run.itemIds && run.itemIds.length ? { title: theme.title, finished: run.index >= run.itemIds.length } : null });
  },
  openThemes() { this.setData({ showThemes: true }); },
  primaryAction() { if (this.data.resume) this.resume(); else this.openThemes(); },
  backHome() { this.setData({ showThemes: false }); },
  filter(event) {
    const active = event.currentTarget.dataset.value;
    this.setData({ active, visibleThemes: active === "全部" ? themes : themes.filter((theme) => theme.family === active) });
  },
  chooseTheme(event) { wx.navigateTo({ url: `/pages/count/count?id=${event.currentTarget.dataset.id}` }); },
  resume() {
    const run = loadRun();
    if (!run) return;
    wx.navigateTo({ url: run.index >= run.itemIds.length ? "/pages/result/result" : "/pages/answer/answer" });
  },
});
