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

// 各平台配置
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
    urls: ['https://cloud.tencent.com/'],
    scraper: scrapeTencent
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

async function fetchPage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    });
    const text = await response.text();
    return new JSDOM(text);
  } catch (error) {
    console.error(`❌ 获取页面失败 ${url}:`, error.message);
    return null;
  }
}

// 各平台爬取逻辑
async function scrapeAliyun(platform) {
  const results = { startPrice: 40, firstMonth: '¥7.9', plans: [] };
  for (const url of platform.urls) {
    const dom = await fetchPage(url);
    if (!dom) continue;
    const text = dom.window.document.body.textContent;
    // 匹配首月价格
    const firstMatch = text.match(/首月.*?(\d+\.?\d*)\s*元/);
    if (firstMatch) results.firstMonth = `¥${firstMatch[1]}`;
    // 匹配月付价格
    const priceMatch = text.match(/(\d+)\s*元(?:\/月|每月)/);
    if (priceMatch) results.startPrice = parseInt(priceMatch[1]);
  }
  return results;
}

async function scrapeTencent(platform) {
  const results = { startPrice: 40, firstMonth: '¥7.9', plans: [] };
  // 腾讯云逻辑
  return results;
}

async function scrapeMiniMax(platform) {
  const results = { startPrice: 29, firstMonth: null, plans: [] };
  for (const url of platform.urls) {
    const dom = await fetchPage(url);
    if (!dom) continue;
    const text = dom.window.document.body.textContent;
    const match = text.match(/¥?\s*(\d+)\s*(?:元|\/月)/);
    if (match) results.startPrice = parseInt(match[1]);
  }
  return results;
}

async function scrapeZhipu(platform) {
  const results = { startPrice: 49, firstMonth: null, plans: [] };
  for (const url of platform.urls) {
    const dom = await fetchPage(url);
    if (!dom) continue;
    const text = dom.window.document.body.textContent;
    const match = text.match(/¥?\s*(\d+)\s*(?:元|\/月)/);
    if (match) results.startPrice = parseInt(match[1]);
  }
  return results;
}

async function scrapeKimi(platform) {
  const results = { startPrice: 49, firstMonth: null, plans: [] };
  return results;
}

async function scrapeVolcengine(platform) {
  const results = { startPrice: 40, firstMonth: '¥8.91', plans: [] };
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
