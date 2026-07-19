# 给生活的答案

手机端优先的互动答案册。产品内置 12 个关于成长、生活、关系与现实的主题，包括「人生回报率最高的12件事」「关于爱的100件小事」「30天全新自己挑战」等。

主题会根据内容明确分成两种回答方式，不再让用户额外判断：

- 选择题：高回报、低谷自救、停止内耗、生活习惯、爱的100件小事、30天挑战。完成后可生成包含全部回答的多页 PNG。
- 自己写：理想生活、写给未来、安全感、金钱、工作、真心问答。完成后可生成完整 PNG，并导出可继续编辑的 Word 答案册。

用户可以选择本次题量；抽题会兼顾不同分类，选中的题目、当前进度和答案均保存在浏览器 `localStorage`，刷新后可以继续。

## 本地运行

```bash
npm install
npm run dev
```

默认打开 `http://localhost:3000`。

检查与生产构建：

```bash
npx tsc --noEmit
npm run lint
npm test
```

## 主要目录

```text
app/                         页面入口、元数据与全局样式
src/components/              通用按钮、进度条、提示等组件
src/data/themes.ts           12 个主题、题库与均衡抽题逻辑
src/data/                    原有 100 题、真心问答和挑战题库
src/screens/Theme*.tsx       主题库、模式、题量、答题和完整结果
src/state/LoveBookContext.tsx Context、reducer 与 localStorage 持久化
src/utils/exportThemeImages.ts 完整多页 PNG 生成
src/utils/exportThemeWord.ts  可编辑 Word 答案册生成
tests/                       题库数量、抽题和服务端渲染测试
```

## 当前实现边界

- 不需要登录，数据仅保存在当前浏览器。
- Word 导出只在「自己写」完成后提供；文档包含已有答案和可继续填写区域。
- 完整图片按页生成，确保本轮所有题目和答案都会被保存；移动端可逐张保存。
- 旧版情侣邀请、模拟 TA 答案与打卡原型仍保留在代码中，但新首页以 12 个统一主题为主入口。
- 暂不接后端、微信分享、真实双人同步或云端存储。
