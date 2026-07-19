import { challengeTasks } from "./challengeTasks.ts";
import { reflectionPrompts } from "./reflectionPrompts.ts";
import { getTaskContent, tasks } from "./tasks.ts";

export type ResponseMode = "choice" | "write";
export type ThemeFamily = "成长" | "生活" | "关系" | "现实";
export type ChoiceTone = "positive" | "considering" | "neutral";

export type ThemeChoice = {
  value: string;
  label: string;
  shortLabel: string;
  tone: ChoiceTone;
};

export type ThemeItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  writingPrompt: string;
  writingHelper: string;
};

export type LifeTheme = {
  id: string;
  family: ThemeFamily;
  kicker: string;
  title: string;
  subtitle: string;
  description: string;
  choicePrompt: string;
  choices: [ThemeChoice, ThemeChoice, ThemeChoice];
  items: ThemeItem[];
  featured?: boolean;
};

type SeedGroup = { category: string; description: string; titles: string[] };

const actionChoices: LifeTheme["choices"] = [
  { value: "done", label: "已经在做", shortLabel: "已做到", tone: "positive" },
  { value: "want", label: "想去尝试", shortLabel: "想尝试", tone: "considering" },
  { value: "later", label: "暂时不适合", shortLabel: "以后再说", tone: "neutral" },
];

const reflectionChoices: LifeTheme["choices"] = [
  { value: "clear", label: "我已经想清楚", shortLabel: "已明确", tone: "positive" },
  { value: "thinking", label: "我还在寻找", shortLabel: "正在想", tone: "considering" },
  { value: "unknown", label: "暂时没有答案", shortLabel: "没答案", tone: "neutral" },
];

const relationshipChoices: LifeTheme["choices"] = [
  { value: "important", label: "这对我很重要", shortLabel: "很重要", tone: "positive" },
  { value: "talk", label: "想和对方聊聊", shortLabel: "想聊聊", tone: "considering" },
  { value: "unsure", label: "暂时没有想过", shortLabel: "没想过", tone: "neutral" },
];

function makeItems(themeId: string, groups: SeedGroup[], question: (title: string) => string, helper: string) {
  let index = 0;
  return groups.flatMap((group) => group.titles.map((title) => {
    index += 1;
    return {
      id: `${themeId}-${index}`,
      category: group.category,
      title,
      description: group.description,
      writingPrompt: question(title),
      writingHelper: helper,
    } satisfies ThemeItem;
  }));
}

const roiItems = makeItems("roi", [
  { category: "身心底座", description: "真正稳定的回报，常常来自最基础、也最容易被忽略的照顾。", titles: ["把睡眠当成每天最重要的投资", "保持一项能长期坚持的运动", "定期检查身体，不用拖延换安心"] },
  { category: "长期能力", description: "能反复使用的能力，会在很长时间里持续产生复利。", titles: ["练好表达与认真倾听的能力", "建立持续阅读和学习的习惯", "学会管理金钱并保留应急储蓄"] },
  { category: "关系资产", description: "高质量关系不是认识很多人，而是彼此可以真实、稳定地出现。", titles: ["经营几段可以说真话的关系", "及时表达感谢，也认真回应善意", "远离持续消耗自尊和精力的关系"] },
  { category: "人生方向", description: "知道什么值得拒绝，和知道什么值得追求同样重要。", titles: ["把时间留给真正重要的长期目标", "尽早建立自己的边界和原则", "持续记录、复盘并修正生活方向"] },
], (title) => `关于“${title}”，你目前做到了多少，又准备从哪里开始？`, "写真实进度，不需要把答案写得像一份完美计划。");

