function wrap(ctx, text, maxWidth) {
  const lines = [];
  String(text || "").split("\n").forEach((paragraph) => {
    if (!paragraph) { lines.push(""); return; }
    let line = "";
    Array.from(paragraph).forEach((char) => {
      const next = line + char;
      if (line && ctx.measureText(next).width > maxWidth) { lines.push(line); line = char; } else line = next;
    });
    if (line) lines.push(line);
  });
  return lines;
}
function tempFile(canvas) {
  return new Promise((resolve, reject) => wx.canvasToTempFilePath({ canvas, fileType: "png", quality: 1, success: (result) => resolve(result.tempFilePath), fail: reject }));
}
function getCanvas(page) {
  return new Promise((resolve, reject) => wx.createSelectorQuery().in(page).select("#answerCanvas").fields({ node: true, size: true }).exec((result) => result && result[0] && result[0].node ? resolve(result[0].node) : reject(new Error("无法创建画布"))));
}
async function exportImages(page, theme, items) {
  const canvas = await getCanvas(page); canvas.width = 1080; canvas.height = 1440;
  const ctx = canvas.getContext("2d");
  ctx.font = '600 31px "Songti SC"';
  const sourceBlocks = items.map((item, index) => {
    const question = wrap(ctx, `${index + 1}. ${item.question}`, 890);
    ctx.font = '28px "PingFang SC"';
    const answer = wrap(ctx, item.answer || "（这道题留给以后继续写）", 850);
    return { index, category: item.category, title: item.title, question, answer };
  });
  const blocks = [];
  sourceBlocks.forEach((block) => {
    for (let offset = 0; offset < block.answer.length; offset += 12) blocks.push({ ...block, question: offset ? [`${block.index + 1}. ${block.title}（续）`] : block.question, answer: block.answer.slice(offset, offset + 12) });
  });
  const pages = []; let current = []; let used = 0;
  blocks.forEach((block) => {
    const height = 75 + block.question.length * 47 + block.answer.length * 43 + 45;
    if (current.length && used + height > 1080) { pages.push(current); current = []; used = 0; }
    current.push(block); used += height;
  });
  if (current.length) pages.push(current);
  const paths = [];
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    ctx.fillStyle = "#F8F6F2"; ctx.fillRect(0, 0, 1080, 1440);
    ctx.strokeStyle = "rgba(184,111,114,.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(890, 140, 330, 105, -.25, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "rgba(128,151,131,.35)"; ctx.beginPath(); ctx.ellipse(930, 180, 280, 90, .3, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#B86F72"; ctx.font = '700 22px "PingFang SC"'; ctx.fillText("留白答案", 94, 86);
    ctx.fillStyle = "#77716B"; ctx.font = '20px "PingFang SC"'; ctx.textAlign = "right"; ctx.fillText(`${String(pageIndex + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`, 986, 86); ctx.textAlign = "left";
    ctx.fillStyle = "#242220"; ctx.font = '600 42px "Songti SC"'; ctx.fillText(theme.title, 94, 155);
    ctx.strokeStyle = "#E8E3DE"; ctx.beginPath(); ctx.moveTo(94, 192); ctx.lineTo(986, 192); ctx.stroke();
    let y = 250;
    pages[pageIndex].forEach((block) => {
      ctx.fillStyle = "#B86F72"; ctx.font = '700 18px "PingFang SC"'; ctx.fillText(block.category, 94, y); y += 43;
      ctx.fillStyle = "#242220"; ctx.font = '600 31px "Songti SC"'; block.question.forEach((line) => { ctx.fillText(line, 94, y); y += 47; }); y += 13;
      ctx.fillStyle = theme.responseMode === "write" ? "#4E4945" : "#809783"; ctx.font = '28px "PingFang SC"'; block.answer.forEach((line) => { ctx.fillText(line, 124, y); y += 43; }); y += 30;
      ctx.strokeStyle = "#E8E3DE"; ctx.beginPath(); ctx.moveTo(94, y); ctx.lineTo(986, y); ctx.stroke(); y += 38;
    });
    ctx.fillStyle = "#6F6964"; ctx.font = '600 19px "PingFang SC"'; ctx.fillText("留白答案｜微信搜索同名小程序", 94, 1360);
    ctx.fillStyle = "#9A938D"; ctx.font = '16px "PingFang SC"'; ctx.fillText("仅在本地运行 · 内容不会上传服务器", 94, 1390);
    paths.push(await tempFile(canvas));
  }
  return paths;
}
function escapeHtml(value) { return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>"); }
function exportWord(theme, items) {
  const sections = items.map((item, index) => `<section><small>${String(index + 1).padStart(2, "0")}　${escapeHtml(item.category)}</small><h2>${escapeHtml(item.question)}</h2><p>${escapeHtml(item.answer) || "在这里继续写下你的答案……"}</p><h4>继续写：</h4><div class="line"></div><div class="line"></div></section>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{background:#fffefc;color:#242220;font-family:'PingFang SC',sans-serif;padding:48px;line-height:1.8}header{text-align:center;padding:80px 0 110px}header b{color:#b86f72;letter-spacing:4px}h1,h2{font-family:SimSun,serif}h1{font-size:38px}header h2{color:#809783;font-weight:400}section{page-break-inside:avoid;margin:0 0 42px}small{color:#b86f72;font-weight:bold}section h2{font-size:21px}p{padding:18px 22px;border-left:4px solid #809783;background:#f8f6f2}h4{color:#809783}.line{height:35px;border-bottom:1px solid #e8e3de}.brand{margin-top:70px;color:#77716b;text-align:center}</style></head><body><header><b>ANSWERS IN THE MARGINS</b><h1>留白答案</h1><h2>${escapeHtml(theme.title)}</h2><p>共 ${items.length} 题 · 可继续编辑</p></header>${sections}<div class="brand">留白答案 · 仅在本地运行</div></body></html>`;
  const filePath = `${wx.env.USER_DATA_PATH}/留白答案-${theme.title}-可填写答案册.doc`;
  wx.getFileSystemManager().writeFileSync(filePath, html, "utf8");
  return filePath;
}
module.exports = { exportImages, exportWord };
