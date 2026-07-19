const { getTheme, countOptions, startRun } = require("../../utils/run");

Page({
  data: { theme: null, options: [], selected: 0, estimate: "" },
  onLoad(query) {
    const theme = getTheme(query.id);
    if (!theme) { wx.navigateBack(); return; }
    const options = countOptions(theme);
    const selected = theme.responseMode === "write" && options.includes(6) ? 6 : options.includes(12) ? 12 : options[0];
    this.setData({ theme, options, selected, estimate: this.estimate(theme, selected) });
  },
  estimate(theme, count) { return theme.responseMode === "write" ? `${Math.max(3, count * 2)}–${Math.max(5, count * 4)} 分钟` : `约 ${Math.max(1, Math.ceil(count / 6))}–${Math.max(2, Math.ceil(count / 3))} 分钟`; },
  select(event) {
    const selected = Number(event.currentTarget.dataset.value);
    this.setData({ selected, estimate: this.estimate(this.data.theme, selected) });
  },
  start() { startRun(this.data.theme, this.data.selected); wx.redirectTo({ url: "/pages/answer/answer" }); },
});
