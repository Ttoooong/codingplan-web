/**
 * 自动更新脚本
 * 1. 抓取各平台最新价格
 * 2. 更新 platforms.js 数据文件
 * 3. 自动推送到 GitHub（触发 Vercel 部署）
 */

import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../src/data/platforms.js');

// 各平台配置 - 更精确的 URL
const PLATFORMS = [
  {
    id: 'aliyun',
    name: '阿里云百炼',
    urls: ['https://www.aliyun.com/benefit/ai/aistar'],
    scraper: scrapeAliyun
  },
  {
    id: 'tencentcloud', 
    name: '腾讯云',
    urls: ['https://cloud.tencent.com/act/pro/codingplan'],
    scraper: scrapeTencent
  },
  {
    id: 'baidu',
    name: '百度千帆',
    urls: ['https://cloud.baidu.com/product/codingplan.html'],
    scraper: scrapeBaidu
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    urls: ['https://platform.minimaxi.com/subscribe/coding-plan'],
    scraper: scrapeMiniMax
  },
  {
    id: 'zhipu',
    name: '智谱 GLM',
    urls: ['https://bigmodel.cn/glm-coding'],
    scraper: scrapeZhipu
  },
  {
    id: 'kimi',
    name: 'Kimi',
    urls: ['https://www.kimi.com/code'],
    scraper: scrapeKimi
  },
  {
    id: 'volcengine',
    name: '火山引擎方舟',
    urls: ['https://www.volcengine.com/activity/codingplan'],
    scraper: scrapeVolcengine
  }
];

// 模拟浏览器请求头
const FETCH_OPTIONS = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  }
};

async function fetchPage(url) {
  try {
    const response = await fetch(url, FETCH_OPTIONS);
    const text = await response.text();
    return new JSDOM(text, { runScripts: 'dangerously' });
  } catch (error) {
    console.error(`❌ 获取页面失败 ${url}:`, error.message);
    return null;
  }
}

// 阿里云百炼
async function scrapeAliyun(platform) {
  const results = { startPrice: 40, firstMonth: '¥0.8', plans: [] };
  try {
    const dom = await fetchPage(platform.urls[0]);
    if (!dom) return results;
    const text = dom.window.document.body.textContent;
    
    // 匹配首月价格 - 多种模式
    const firstPatterns = [
      /首月[¥￥]?\s*(\d+\.?\d*)/,
      /首月特惠[¥￥]?\s*(\d+\.?\d*)/,
      /首月.*?(\d+\.?\d*)\s*元/
    ];
    for (const pattern of firstPatterns) {
      const match = text.match(pattern);
      if (match) {
        results.firstMonth = `¥${match[1]}`;
        break;
      }
    }
    
    // 匹配月付价格
    const pricePatterns = [
      /(\d+)\s*元\/月/,
      /月付[¥￥]?\s*(\d+)/,
      /(\d+)\s*元(?:\/月|每月)/
    ];
    for (const pattern of pricePatterns) {
      const match = text.match(pattern);
      if (match) {
        results.startPrice = parseInt(match[1]);
        break;
      }
    }
  } catch (e) {
    console.error(`  ⚠️ 阿里云解析失败: ${e.message}`);
  }
  return results;
}

// 腾讯云 Coding Plan
async function scrapeTencent(platform) {
  const results = { startPrice: 40, firstMonth: '¥7.9', plans: [] };
  try {
    const dom = await fetchPage(platform.urls[0]);
    if (!dom) return results;
    const text = dom.window.document.body.textContent;
    
    // 匹配首月价格
    const firstPatterns = [
      /首月[¥￥]?\s*(\d+\.?\d*)/,
      /首月特惠[¥￥]?\s*(\d+\.?\d*)/,
      /¥\s*(\d+\.?\d*)\s*起/
    ];
    for (const pattern of firstPatterns) {
      const match = text.match(pattern);
      if (match) {
        results.firstMonth = `¥${match[1]}`;
        break;
      }
    }
    
    // 匹配价格
    const pricePatterns = [
      /(\d+)\s*元\/月/,
      /Lite.*?(\d+)\s*元/,
      /(\d+)\s*元起/
    ];
    for (const pattern of pricePatterns) {
      const match = text.match(pattern);
      if (match) {
        results.startPrice = parseInt(match[1]);
        break;
      }
    }
  } catch (e) {
    console.error(`  ⚠️ 腾讯云解析失败: ${e.message}`);
  }
  return results;
}

// 百度千帆
async function scrapeBaidu(platform) {
  const results = { startPrice: 49, firstMonth: null, plans: [] };
  try {
    const dom = await fetchPage(platform.urls[0]);
    if (!dom) return results;
    const text = dom.window.document.body.textContent;
    
    // 匹配价格
    const pricePatterns = [
      /(\d+)\s*元\/月/,
      /(\d+)\s*元起/,
      /Lite.*?(\d+)/,
      /(\d+)\s*元/
    ];
    for (const pattern of pricePatterns) {
      const match = text.match(pattern);
      if (match && parseInt(match[1]) > 0) {
        results.startPrice = parseInt(match[1]);
        break;
      }
    }
  } catch (e) {
    console.error(`  ⚠️ 百度解析失败: ${e.message}`);
  }
  return results;
}

