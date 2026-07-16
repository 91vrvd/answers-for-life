export type ChallengeTask = {
  id: number;
  category: "换个日常" | "重新连接" | "照顾身体" | "整理内心" | "独自出发" | "为未来做点事";
  title: string;
  description: string;
};

export const challengeTasks: ChallengeTask[] = [
  { id: 1, category: "换个日常", title: "去一家从来没去过的小店吃饭", description: "不用追求网红店，只是把熟悉的一餐换成新的风景。" },
  { id: 2, category: "换个日常", title: "换一种平时不用的交通方式回家", description: "提前一站下车、坐一次公交，或沿一条新路线慢慢走。" },
  { id: 3, category: "重新连接", title: "联系一位很久没说话的老朋友", description: "不必铺垫太多，一句“最近好吗”就足够开始。" },
  { id: 4, category: "为未来做点事", title: "完整读完一本一直想读的书", description: "每天几页也可以，重要的是重新把注意力交给自己。" },
  { id: 5, category: "换个日常", title: "留出半天，暂时离开网络", description: "关掉不必要的消息，让这半天只发生在真实生活里。" },
  { id: 6, category: "照顾身体", title: "比平时早起一小时，吃顿丰盛早餐", description: "不赶时间地开始一天，看看清晨原来是什么样子。" },
  { id: 7, category: "重新连接", title: "为家人或朋友认真做一顿饭", description: "不用复杂，做一道你愿意和他们分享的菜。" },
  { id: 8, category: "换个日常", title: "尝试一种从来没喝过的饮品", description: "给味觉一个小意外，也给普通一天加一个记忆点。" },
  { id: 9, category: "独自出发", title: "一个人去看一场电影", description: "不用等谁有空，自己决定时间、座位和散场后的去处。" },
  { id: 10, category: "独自出发", title: "在陌生菜单里，只点自己想吃的", description: "不参考别人的选择，认真听一次自己的胃口。" },
  { id: 11, category: "整理内心", title: "写一封信给一年后的自己", description: "写下此刻在意的事，也留一句未来才能拆开的问候。" },
  { id: 12, category: "换个日常", title: "整理一个拖了很久的小角落", description: "只整理一个抽屉、一层书架或一个相册，不必大扫除。" },
  { id: 13, category: "照顾身体", title: "不带目的地，独自散步四十分钟", description: "不计算步数，也不赶路，只留意身体和街道的声音。" },
  { id: 14, category: "为未来做点事", title: "学会做一道从没做过的菜", description: "允许第一次不完美，把它变成以后可以照顾自己的能力。" },
  { id: 15, category: "整理内心", title: "拒绝一次其实不想答应的请求", description: "用平静而清楚的话，为自己的时间留下一点边界。" },
  { id: 16, category: "整理内心", title: "记下今天三件具体的开心小事", description: "越具体越好：一阵风、一句话，或一口刚好的食物。" },
  { id: 17, category: "独自出发", title: "去户外完整看一次日落", description: "提前一点到，不拍也可以，只看天色慢慢变化。" },
  { id: 18, category: "照顾身体", title: "体验一次以前没试过的运动", description: "不追求表现，先找到一种身体愿意继续的感觉。" },
  { id: 19, category: "照顾身体", title: "认真安排一次八小时睡眠", description: "提前放下手机，把充足睡眠当成今天最重要的约会。" },
  { id: 20, category: "重新连接", title: "认真向一个人表达感谢", description: "说清楚对方做过什么，以及那件事为什么对你重要。" },
  { id: 21, category: "为未来做点事", title: "为一个期待的目标存下第一笔钱", description: "金额不重要，它会让模糊的愿望第一次有了形状。" },
  { id: 22, category: "换个日常", title: "穿一套平时不太敢穿的衣服出门", description: "不是为了得到评价，只体验一次更自由的自己。" },
  { id: 23, category: "独自出发", title: "一个人去逛展览、书店或博物馆", description: "按自己的速度停留，不需要照顾任何人的兴趣。" },
  { id: 24, category: "换个日常", title: "送走十件已经不再需要的东西", description: "丢弃、捐出或转送都可以，给生活腾出一点空白。" },
  { id: 25, category: "重新连接", title: "和喜欢的人分享一首最近常听的歌", description: "顺便告诉TA，哪一句或哪个瞬间让你停了下来。" },
  { id: 26, category: "整理内心", title: "关掉消息通知，独处一个下午", description: "不急着回复世界，先看看安静里的自己想做什么。" },
  { id: 27, category: "为未来做点事", title: "学会一个马上能用的小技能", description: "可以是急救、拍照、修理、做饭，或一句新的外语。" },
  { id: 28, category: "照顾身体", title: "吃一顿完全不看屏幕的饭", description: "慢一点咀嚼，也留意自己什么时候已经吃饱。" },
  { id: 29, category: "整理内心", title: "写下一件决定不再责怪自己的事", description: "承认当时的局限，然后把今天的自己从那里接回来。" },
  { id: 30, category: "为未来做点事", title: "计划一次真正期待的小出发", description: "不一定很远，先确定地点、时间和第一步。" },
];

export function getChallengeTask(id: number) {
  return challengeTasks.find((task) => task.id === id);
}
