const { loadRun, getTheme } = require("../../utils/run");
const { exportImages, exportWord } = require("../../utils/export");

Page({
  data: { theme: null, run: null, items: [], writtenCount: 0, imagePaths: [], generating: false },
  onLoad() { this.load(); },
  load() {
    const run = loadRun(); const theme = run && getTheme(run.themeId);
    if (!run || !theme) { wx.reLaunch({ url: "/pages/index/index" }); return; }
    const items = run.itemIds.map((id, index) => {
      const item = theme.items.find((entry) => entry.id === id);
      const choice = theme.choices.find((entry) => entry.value === run.choiceAnswers[id]);
      return { id, number: String(index + 1).padStart(2, "0"), category: item.category, title: item.title, question: item.writingPrompt, answer: theme.responseMode === "write" ? (run.writtenAnswers[id] || "") : (choice ? choice.label : "暂未选择"), empty: theme.responseMode === "write" && !(run.writtenAnswers[id] || "").trim() };
    });
    this.setData({ theme, run, items, writtenCount: items.filter((item) => !item.empty).length });
  },
  async makeImages() {
    if (this.data.generating) return;
    this.setData({ generating: true }); wx.showLoading({ title: "整理全部答案" });
    try { const imagePaths = await exportImages(this, this.data.theme, this.data.items); this.setData({ imagePaths }); wx.showToast({ title: `已生成${imagePaths.length}张`, icon: "success" }); }
    catch (error) { wx.showToast({ title: "图片生成失败", icon: "none" }); }
    finally { wx.hideLoading(); this.setData({ generating: false }); }
  },
  saveImage(event) {
    wx.saveImageToPhotosAlbum({ filePath: event.currentTarget.dataset.path, success: () => wx.showToast({ title: "已保存到相册" }), fail: () => wx.showToast({ title: "请允许保存到相册", icon: "none" }) });
  },
  openWord() {
    try { const filePath = exportWord(this.data.theme, this.data.items); wx.openDocument({ filePath, fileType: "doc", showMenu: true, fail: () => wx.showToast({ title: "无法打开答案册", icon: "none" }) }); }
    catch (error) { wx.showToast({ title: "答案册生成失败", icon: "none" }); }
  },
  another() { wx.reLaunch({ url: "/pages/index/index" }); },
});