// MiniMax
async function scrapeMiniMax(platform) {
  const results = { startPrice: 29, firstMonth: null, plans: [] };
  try {
    const dom = await fetchPage(platform.urls[0]);
    if (!dom) return results;
    const text = dom.window.document.body.textContent;
    
    // 匹配 Starter 价格
    const starterPatterns = [
      /Starter[^\d]*(\d+)\s*元/,
      /¥\s*(\d+)\s*(?:元|\/月).*?Starter/
    ];
    for (const pattern of starterPatterns) {
      const match = text.match(pattern);
      if (match) {
        results.startPrice = parseInt(match[1]);
        break;
      }
    }
  } catch (e) {
    console.error(`  ⚠️ MiniMax 解析失败: ${e.message}`);
  }
  return results;
}

// 智谱 GLM
async function scrapeZhipu(platform) {
  const results = { startPrice: 49, firstMonth: null, plans: [] };
  try {
    const dom = await fetchPage(platform.urls[0]);
    if (!dom) return results;
    const text = dom.window.document.body.textContent;
    
    // 匹配 Lite 价格
    const litePatterns = [
      /Lite[^\d]*(\d+)\s*元/,
      /GLM.*?Lite.*?(\d+)/,
      /¥\s*(\d+).*?Lite/
    ];
    for (const pattern of litePatterns) {
      const match = text.match(pattern);
      if (match) {
        results.startPrice = parseInt(match[1]);
        break;
      }
    }
  } catch (e) {
    console.error(`  ⚠️ 智谱解析失败: ${e.message}`);
  }
  return results;
}

// Kimi
async function scrapeKimi(platform) {
  const results = { startPrice: 49, firstMonth: null, plans: [] };
  try {
    const dom = await fetchPage(platform.urls[0]);
    if (!dom) return results;
    const text = dom.window.document.body.textContent;
    
    // 匹配价格 - Kimi 有 Andante(49元) 和 Moderato(99元)
    const pricePatterns = [
      /Andante.*?(\d+)\s*元/,
      /(\d+)\s*元.*?Andante/,
      /K2\.5.*?(\d+)\s*元/
    ];
    for (const pattern of pricePatterns) {
      const match = text.match(pattern);
      if (match) {
        results.startPrice = parseInt(match[1]);
        break;
      }
    }
  } catch (e) {
    console.error(`  ⚠️ Kimi 解析失败: ${e.message}`);
  }
  return results;
}

// 火山引擎方舟
async function scrapeVolcengine(platform) {
  const results = { startPrice: 40, firstMonth: '¥8.91', plans: [] };
  try {
    const dom = await fetchPage(platform.urls[0]);
    if (!dom) return results;
    const text = dom.window.document.body.textContent;
    
    // 匹配首月价格
    const firstPatterns = [
      /首月[¥￥]?\s*(\d+\.?\d*)/,
      /首月.*?(\d+\.?\d*)\s*元/,
      /¥\s*(\d+\.?\d*)\s*首月/
    ];
    for (const pattern of firstPatterns) {
      const match = text.match(pattern);
      if (match) {
        results.firstMonth = `¥${match[1]}`;
        break;
      }
    }
    
    // 匹配月付价格
    const pricePatterns = [
      /(\d+)\s*元\/月/,
      /Lite.*?(\d+)\s*元/
    ];
    for (const pattern of pricePatterns) {
      const match = text.match(pattern);
      if (match) {
        results.startPrice = parseInt(match[1]);
        break;
      }
    }
  } catch (e) {
    console.error(`  ⚠️ 火山引擎解析失败: ${e.message}`);
  }
  return results;
}

// 更新 platforms.js 文件
function updateDataFile(updates) {
  const timestamp = new Date().toISOString().split('T')[0];
  
  // 读取现有数据
  let content = fs.readFileSync(DATA_FILE, 'utf-8');
  
  // 更新每个平台的价格
  for (const update of updates) {
    if (update.error) continue;
    
    // 使用正则替换 startPrice
    const startPriceRegex = new RegExp(`(id: '${update.id}'[^}]*startPrice:\\s*)\\d+`, 'g');
    content = content.replace(startPriceRegex, `$1${update.startPrice || 40}`);
    
    // 更新 firstMonth
    if (update.firstMonth) {
      const firstMonthRegex = new RegExp(`(id: '${update.id}'[^}]*firstMonth:\\s*)'[^']*'`, 'g');
      content = content.replace(firstMonthRegex, `$1'${update.firstMonth}'`);
    }
  }
  
  // 更新时间戳
  content = content.replace(
    /(\*\s*更新时间：)\d{4}-\d{2}-\d{2}/,
    `$1${timestamp}`
  );
  
  fs.writeFileSync(DATA_FILE, content, 'utf-8');
  console.log(`✅ 数据已更新到 ${DATA_FILE}`);
}

// 主函数
async function main() {
  console.log('🚀 开始自动更新价格数据...\n');
  
  const results = [];
  
  for (const platform of PLATFORMS) {
    console.log(`📡 正在抓取 ${platform.name}...`);
    try {
      const data = await platform.scraper(platform);
      results.push({
        id: platform.id,
        name: platform.name,
        ...data,
        updatedAt: new Date().toISOString()
      });
      console.log(`   ✅ ${platform.name}: ¥${data.startPrice}/月 ${data.firstMonth ? `(${data.firstMonth})` : ''}`);
    } catch (error) {
      console.error(`   ❌ ${platform.name} 失败:`, error.message);
      results.push({ id: platform.id, name: platform.name, error: error.message });
    }
  }
  
  // 更新数据文件
  updateDataFile(results);
  
  console.log('\n🎉 更新完成!');
  
  // 输出结果供后续步骤使用
  return results;
}

main().catch(console.error);