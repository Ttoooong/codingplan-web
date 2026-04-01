/**
 * 国内 AI Coding Plan 数据
 * 每个平台的数据在这里更新
 * 
 * 更新时间：2026-04-01
 * 
 * 数据来源：
 * - 阿里云百炼: https://www.aliyun.com/benefit/ai/aistar
 * - 腾讯云: https://cloud.tencent.com/
 * - 百度智能云: https://cloud.baidu.com/
 * - MiniMax: 
 *   - Token Plan (月付/年付): https://platform.minimaxi.com/subscribe/token-plan
 *   - Coding Plan: https://platform.minimaxi.com/subscribe/coding-plan
 * - 智谱 GLM: https://bigmodel.cn/glm-coding
 * - Kimi: https://www.kimi.com/code
 * - 火山引擎: https://www.volcengine.com/
 */

export const platforms = [
  {
    id: 'aliyun',
    name: '阿里云百炼',
    subtitle: '首月特惠',
    startPrice: 40,
    firstMonth: '¥0.8',
    coreModel: '千问系列 + GLM + Kimi',
    usage: '1200次/5h',
    planCount: 2,
    highlight: '首月最低',
    website: 'https://www.aliyun.com/benefit/ai/aistar',
    note: '仅主账号可用，不支持 RAM 用户 · 禁止 API 调用 · 不支持退订退款',
    plans: [
      { name: 'Lite', features: ['1,200 次请求/5小时', '9,000 次/周', '18,000 次/月'], price: 40, original: 7.9 },
      { name: 'Pro', tag: '高阶', features: ['6,000 次请求/5小时', '45,000 次/周', '90,000 次/月'], price: 200, original: 39.9 }
    ],
    tools: ['Claude Code', 'Cursor', 'Cline', 'OpenCode', 'Codex CLI']
  },
  {
    id: 'tencentcloud',
    name: '腾讯云',
    subtitle: '首月 ¥7.9',
    startPrice: 40,
    firstMonth: '¥7.9',
    coreModel: 'HY 2.0 · GLM-5 · Kimi-K2.5 · M2.5',
    usage: '1200次/5h',
    planCount: 2,
    highlight: '腾讯自研',
    website: 'https://cloud.tencent.com/',
    note: null,
    plans: [
      { name: 'Lite', tag: '限时特惠', features: ['~1,200 次请求/5小时', '~9,000 次/周', '全部支持模型可用'], price: 40, original: 7.9 },
      { name: 'Pro', tag: '专业首选', features: ['~6,000 次请求/5小时', '5倍 Lite 用量配额'], price: 200, original: 39.9 }
    ],
    tools: ['OpenClaw', 'Claude Code', 'Cline', 'Cursor']
  },
  {
    id: 'baidu',
    name: '百度智能云',
    subtitle: '文心一言',
    startPrice: 49,
    firstMonth: null,
    coreModel: 'ERNIE 4.0 / 3.5',
    usage: '待确认',
    planCount: 2,
    highlight: '文心一言',
    website: 'https://cloud.baidu.com/',
    note: '待补充最新信息',
    plans: [
      { name: 'Lite', features: ['待确认'], price: 49 },
      { name: 'Pro', features: ['待确认'], price: 199 }
    ],
    tools: ['Claude Code', 'Cursor']
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    subtitle: 'M2.7 + 100+ TPS',
    startPrice: 29,
    firstMonth: null,
    coreModel: 'M2.7, M2.7-highspeed',
    usage: '600次/5h',
    planCount: 6,
    highlight: 'M2.7 新旗舰',
    website: 'https://platform.minimaxi.com/subscribe/token-plan',
    note: '支持月付/年付，年付享折扣',
    plans: [
      { 
        name: 'Starter', 
        tag: '入门', 
        monthlyPrice: 29,
        yearlyPrice: 290,
        yearlyOriginal: 348,
        features: ['600次/5小时', '入门级开发场景', '约支持1个Agent'] 
      },
      { 
        name: 'Plus', 
        monthlyPrice: 49,
        yearlyPrice: 490,
        yearlyOriginal: 588,
        features: ['1500次/5小时', '2.5倍 Starter 用量', '约支持1~2个Agent'] 
      },
      { 
        name: 'Max', 
        monthlyPrice: 119,
        yearlyPrice: 1190,
        yearlyOriginal: 1490,
        features: ['4500次/5小时', '7.5倍 Starter 用量', '约支持2~3个Agent'] 
      },
      { 
        name: 'Plus-极速版', 
        tag: '100TPS',
        monthlyPrice: 98,
        yearlyPrice: 980,
        yearlyOriginal: 1176,
        features: ['1500次/5小时', '约100 TPS极速推理', '同类产品3倍速度'] 
      },
      { 
        name: 'Max-极速版', 
        tag: '100TPS',
        monthlyPrice: 199,
        yearlyPrice: 1990,
        yearlyOriginal: 2388,
        features: ['4500次/5小时', '约100 TPS极速推理', '约支持2~3个Agent'] 
      },
      { 
        name: 'Ultra-极速版', 
        tag: '100TPS',
        monthlyPrice: 899,
        yearlyPrice: 8990,
        yearlyOriginal: 9648,
        features: ['30000次/5小时', '50倍 Starter 用量', '约支持4~5个Agent'] 
      }
    ],
    tools: ['Claude Code', 'Roo Code', 'Kilo Code', 'Cline', 'Codex CLI', 'OpenCode', 'Cursor', 'TRAE', 'Grok CLI', 'Droid']
  },
  {
    id: 'zhipu',
    name: '智谱 GLM',
    subtitle: 'GLM-5 旗舰',
    startPrice: 49,
    firstMonth: null,
    coreModel: 'GLM-5, GLM-4.7',
    usage: '3x Claude Pro',
    planCount: 3,
    highlight: '含 MCP 工具',
    website: 'https://bigmodel.cn/glm-coding',
    note: '支持月付/季付/年付，季付9折，年付8折',
    plans: [
      { 
        name: 'Lite', 
        tag: '入门',
        monthlyPrice: 49,
        quarterlyPrice: 132.3,
        yearlyPrice: 441.6,
        features: ['3x Claude Pro 用量', '适合小型 Repo', '支持 20+ 编程工具'] 
      },
      { 
        name: 'Pro', 
        tag: '最受欢迎',
        monthlyPrice: 149,
        quarterlyPrice: 402.3,
        yearlyPrice: 1340.8,
        features: ['5x Lite 用量', '优先体验最新模型', '覆盖多款 MCP 工具', '更快生成速度'] 
      },
      { 
        name: 'Max', 
        tag: '量大管饱',
        monthlyPrice: 469,
        quarterlyPrice: 1266.3,
        yearlyPrice: 4502.4,
        features: ['20x Lite 用量', '高峰期专属优先保障', '首发接入最新模型'] 
      }
    ],
    tools: ['Claude Code', 'Roo Code', 'Kilo Code', 'Cline', 'OpenCode', 'Cursor', 'OpenClaw', 'Crush', 'Factory']
  },
  {
    id: 'kimi',
    name: 'Kimi',
    subtitle: '含会员权益',
    startPrice: 49,
    firstMonth: null,
    coreModel: 'Kimi K2.5',
    usage: '300-1200次/5h',
    planCount: 2,
    highlight: '含会员权益',
    website: 'https://www.kimi.com/',
    note: '额度每7天刷新，未用完不累积 · 最大并发30',
    plans: [
      { name: 'Andante', tag: '基础', features: ['300-1,200次 API 调用/5h', '额度每7天刷新', '旗舰模型抢先体验'], price: 49 },
      { name: 'Moderato', tag: '推荐', features: ['更大额度', '多设备登录共享额度', '支持 Claude Code / Roo Code'], price: 99 }
    ],
    tools: ['Kimi CLI', 'Claude Code', 'Roo Code', 'Kimi Code for VS Code']
  },
  {
    id: 'volcengine',
    name: '火山引擎方舟',
    subtitle: '首月 ¥8.91',
    startPrice: 40,
    firstMonth: '¥8.91',
    coreModel: '豆包·DeepSeek·Kimi·GLM 等 6 款',
    usage: '数倍 Claude Pro',
    planCount: 2,
    highlight: '模型最多',
    website: 'https://www.volcengine.com/',
    note: '首月2.5折，2月下单次月再享5折',
    plans: [
      { name: 'Lite', tag: '首月2.5折', features: ['数倍于 Claude Pro 用量', '支持多模型自由切换', 'Auto 模式智能调度'], price: 40, original: 8.91 },
      { name: 'Pro', tag: '最受欢迎', features: ['5倍 Lite 用量', '满足高阶大规模编程需求'], price: 200, original: 44.91 }
    ],
    tools: ['Claude Code', 'Cursor', 'Cline', 'Codex CLI', 'Kilo Code']
  }
]