const lowItems = makeItems("low", [
  { category: "先稳住自己", description: "低谷时不急着想通人生，先让身体和今天安全落地。", titles: ["先保证睡眠、吃饭和基本生活", "把今天的任务缩小到只完成一件", "暂时离开让情绪不断升级的信息"] },
  { category: "允许发生", description: "承认现在很难，不代表你会永远停在这里。", titles: ["允许自己难过，而不是马上振作", "停止用别人的进度羞辱现在的自己", "写下正在经历的事实，不急着下结论"] },
  { category: "重新连接", description: "有人知道你正在经历什么，重量就不必全由一个人承担。", titles: ["联系一个可以安心说话的人", "在需要时主动寻求专业帮助", "回到一个让自己有安全感的空间"] },
  { category: "慢慢回来", description: "恢复不是突然变好，而是重新积累一点对生活的感受。", titles: ["恢复一件过去喜欢的小事", "完成一个能看见结果的微小行动", "为下一周安排一件值得期待的事"] },
], (title) => `当你处在低谷时，“${title}”可以怎样具体地帮助你？`, "可以写下最近一次经历，也可以写一份留给未来低谷时的提醒。");

const overthinkingItems = makeItems("overthinking", [
  { category: "看见念头", description: "先分清事实、猜测和恐惧，很多重量才有机会被放回原处。", titles: ["把事实和脑海里的猜测分开", "停止反复重演已经结束的对话", "不把一次失误解释成自己很差", "允许问题暂时没有结论"] },
  { category: "收回注意力", description: "注意力回到此刻，身体才会知道危险并没有一直发生。", titles: ["把注意力带回正在做的一件事", "减少无意识刷新消息和社交媒体", "给担忧规定一个结束时间", "用散步、呼吸或洗澡让身体先放松"] },
  { category: "建立边界", description: "不是所有人的情绪、期待和失望，都需要由你负责。", titles: ["不替别人预演所有可能的反应", "允许别人不理解自己的选择", "拒绝一次不合理却习惯答应的请求", "停止通过讨好换取短暂安全感", "离开一段只会重复消耗的讨论"] },
  { category: "回到行动", description: "行动不一定立刻解决问题，但能结束大脑里没有出口的循环。", titles: ["把担心改写成下一步能做的动作", "为最坏情况准备一个可执行预案", "完成以后就停止反复检查", "向可信任的人确认一次，而不是无限求证", "接受足够好，而不是等待绝对正确"] },
], (title) => `“${title}”最常在哪种情境里提醒到你？你希望下次怎样回应？`, "回忆一个具体场景，比给自己讲道理更有帮助。");

const betterLifeItems = makeItems("better-life", [
  { category: "早晨", description: "一天不必从慌乱开始，微小的准备会改变后面的节奏。", titles: ["醒来后先喝一杯水", "起床后十分钟不看手机", "为今天只确定一件最重要的事", "吃一顿不赶时间的早餐", "让阳光和新鲜空气进入房间"] },
  { category: "身体", description: "照顾身体不是自律表演，而是让生活拥有更稳定的底座。", titles: ["每天让身体活动二十分钟", "感觉疲惫时及时休息", "不把忙碌当作随便吃饭的理由", "固定一个相对稳定的入睡时间", "每隔一段时间认真放松肩颈和眼睛"] },
  { category: "空间", description: "环境不必完美，只需要让重要的事情更容易发生。", titles: ["每天整理一个很小的区域", "把经常使用的物品放回固定位置", "减少不再使用却持续占据空间的东西", "给房间留一个可以安静坐下的角落", "睡前为明天准备好必要物品"] },
  { category: "内心", description: "稳定不是没有情绪，而是能更早听见自己的真实状态。", titles: ["每天记录一句真实感受", "停止用难听的话评价自己", "为小进步留下明确证据", "不舒服时先问自己需要什么", "给没有完成的计划一次重新安排"] },
  { category: "关系", description: "关系的质量来自持续的小回应，而不是偶尔盛大的表达。", titles: ["认真回复一个重要的人", "把感谢说得具体一点", "有边界地拒绝让自己耗尽的安排", "定期联系一位真正关心的朋友", "争执时先描述感受而不是攻击人格"] },
  { category: "未来", description: "未来不会只靠意志到来，它需要一些能被今天完成的小动作。", titles: ["每月为一个目标存下一笔钱", "持续学习一项真正需要的能力", "每周给长期目标留一段固定时间", "每个月做一次简单复盘", "提前安排一件值得期待的小事"] },
], (title) => `如果把“${title}”变成你的生活习惯，最容易坚持的版本是什么？`, "把门槛写得小一点，让状态普通的日子也能够做到。");

