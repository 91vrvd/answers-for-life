import type { LifeTheme, ResponseMode, ThemeItem } from "@/src/data/themes";

export type ThemeExportPage = { name: string; url: string };

type ExportInput = {
  theme: LifeTheme;
  itemIds: string[];
  mode: ResponseMode;
  choiceAnswers: Record<string, string>;
  writtenAnswers: Record<string, string>;
};

const WIDTH = 1080;
const HEIGHT = 1440;
const PAD = 94;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  for (const paragraph of (text || "").split("\n")) {
    if (!paragraph) { lines.push(""); continue; }
    let line = "";
    for (const char of paragraph) {
      const next = line + char;
      if (ctx.measureText(next).width > maxWidth && line) {
        lines.push(line);
        line = char;
      } else line = next;
    }
    if (line) lines.push(line);
  }
  return lines;
}

function createCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("浏览器暂不支持生成图片");
  ctx.fillStyle = "#F8F6F2";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeStyle = "rgba(184,111,114,.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(880, 145, 330, 105, -.25, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(128,151,131,.35)";
  ctx.beginPath();
  ctx.ellipse(920, 185, 280, 90, .3, 0, Math.PI * 2);
  ctx.stroke();
  return { canvas, ctx };
}

function drawPageHeader(ctx: CanvasRenderingContext2D, theme: LifeTheme, page: number, total: number) {
  ctx.fillStyle = "#B86F72";
  ctx.font = '700 22px "PingFang SC", sans-serif';
  ctx.fillText("留白答案", PAD, 86);
  ctx.fillStyle = "#77716B";
  ctx.font = '20px "PingFang SC", sans-serif';
  ctx.textAlign = "right";
  ctx.fillText(`${String(page).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, WIDTH - PAD, 86);
  ctx.textAlign = "left";
  ctx.fillStyle = "#242220";
  ctx.font = '600 42px "Songti SC", serif';
  ctx.fillText(theme.title, PAD, 155);
  ctx.strokeStyle = "#E8E3DE";
  ctx.beginPath(); ctx.moveTo(PAD, 192); ctx.lineTo(WIDTH - PAD, 192); ctx.stroke();
}

function answerText(input: ExportInput, item: ThemeItem) {
  if (input.mode === "write") return input.writtenAnswers[item.id]?.trim() || "（这道题留给以后继续写）";
  const value = input.choiceAnswers[item.id];
  return input.theme.choices.find((choice) => choice.value === value)?.label ?? "暂未选择";
}

export async function generateThemeAnswerImages(input: ExportInput): Promise<ThemeExportPage[]> {
  const items = input.itemIds.map((id) => input.theme.items.find((item) => item.id === id)).filter(Boolean) as ThemeItem[];
  const measure = createCanvas().ctx;
  const sourceBlocks = items.map((item, index) => {
    measure.font = '600 31px "Songti SC", serif';
    const question = wrap(measure, `${index + 1}. ${item.writingPrompt}`, WIDTH - PAD * 2);
    measure.font = `${input.mode === "write" ? 28 : 30}px "PingFang SC", sans-serif`;
    const answer = wrap(measure, answerText(input, item), WIDTH - PAD * 2 - 38);
    return { item, index, question, answer };
  });

  const blocks = sourceBlocks.flatMap((block) => {
    const segments: typeof sourceBlocks = [];
    for (let offset = 0; offset < block.answer.length; offset += 16) {
      segments.push({
        ...block,
        question: offset === 0 ? block.question : [`${block.index + 1}. ${block.item.title}（续）`],
        answer: block.answer.slice(offset, offset + 16),
      });
    }
    return segments;
  });

  const chunks: typeof blocks[] = [];
  let chunk: typeof blocks = [];
  let used = 0;
  const available = 1100;
  for (const block of blocks) {
    const height = 72 + block.question.length * 47 + block.answer.length * 43 + 38;
    if (chunk.length && used + height > available) { chunks.push(chunk); chunk = []; used = 0; }
    chunk.push(block); used += height;
  }
  if (chunk.length) chunks.push(chunk);

  const total = Math.max(chunks.length, 1);
  return (chunks.length ? chunks : [[]]).map((pageBlocks, pageIndex) => {
    const { canvas, ctx } = createCanvas();
    drawPageHeader(ctx, input.theme, pageIndex + 1, total);
    let y = 250;
    pageBlocks.forEach((block) => {
      ctx.fillStyle = "#B86F72";
      ctx.font = '700 18px "PingFang SC", sans-serif';
      ctx.fillText(block.item.category, PAD, y);
      y += 43;
      ctx.fillStyle = "#242220";
      ctx.font = '600 31px "Songti SC", serif';
      block.question.forEach((line) => { ctx.fillText(line, PAD, y); y += 47; });
      y += 13;
      ctx.fillStyle = input.mode === "write" ? "#4E4945" : "#809783";
      ctx.font = `${input.mode === "write" ? 28 : 30}px "PingFang SC", sans-serif`;
      block.answer.forEach((line) => { ctx.fillText(line, PAD + 30, y); y += 43; });
      y += 30;
      ctx.strokeStyle = "#E8E3DE";
      ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(WIDTH - PAD, y); ctx.stroke();
      y += 38;
    });
    ctx.fillStyle = "#6F6964";
    ctx.font = '600 19px "PingFang SC", sans-serif';
    ctx.fillText("留白答案｜微信搜索同名小程序", PAD, HEIGHT - 80);
    ctx.fillStyle = "#9A938D";
    ctx.font = '16px "PingFang SC", sans-serif';
    ctx.fillText("仅在本地运行 · 内容不会上传服务器", PAD, HEIGHT - 48);
    return { name: `留白答案-${input.theme.title}-${pageIndex + 1}.png`, url: canvas.toDataURL("image/png", 1) };
  });
}

export function downloadThemeExportPage(page: ThemeExportPage) {
  const link = document.createElement("a");
  link.download = page.name;
  link.href = page.url;
  link.click();
}