export const faqs = [
  {
    q: '什么是 Coding Plan？',
    a: 'Coding Plan 是各大 AI 平台推出的编程订阅套餐，专门针对 AI 编程场景优化，提供比普通 API 订阅更高的用量限制和更优惠的价格。'
  },
  {
    q: 'Coding Plan 支持哪些编程工具？',
    a: '主流支持 Claude Code、Cursor、Cline、Roo Code、Codex CLI、Kilo Code、OpenCode 等。不同平台支持的工具略有差异，详见各平台方案。'
  },
  {
    q: '「5小时限额」是什么意思？',
    a: '5小时限额是指在任何连续5小时的时间窗口内，你最多可以使用对应套餐的额度。超过5小时后，额度会重置刷新。'
  },
  {
    q: '一次提问会消耗多少额度？',
    a: '这取决于具体实现，一次提问约触发 5-30 次模型调用。不同平台、不同工具的实现方式可能略有差异。'
  },
  {
    q: '哪个平台性价比最高？',
    a: '如果追求最低首月价格，腾讯云和阿里云都是 ¥7.9 起；如果追求稳定使用和丰富功能，MiniMax（100+ TPS）和智谱 GLM（含 MCP）是不错的选择。'
  },
  {
    q: '可以退款吗？',
    a: '大部分平台不支持退订退款，建议先选择最低档位试用，确认满足需求后再升级。部分平台有首月特惠，请仔细阅读条款。'
  }
]