const idealLifeItems = makeItems("ideal-life", [
  { category: "日常节奏", description: "理想生活首先是一种每天都能感受到的节奏。", titles: ["我理想的一天会怎样开始", "我希望工作和休息怎样分配", "什么样的居住环境让我放松", "我需要多少独处和社交", "什么事情值得成为每周固定安排"] },
  { category: "工作意义", description: "工作不仅提供收入，也在塑造时间、身份和生活方式。", titles: ["我希望工作给我带来什么", "我愿意为什么样的成长付出时间", "我不能接受怎样的工作状态", "收入、自由和意义如何排序", "我希望自己被怎样评价和需要"] },
  { category: "关系状态", description: "想要怎样的关系，也是在回答想成为怎样的自己。", titles: ["什么样的人让我更像自己", "我希望怎样表达爱和被爱", "哪些边界必须被认真尊重", "我想保留哪些只属于自己的空间", "我愿意长期经营哪些关系"] },
  { category: "金钱自由", description: "钱最终服务的，是安全感、选择权和真实生活。", titles: ["多少钱会让我感到基本安全", "我愿意把钱花在哪些体验上", "哪些消费只是为了得到认可", "我希望建立怎样的储蓄和保障", "如果收入减少我最想守住什么"] },
  { category: "身体感受", description: "真正适合的生活，身体通常比头脑更早知道。", titles: ["怎样的作息让我精神最好", "我想和身体建立怎样的关系", "哪些环境会持续消耗我的能量", "我希望用什么方式保持健康", "感到疲惫时我允许自己怎样休息"] },
  { category: "未来方向", description: "先允许自己想象，再讨论现实怎样一步步靠近。", titles: ["三年后我想在哪里醒来", "我最想掌握哪一项能力", "如果不怕失败我会开始什么", "我希望留下怎样的作品或影响", "现在就能靠近理想生活的一小步是什么"] },
], (title) => `${title}？请写下只属于你的具体答案。`, "不用考虑答案是否体面，先写下身体和内心最诚实的反应。");

const futureItems = makeItems("future", [
  { category: "此刻的我", description: "把现在真实保存下来，未来才能看见自己走了多远。", titles: ["现在的我最在意什么", "最近让我感到辛苦的事情", "这一阶段最值得肯定的自己", "我正在犹豫的一次选择", "我最不想忘记的一个普通瞬间"] },
  { category: "想去的地方", description: "未来不是标准答案，而是此刻愿意为之保留希望的方向。", titles: ["一年后我希望生活发生什么变化", "我想去但还没出发的地方", "我希望拥有怎样的工作节奏", "我想认真学会的一项能力", "我希望身边留下哪些人"] },
  { category: "想说的话", description: "有些话写下来以后，才不会被忙碌和时间轻易带走。", titles: ["谢谢你一直没有放弃的事情", "请你不要再责怪现在的我", "如果计划没有实现也请记得", "请替现在的我完成一个愿望", "希望你仍然相信的一件事"] },
  { category: "未来回信", description: "想象未来的自己已经读到这里，给现在留下一点回应。", titles: ["未来的你会怎样安慰现在的我", "你最感谢我今天做的哪个决定", "哪些担心后来证明没有那么可怕", "你现在拥有了怎样普通而幸福的一天", "读完这封信后请为自己做什么"] },
], (title) => `写给未来的自己：关于“${title}”，你此刻最想留下什么？`, "像写一封真正会在未来拆开的信，不需要正确，只需要真实。");

