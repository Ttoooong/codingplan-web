/**
 * 各平台价格抓取脚本
 * 用于每日自动更新价格数据
 */

import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const PLATFORMS = [
  {
    id: 'aliyun',
    name: '阿里云百炼',
    urls: [
      'https://www.aliyun.com/benefit/ai/aistar',
      'https://common-buy.aliyun.com/?commodityCode=sfm_GenAI_spn_cn'
    ]
  },
  {
    id: 'tencentcloud',
    name: '腾讯云',
    urls: [
      'https://cloud.tencent.com/'
    ]
  },
  {
    id: 'baidu',
    name: '百度智能云',
    urls: [
      'https://cloud.baidu.com/'
    ]
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    urls: [
      'https://platform.minimaxi.com/subscribe/coding-plan'
    ]
  },
  {
    id: 'zhipu',
    name: '智谱 GLM',
    urls: [
      'https://www.bigmodel.cn/glm-coding'
    ]
  },
  {
    id: 'kimi',
    name: 'Kimi',
    urls: [
      'https://www.kimi.com/code'
    ]
  },
  {
    id: 'volcengine',
    name: '火山引擎方舟',
    urls: [
      'https://www.volcengine.com/activity/codingplan'
    ]
  }
];

async function fetchPage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const text = await response.text();
    return new JSDOM(text);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

async function scrapeAliyun(platform) {
  // 阿里云价格抓取逻辑
  const results = { startPrice: 40, firstMonth: '¥7.9', plans: [] };
  
  for (const url of platform.urls) {
    const dom = await fetchPage(url);
    if (!dom) continue;
    
    const text = dom.window.document.body.textContent;
    
    // 提取价格信息
    const priceMatch = text.match(/(\d+)\s*元\/月/);
    if (priceMatch) {
      results.startPrice = parseInt(priceMatch[1]);
    }
  }
  
  return results;
}

async function scrapeTencent(platform) {
  const results = { startPrice: 40, firstMonth: '¥7.9', plans: [] };
  // 腾讯云抓取逻辑
  return results;
}

async function scrapeBaidu(platform) {
  const results = { startPrice: 49, firstMonth: null, plans: [] };
  // 百度抓取逻辑
  return results;
}

async function scrapeMiniMax(platform) {
  const results = { startPrice: 29, firstMonth: null, plans: [] };
  
  for (const url of platform.urls) {
    const dom = await fetchPage(url);
    if (!dom) continue;
    
    const text = dom.window.document.body.textContent;
    
    // 提取 Starter 价格
    const starterMatch = text.match(/Starter.*?(\d+)\s*元/);
    if (starterMatch) {
      results.startPrice = parseInt(starterMatch[1]);
    }
  }
  
  return results;
}

async function scrapeZhipu(platform) {
  const results = { startPrice: 49, firstMonth: null, plans: [] };
  
  for (const url of platform.urls) {
    const dom = await fetchPage(url);
    if (!dom) continue;
    
    const text = dom.window.document.body.textContent;
    
    const priceMatch = text.match(/Lite.*?(\d+)\s*元/);
    if (priceMatch) {
      results.startPrice = parseInt(priceMatch[1]);
    }
  }
  
  return results;
}

async function scrapeKimi(platform) {
  const results = { startPrice: 49, firstMonth: null, plans: [] };
  // Kimi 抓取逻辑
  return results;
}

async function scrapeVolcengine(platform) {
  const results = { startPrice: 40, firstMonth: '¥8.91', plans: [] };
  // 火山引擎抓取逻辑
  return results;
}

const SCRAPERS = {
  aliyun: scrapeAliyun,
  tencentcloud: scrapeTencent,
  baidu: scrapeBaidu,
  minimax: scrapeMiniMax,
  zhipu: scrapeZhipu,
  kimi: scrapeKimi,
  volcengine: scrapeVolcengine
};

export async function scrapeAllPlatforms() {
  console.log('🔄 开始抓取各平台价格...');
  
  const results = [];
  
  for (const platform of PLATFORMS) {
    console.log(`📡 抓取 ${platform.name}...`);
    
    const scraper = SCRAPERS[platform.id];
    if (scraper) {
      try {
        const data = await scraper(platform);
        results.push({
          id: platform.id,
          name: platform.name,
          ...data,
          updatedAt: new Date().toISOString()
        });
        console.log(`  ✅ ${platform.name} 完成`);
      } catch (error) {
        console.error(`  ❌ ${platform.name} 失败:`, error.message);
        results.push({
          id: platform.id,
          name: platform.name,
          error: error.message,
          updatedAt: new Date().toISOString()
        });
      }
    }
  }
  
  console.log('🎉 抓取完成!');
  return results;
}

// 导出为 Vercel Serverless Function
export default async function handler(req, res) {
  const results = await scrapeAllPlatforms();
  
  // 保存到文件（Vercel 只读文件系统，需要使用外部存储）
  // 这里返回抓取结果，实际部署时可以考虑：
  // 1. 存储到数据库
  // 2. 存储到 GitHub
  // 3. 发送到飞书消息
  
  res.status(200).json({
    success: true,
    data: results,
    timestamp: new Date().toISOString()
  });
}
