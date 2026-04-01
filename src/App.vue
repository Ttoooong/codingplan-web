<template>
  <div :class="{ dark: isDark }">
    <header>
      <div class="container header-content">
        <div class="logo">
          <a href="#">CodingPlan</a>
        </div>
        <nav>
          <a href="#compare">快速对比</a>
          <a href="#platforms">详细方案</a>
          <a href="#faq">常见问题</a>
          <button class="theme-toggle" @click="toggleTheme">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
        </nav>
      </div>
    </header>

    <main>
      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <p class="subtitle">2026 · 持续更新中</p>
          <h1>国内 AI Coding Plan 对比</h1>
          <p class="subtitle">
            智谱 GLM · MiniMax · Kimi · 火山引擎方舟 · 阿里云百炼 · 腾讯云<br>
            价格、模型、用量限制全面横评，助你选出最适合的 Coding Plan
          </p>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">{{ platforms.length }}</div>
              <div class="stat-label">平台对比</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">¥{{ minPrice }}</div>
              <div class="stat-label">最低月付</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">10+</div>
              <div class="stat-label">支持模型</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">20+</div>
              <div class="stat-label">编程工具</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Compare Table -->
      <section id="compare">
        <div class="container">
          <h2>快速对比</h2>
          <p class="section-desc">各平台入门套餐一览，找到最适合你的起点</p>
          <div class="compare-table-wrapper">
            <table class="compare-table">
              <thead>
                <tr>
                  <th>平台</th>
                  <th>入门价</th>
                  <th>首月特惠</th>
                  <th>核心模型</th>
                  <th>用量参考</th>
                  <th>套餐数</th>
                  <th>亮点</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in platforms" :key="p.id">
                  <td>
                    <div class="platform">
                      {{ p.name }}
                    </div>
                  </td>
                  <td class="price">¥{{ p.startPrice }}/月</td>
                  <td>{{ p.firstMonth || '—' }}</td>
                  <td>{{ p.coreModel }}</td>
                  <td>{{ p.usage }}</td>
                  <td>{{ p.planCount }} 档</td>
                  <td>{{ p.highlight }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Platform Details -->
      <section id="platforms">
        <div class="container">
          <h2>详细方案</h2>
          <p class="section-desc">深入了解每个平台的套餐配置与定价</p>
          <div class="platforms">
            <div v-for="p in platforms" :key="p.id" class="platform-card">
              <div class="platform-header">
                <div class="platform-name">
                  {{ p.name }}
                  <small>{{ p.subtitle }}</small>
                </div>
                <div class="platform-price">
                  <div class="current">¥{{ p.startPrice }}/月</div>
                  <div v-if="p.firstMonth" class="original">¥{{ p.startPrice }}</div>
                </div>
              </div>
              <div class="plans">
                <div v-for="plan in p.plans" :key="plan.name" class="plan">
                  <div class="plan-name">
                    {{ plan.name }}
                    <small v-if="plan.tag">{{ plan.tag }}</small>
                  </div>
                  <div class="plan-features">
                    <div v-for="f in plan.features" :key="f">{{ f }}</div>
                  </div>
                  <div class="plan-price">
                    <template v-if="plan.monthlyPrice">
                      <div class="price">¥{{ plan.monthlyPrice }}/月</div>
                      <div v-if="plan.quarterlyPrice" class="desc">季付 ¥{{ plan.quarterlyPrice }} · 年付 ¥{{ plan.yearlyPrice }}</div>
                    </template>
                    <template v-else>
                      <div class="price">¥{{ plan.price }}</div>
                      <div v-if="plan.original" class="desc">首月 ¥{{ plan.original }}</div>
                    </template>
                  </div>
                </div>
              </div>
              <div v-if="p.note" class="platform-note">⚠️ {{ p.note }}</div>
              <div class="tools">
                <span v-for="t in p.tools" :key="t" class="tool-tag">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section id="faq">
        <div class="container">
          <h2>常见问题</h2>
          <p class="section-desc">关于 Coding Plan 的常见疑问</p>
          <div class="faq-list">
            <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
              <button class="faq-question" @click="toggleFaq(i)">
                {{ faq.q }}
                <span>{{ faqOpen === i ? '−' : '+' }}</span>
              </button>
              <div v-if="faqOpen === i" class="faq-answer">
                {{ faq.a }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="container">
        <p>
          <a href="https://bigmodel.cn/glm-coding" target="_blank">智谱 GLM</a>
          <a href="https://platform.minimaxi.com/subscribe/coding-plan" target="_blank">MiniMax</a>
          <a href="https://www.kimi.com/code" target="_blank">Kimi</a>
          <a href="https://www.volcengine.com/activity/codingplan" target="_blank">火山引擎方舟</a>
          <a href="https://www.aliyun.com/benefit/ai/aistar" target="_blank">阿里云百炼</a>
          <a href="https://curl.qcloud.com/kRhUF1xN" target="_blank">腾讯云</a>
        </p>
        <p>© 2026 codingplan.org · 国内 AI 编程套餐对比</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { platforms as platformData, faqs as faqData } from './data/platforms.js'

const isDark = ref(true)
const faqOpen = ref(null)

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const toggleFaq = (i) => {
  faqOpen.value = faqOpen.value === i ? null : i
}

const platforms = ref(platformData)

const minPrice = computed(() => {
  return Math.min(...platforms.value.map(p => p.startPrice))
})

const faqs = ref(faqData)
</script>