const securityItems = makeItems("security", [
  { category: "被爱确认", description: "安全感不是猜出来的，需要被双方具体理解和回应。", titles: ["什么时刻最能让我确认自己被爱", "当感受不到爱时我希望对方怎样靠近", "我需要怎样的联系频率才会安心", "哪些承诺对我来说必须说到做到"] },
  { category: "冲突修复", description: "关系是否安全，常常体现在意见不同以后怎样重新靠近。", titles: ["争执时什么语气会让我关闭沟通", "冲突后我希望怎样重新连接", "沉默对我来说是整理还是惩罚", "哪些问题不能用冷处理带过"] },
  { category: "边界尊重", description: "亲密不等于失去边界，被尊重才会让靠近更长久。", titles: ["我需要保留怎样的个人空间", "哪些隐私不应该被默认查看", "什么样的玩笑会真正伤害我", "当我说不时希望对方怎样理解"] },
  { category: "真实接纳", description: "能够展示不完美，而不担心立刻被放弃，是重要的关系体验。", titles: ["我最害怕被嫌弃的是哪一面", "我是否会为了被喜欢而隐藏自己", "什么样的回应让我敢于表达脆弱", "我希望对方怎样看待我的过去"] },
  { category: "稳定选择", description: "稳定不是永不变化，而是在变化里仍有可以依靠的原则。", titles: ["工作和关系冲突时怎样做决定", "怎样的行为会让我怀疑自己被放弃", "爱我的方式不同应该怎样沟通", "关系困难时哪些情况值得修复"] },
  { category: "共同未来", description: "未来不必立即承诺，但重要期待值得尽早交换。", titles: ["我期待怎样普通的共同生活", "关于金钱最需要提前聊清楚什么", "个人目标和共同计划怎样并存", "我希望我们一起守住什么原则"] },
], (title) => `在关系里，关于“${title}”，你最希望对方知道什么？`, "谈感受和需要，而不是猜测对方应该自动明白。");

const moneyItems = makeItems("money", [
  { category: "金钱记忆", description: "我们对钱的反应，往往来自很早以前形成的经验。", titles: ["小时候家里怎样谈论钱", "第一次感到缺钱是什么时候", "我从父母那里继承了哪些金钱观", "花钱时最容易出现哪种内疚"] },
  { category: "安全感", description: "数字背后真正想获得的，可能是稳定、自由或不被控制。", titles: ["多少储蓄会让我感到基本安心", "我最担心发生哪种财务风险", "没有收入时我能支撑多久", "哪些保障值得优先准备"] },
  { category: "消费选择", description: "每次消费都在表达：什么对现在的自己更重要。", titles: ["哪些钱花完以后真的很值得", "哪些消费只是为了获得别人认可", "我最容易在哪种情绪下冲动消费", "我愿意为时间和体验支付多少"] },
  { category: "收入工作", description: "收入不仅是能力证明，也与机会、环境和选择相关。", titles: ["我真正想提升哪一种赚钱能力", "收入增加后最想先改变什么", "为了高收入我不愿牺牲什么", "我是否敢于为自己的价值谈判"] },
  { category: "关系与钱", description: "关系里的钱不只是数字，也涉及权力、信任和边界。", titles: ["共同消费怎样分配让我舒服", "借钱给亲友的边界在哪里", "亲密关系中哪些财务必须透明", "我能否接受伴侣收入与我差距很大"] },
  { category: "未来自由", description: "理财不是追逐最大数字，而是让未来拥有更多选择权。", titles: ["我希望钱最终为哪种生活服务", "未来三年最重要的财务目标", "我愿意长期坚持怎样的储蓄比例", "如果财务自由我最想怎样使用时间"] },
], (title) => `关于“${title}”，你目前最真实的金钱答案是什么？`, "不需要展示正确观念，诚实写下经验、担心和真正的期待。");

