export type Task = {
  id: number;
  category: string;
  title: string;
  description: string;
  tags: string[];
};

export const tasks: Task[] = [
  { id: 1, category: "平凡日常", title: "一起去逛一次超市", description: "不赶时间，慢慢挑一些对方喜欢吃的东西。", tags: ["低预算", "约1小时", "日常"] },
  { id: 2, category: "深度交流", title: "认真讲一次自己的童年", description: "把那些没来得及认识的过去，慢慢讲给对方听。", tags: ["免费", "宅家", "需要安静"] },
  { id: 3, category: "浪漫仪式", title: "给对方写一封纸质信", description: "不是聊天记录，而是一封可以被保存很多年的信。", tags: ["低预算", "仪式感", "可异地"] },
  { id: 4, category: "旅行探索", title: "一起去一座陌生的小城", description: "不必安排得很满，只需要一起迷一次路。", tags: ["周末", "中等预算", "旅行"] },
  { id: 5, category: "平凡日常", title: "一起做一顿晚饭", description: "一个人切菜，一个人负责把厨房弄得一团糟。", tags: ["低预算", "宅家", "约2小时"] },
  { id: 6, category: "照顾陪伴", title: "在对方难过时安静陪着", description: "不急着讲道理，也不催促 TA 马上变好。", tags: ["免费", "陪伴", "任何时候"] },
  { id: 7, category: "浪漫仪式", title: "偷偷准备一次小惊喜", description: "不需要昂贵，只要让 TA 知道你有认真想过。", tags: ["低预算", "惊喜", "仪式感"] },
  { id: 8, category: "旅行探索", title: "一起看一次日出", description: "在天亮之前出发，看城市慢慢醒过来。", tags: ["早起", "户外", "浪漫"] },
  { id: 9, category: "共同成长", title: "一起存下一笔旅行基金", description: "让一个遥远的地方，慢慢变成真实的计划。", tags: ["长期", "共同目标", "旅行"] },
  { id: 10, category: "平凡日常", title: "下雨天窝在家看一部电影", description: "关掉消息提醒，把一个下午留给彼此。", tags: ["宅家", "低预算", "雨天"] },
  { id: 11, category: "深度交流", title: "交换彼此最近的烦恼", description: "不是解决问题，只是认真听完对方的话。", tags: ["免费", "沟通", "约30分钟"] },
  { id: 12, category: "吃喝约会", title: "带对方去吃自己最喜欢的店", description: "把自己的味觉记忆，也分享给喜欢的人。", tags: ["约会", "低至中等预算", "美食"] },
  { id: 13, category: "未来想象", title: "一起画出理想中的家", description: "不用考虑现实，先看看你们心里的未来是什么样子。", tags: ["宅家", "未来", "免费"] },
  { id: 14, category: "浪漫仪式", title: "拍一组普通但真实的合照", description: "不需要精致摆拍，只记录你们本来的样子。", tags: ["低预算", "纪念", "拍照"] },
  { id: 15, category: "共同成长", title: "一起学习一项新技能", description: "可以学做饭、拍照、游泳，或者一门新的语言。", tags: ["长期", "成长", "共同体验"] },
];
