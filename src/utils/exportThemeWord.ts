import { AlignmentType, BorderStyle, Document, Footer, HeadingLevel, Packer, PageBreak, PageNumber, Paragraph, ShadingType, TextRun } from "docx";
import type { LifeTheme } from "@/src/data/themes";

type WordInput = {
  theme: LifeTheme;
  itemIds: string[];
  writtenAnswers: Record<string, string>;
};

export async function buildThemeWordBlob({ theme, itemIds, writtenAnswers }: WordInput) {
  const items = itemIds.map((id) => theme.items.find((item) => item.id === id)).filter(Boolean);
  const children: Paragraph[] = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1400 }, children: [new TextRun({ text: "ANSWERS FOR LIFE", color: "B86F72", bold: true, size: 20, characterSpacing: 45 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 280 }, children: [new TextRun({ text: "给生活的答案", color: "242220", bold: true, size: 54, font: "宋体" })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 280 }, children: [new TextRun({ text: theme.title, color: "809783", size: 32, font: "宋体" })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240 }, children: [new TextRun({ text: theme.subtitle, color: "77716B", size: 22 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1250 }, children: [new TextRun({ text: `共 ${items.length} 题 · ${new Date().toLocaleDateString("zh-CN")}`, color: "9A938D", size: 18 })] }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  items.forEach((item, index) => {
    if (!item) return;
    const answer = writtenAnswers[item.id]?.trim();
    children.push(
      new Paragraph({ spacing: { before: index ? 400 : 120, after: 90 }, children: [new TextRun({ text: `${String(index + 1).padStart(2, "0")}  ${item.category}`, color: "B86F72", bold: true, size: 19, characterSpacing: 20 })] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { after: 170 }, children: [new TextRun({ text: item.writingPrompt, color: "242220", bold: true, size: 30, font: "宋体" })] }),
      new Paragraph({ spacing: { after: 160, line: 420 }, shading: { type: ShadingType.CLEAR, fill: "F8F6F2" }, border: { left: { style: BorderStyle.SINGLE, size: 10, color: answer ? "809783" : "E8E3DE" } }, indent: { left: 260 }, children: [new TextRun({ text: answer || "在这里继续写下你的答案……", color: answer ? "4E4945" : "9A938D", size: 23 })] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "继续写：", color: "809783", bold: true, size: 18 })] }),
      new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 5, color: "E8E3DE" } }, spacing: { after: 180 }, children: [new TextRun({ text: " ", size: 22 })] }),
      new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 5, color: "E8E3DE" } }, spacing: { after: 180 }, children: [new TextRun({ text: " ", size: 22 })] }),
    );
  });

  const doc = new Document({ sections: [{
    properties: { page: { margin: { top: 900, right: 900, bottom: 900, left: 900 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "给生活的答案  ·  ", color: "9A938D", size: 16 }), new TextRun({ children: [PageNumber.CURRENT], color: "9A938D", size: 16 })] })] }) },
    children,
  }] });
  return Packer.toBlob(doc);
}

export async function downloadThemeWord(input: WordInput) {
  const blob = await buildThemeWordBlob(input);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `给生活的答案-${input.theme.title}-可填写答案册.docx`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