const workItems = makeItems("work", [
  { category: "工作感受", description: "先看见日常真实感受，再讨论一份工作是否适合长期继续。", titles: ["什么工作内容会让我进入专注状态", "一天中哪类任务最消耗我", "我更喜欢独立完成还是团队协作", "怎样的节奏让我长期不透支"] },
  { category: "能力优势", description: "适合的方向往往藏在反复做得好、也愿意继续做的事情里。", titles: ["别人最常因为什么向我求助", "我学什么通常比别人更快", "哪些成果让我真正感到骄傲", "我愿意持续打磨哪项能力"] },
  { category: "价值回报", description: "工作回报不只有工资，也包括成长、自由、尊重和生活空间。", titles: ["收入、稳定、自由和意义怎样排序", "我最低可以接受怎样的收入", "什么样的成长值得暂时少赚一点"] },
  { category: "环境关系", description: "同样的工作在不同环境里，会让一个人成为完全不同的状态。", titles: ["我适合清晰制度还是高度自主", "我希望上级怎样沟通和反馈", "怎样的团队文化让我有安全感", "哪些职场边界不能再妥协"] },
  { category: "下一步", description: "职业方向不必一次确定，可以先设计一个成本可控的实验。", titles: ["下一份工作最想改变的三件事", "我可以怎样低成本验证一个新方向", "未来一年最值得补齐的能力"] },
], (title) => `谈到“${title}”，你目前最真实的职业答案是什么？`, "结合真实经历来写，不必为了显得上进而美化答案。");

const loveItems: ThemeItem[] = tasks.map((task) => {
  const content = getTaskContent(task, "couple");
  return {
    id: `love-${task.id}`,
    category: content.category,
    title: content.title,
    description: content.description,
    writingPrompt: `关于“${content.title}”，你最期待和喜欢的人留下怎样的画面？`,
    writingHelper: "可以写下具体的人、地点和感受，也可以写为什么这件事对你重要。",
  };
});

const challengeItems: ThemeItem[] = challengeTasks.map((task) => ({
  id: `challenge-${task.id}`,
  category: task.category,
  title: task.title,
  description: task.description,
  writingPrompt: `如果认真完成“${task.title}”，你希望它给生活带来什么变化？`,
  writingHelper: "写下你准备怎么做、什么时候开始，或完成以后想记住什么。",
}));

const truthItems: ThemeItem[] = reflectionPrompts.filter((prompt) => prompt.mode === "self").map((prompt, index) => ({
  id: `truth-${index + 1}`,
  category: prompt.category,
  title: prompt.question,
  description: prompt.helper,
  writingPrompt: prompt.question,
  writingHelper: prompt.helper,
}));

export const lifeThemes: LifeTheme[] = [
  { id: "roi", family: "成长", kicker: "LONG-TERM RETURN", title: "人生回报率最高的12件事", subtitle: "把有限的时间，留给会产生复利的选择", description: "从身体、能力、关系到方向，重新判断什么值得长期投入。", choicePrompt: "这件高回报的小事，你目前处在哪个阶段？", choices: actionChoices, items: roiItems, featured: true },
  { id: "low", family: "成长", kicker: "COME BACK SLOWLY", title: "低谷时重新找回自己的12件事", subtitle: "不催促振作，先让生活重新有一点着力点", description: "一份可以在困难时期重新打开的温柔自救清单。", choicePrompt: "低谷到来时，这件事对你有多可用？", choices: actionChoices, items: lowItems, featured: true },
  { id: "overthinking", family: "成长", kicker: "LESS OVERTHINKING", title: "停止精神内耗的18个练习", subtitle: "把注意力从反复想，慢慢带回真实生活", description: "看见念头、建立边界，再用小行动结束没有出口的循环。", choicePrompt: "面对内耗时，这个练习与你现在的状态接近吗？", choices: actionChoices, items: overthinkingItems },
  { id: "better-life", family: "生活", kicker: "A BETTER ORDINARY DAY", title: "让生活慢慢变好的30个习惯", subtitle: "不追求突然改变，只积累普通日子的稳定感", description: "从早晨、身体、空间到关系，为生活建立更轻松的默认设置。", choicePrompt: "这个生活习惯，你现在做到了多少？", choices: actionChoices, items: betterLifeItems, featured: true },
  { id: "ideal-life", family: "生活", kicker: "THE LIFE I REALLY WANT", title: "我真正想要怎样生活的30个问题", subtitle: "暂时放下应该，听听自己真正想靠近什么", description: "从日常节奏到未来方向，写出一份不替别人生活的个人答案。", choicePrompt: "关于这个人生问题，你现在有答案了吗？", choices: reflectionChoices, items: idealLifeItems, featured: true },
  { id: "future", family: "成长", kicker: "LETTER TO THE FUTURE", title: "写给未来自己的20个问题", subtitle: "保存此刻，也给以后留下一封可以继续写的信", description: "记录现在的在意、辛苦、愿望和想对未来说的话。", choicePrompt: "关于这封写给未来的信，你想清楚了吗？", choices: reflectionChoices, items: futureItems },
  { id: "love", family: "关系", kicker: "100 LITTLE THINGS ABOUT LOVE", title: "关于爱的100件小事", subtitle: "有些关于爱的答案，需要两个人慢慢完成", description: "保留原来的100题题库，也可以把每一件小事写成自己的答案。", choicePrompt: "关于这件爱的日常，你最接近哪一种答案？", choices: [{ value: "done", label: "已经一起做过", shortLabel: "做过", tone: "positive" }, { value: "want", label: "很想和TA一起做", shortLabel: "很想做", tone: "considering" }, { value: "later", label: "暂时没有感觉", shortLabel: "没感觉", tone: "neutral" }], items: loveItems, featured: true },
  { id: "security", family: "关系", kicker: "SAFE IN LOVE", title: "爱情里的安全感24问", subtitle: "把那些容易误解的期待，变成可以说清楚的话", description: "从确认、冲突、边界到未来，更具体地认识自己的安全感。", choicePrompt: "在关系里，这个问题对你意味着什么？", choices: relationshipChoices, items: securityItems, featured: true },
  { id: "money", family: "现实", kicker: "HONEST MONEY QUESTIONS", title: "关于金钱的24个真实问题", subtitle: "钱背后不只有数字，还有安全、自由和选择", description: "重新理解自己的金钱记忆、消费方式、关系边界和未来目标。", choicePrompt: "关于这个金钱问题，你现在清楚了吗？", choices: reflectionChoices, items: moneyItems, featured: true },
  { id: "work", family: "现实", kicker: "WORK THAT FITS ME", title: "找到适合自己的工作18问", subtitle: "不只问能做什么，也问怎样工作才不会失去生活", description: "从感受、能力、回报和环境里，找出下一份工作真正重要的条件。", choicePrompt: "关于这个职业问题，你现在有答案了吗？", choices: reflectionChoices, items: workItems, featured: true },
  { id: "challenge", family: "生活", kicker: "30 DAYS · A NEW ME", title: "30天全新自己挑战", subtitle: "不用连续，也不用按顺序，完成一次就算数", description: "通过30件真实可做的小事，重新找回生活里的新鲜感和行动力。", choicePrompt: "这件挑战，你现在最接近哪一种状态？", choices: actionChoices, items: challengeItems, featured: true },
  { id: "truth", family: "成长", kicker: "WRITE WHAT IS TRUE", title: "12分钟真心问答", subtitle: "没有标准答案，只是认真听见自己", description: "从36题原创题库中选择一组，用几分钟写下此刻最真实的感受。", choicePrompt: "面对这个问题，你现在有答案了吗？", choices: reflectionChoices, items: truthItems },
];

export function getLifeTheme(id: string | null | undefined) {
  return lifeThemes.find((theme) => theme.id === id);
}

function shuffled<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

export function createThemeSelection(theme: LifeTheme, count: number) {
  const buckets = new Map<string, ThemeItem[]>();
  theme.items.forEach((item) => buckets.set(item.category, [...(buckets.get(item.category) ?? []), item]));
  const queues = shuffled([...buckets.values()].map((bucket) => shuffled(bucket)));
  const result: string[] = [];
  let row = 0;
  while (result.length < Math.min(count, theme.items.length)) {
    for (const queue of queues) {
      if (queue[row]) result.push(queue[row].id);
      if (result.length >= count) break;
    }
    row += 1;
  }
  return result;
}

export function getThemeCountOptions(theme: LifeTheme, mode: ResponseMode) {
  const total = theme.items.length;
  const candidates = mode === "write"
    ? [3, 6, 12, total]
    : total > 50 ? [12, 30, 50, total] : [6, 12, 20, total];
  return [...new Set(candidates.filter((count) => count <= total))];
}
