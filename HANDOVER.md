# 项目交接文档 · 宏观雷达

> 本文档面向接手本项目的工程师 / 助教 / 评审人员，按 8 个模块梳理项目全貌、文件清单与执行步骤，便于在 30 分钟内进入开发状态。

## 目录

1. [项目概述](#1-项目概述)
2. [系统架构说明](#2-系统架构说明)
3. [环境配置](#3-环境配置)
4. [核心功能模块说明](#4-核心功能模块说明)
5. [数据设计（JSON 结构）](#5-数据设计json-结构)
6. [已知问题与待办事项](#6-已知问题与待办事项)
7. [部署流程与注意事项](#7-部署流程与注意事项)
8. [文件清单与用途](#8-文件清单与用途)

---

## 1. 项目概述

| 字段 | 内容 |
|---|---|
| 项目名称 | 宏观雷达 · 美股市场观察 |
| 一句话定位 | 把 IMA 121 知识库最新宏观研报整理成可公开访问的结构化观察笔记 |
| 项目目标 | (1) 12 篇宏观研报的结构化展示；(2) 原文摘录 + 核心观点 + 逻辑链 + 关键数据可视化 + 结论；(3) 移动优先、无前端框架、零运行时依赖；(4) 通过 GitHub Pages 公网访问 |
| 技术栈 | 纯静态前端：HTML5 + CSS3（CSS 变量 / media query / `@media print` / `prefers-reduced-motion`）+ 原生 JavaScript（ES2017+）；数据存储 `JSON`；部署 `GitHub Actions` + `actions/deploy-pages@v4`；外部依赖：Microsoft Edge 浏览器（仅作 headless 截图） |
| 代码体量 | HTML 1 文件 ~330 行；CSS 1 文件 ~1100 行；JS 1 文件 ~430 行；JSON 1 文件 ~750 行；5 张 PNG + 1 SVG；文档 5 个 `.md` |
| 外部运行时 | **零**。无 npm / node_modules / Python 运行时 / API Key |
| 仓库 | <https://github.com/8scolding8/tradingagents> |
| 线上站点 | <https://8scolding8.github.io/tradingagents/> |

### 1.1 关键约束（课件硬要求，复述以便接手核对）

- 五区块结构固定：Hero / About / Skills / Projects / Contact，不可增删
- 移动优先：`@media` 阶梯 `640px` / `1024px`
- 最多 2 个主色：`#0B3D91`（深蓝）+ `#F5B400`（亮金）
- 不引入无关依赖（无 npm、无前端框架）
- 不写入 API Key / Token / 邀请码
- 至少 3 次有意义 commit（实际已完成 8 次）
- GitHub Pages 公网链接可直接访问（已部署上线）

---

## 2. 系统架构说明

### 2.1 总体架构（分层）

```
┌──────────────────────────────────────────────────────────────┐
│                用户浏览器（任何设备 / 无痕窗口）              │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTP GET /index.html
                       ▼
┌──────────────────────────────────────────────────────────────┐
│     GitHub Pages CDN（静态托管，由 GitHub Actions 触发）      │
│     Source: 仓库 main 分支的 site/ 目录                      │
└──────────────────────┬───────────────────────────────────────┘
                       │ 静态资源（HTML / CSS / JS / JSON / PNG）
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                    site/（纯静态单页）                       │
│  ┌─────────┐ ┌──────────────┐ ┌──────────┐ ┌──────────────┐ │
│  │  HTML    │ │  CSS          │ │   JS     │ │   JSON       │ │
│  │骨架 + 语义│ │ 设计系统 + 布局│ │ 行为 + 渲染│ │   研报数据    │ │
│  └─────────┘ └──────────────┘ └──────────┘ └──────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │            assets/images/ (5 PNG + 1 SVG)                │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│            GitHub Actions（CI/CD）                            │
│  .github/workflows/pages.yml：push main → upload site/ → deploy │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 模块划分（前端层）

| 模块 | 文件 | 职责 | 依赖 |
|---|---|---|---|
| 骨架 | `site/index.html` | DOM 语义 + ARIA + 加载骨架 + 模板挂载点 | 无 |
| 设计系统 | `site/styles/main.css` | CSS 变量（颜色 / 字体 / 间距 / 阴影）、媒体查询、动画 | 无 |
| 行为 | `site/scripts/main.js` | 导航折叠、Ticker 滚动、报告渲染、SVG 图表、筛选、tilt、parallax、滚动揭示 | `fetch` `IntersectionObserver` `prefers-reduced-motion` |
| 数据 | `site/assets/data/reports.json` | 12 篇研报；含分类、原文、观点、逻辑链、图表数据、关键数据、结论 | 无 |
| 静态资源 | `site/assets/images/*` | favicon + TradingAgents 公开 PNG（Apache-2.0） | 无 |
| 自动化 | `.github/workflows/pages.yml` | 推送 `main` 后将 `site/` 部署到 Pages | `actions/checkout@v4` `actions/configure-pages@v5` `actions/upload-pages-artifact@v3` `actions/deploy-pages@v4` |

### 2.3 核心组件依赖关系

```
index.html
   ├─ 加载 styles/main.css
   └─ 加载 scripts/main.js
            └─ fetch assets/data/reports.json
                     └─ 调用 renderReports() / renderChart() / setupFilters() / setupTilt() / setupParallax() / setupReveal()
                              └─ DOM 写入 .projects / .ticker / .stats 等容器
```

---

## 3. 环境配置

> 项目本质是静态站点，**不需要**数据库 / 后端 / 容器。下表区分本地开发 / 测试 / 生产三个环境的最低配置。

### 3.1 开发环境

| 项目 | 要求 |
|---|---|
| 操作系统 | Windows 10+ / macOS 12+ / Linux |
| Python | 3.10+（仅用作本地 HTTP 服务器） |
| 浏览器 | Edge / Chrome / Firefox / Safari 最新两版 |
| 编辑器 | VS Code / Cursor 任意（无需插件） |
| Git | 2.30+ |
| 端口 | 8000 / 9091 / 9191 任选未被占用端口 |

### 3.2 测试环境

| 项目 | 要求 |
|---|---|
| Headless 浏览器 | Microsoft Edge (`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`) |
| Node.js | 22+（仅作截图脚本运行环境，不构建站点） |
| Playwright 浏览器驱动 | `playwright-core`（已预装在 `~/.workbuddy/binaries/node/workspace/node_modules/`） |
| 移动端视口验证 | Chrome DevTools 模拟 iPhone 14 (390×844) |

### 3.3 生产环境

| 项目 | 要求 |
|---|---|
| 托管平台 | GitHub Pages（Public 仓库，`source: GitHub Actions`） |
| 域名 | 默认 `<username>.github.io/<repo>/`；可绑自定义域名（在 `site/CNAME` 写入） |
| HTTPS | GitHub Pages 自动强制启用 |
| CDN | GitHub 全球 CDN |
| 监控 | GitHub Actions `pages-build-verification` 自动运行 |

### 3.4 启动步骤（30 秒可用）

```bash
# 1. 克隆仓库
git clone https://github.com/8scolding8/tradingagents.git
cd tradingagents

# 2. 本地预览（无需任何依赖）
cd site
python -m http.server 8000
# 浏览器打开 http://localhost:8000/

# 3. （可选）重新生成截图
cd ..  # 回到仓库根
SHOT_URL=http://127.0.0.1:8000/ \
  NODE_PATH="$HOME/.workbuddy/binaries/node/workspace/node_modules" \
  "$HOME/.workbuddy/binaries/node/versions/22.22.2/bin/node" \
  scripts-take-screenshots-v4.js
```

---

## 4. 核心功能模块说明

> 按用户感知顺序说明每个模块的职责、关键接口与业务流程。

### 4.1 Hero 模块（首屏）

| 项 | 说明 |
|---|---|
| 职责 | 站点标题 / 一句话定位 / CTA / 关键日期 chip / 装饰性 SVG 折线 / 顶部 Ticker |
| 关键 DOM | `.hero` `.hero__inner` `.hero__title` `.hero__chart` `.hero__meta` |
| 关键接口 | `setupParallax()` 监听 `scroll` 节流 rAF + `translate3d` |
| 业务流 | 加载 → 渲染 SVG 折线（自身绘制） → Ticker 自动滚动 → 标题斜体金色渐变高亮 |
| 注意 | `prefers-reduced-motion: reduce` 时禁用视差 |

### 4.2 About 模块（关于）

| 项 | 说明 |
|---|---|
| 职责 | 解释项目来源（TradingAgents 案例陈列）+ 数据来源（IMA 121 / 公开媒体 / NeoData）+ 方法论（六要素） |
| 关键 DOM | `#about` `.about__grid` `.about__card` `.badge` |
| 数据源 | 静态文案（硬编码） |
| 业务流 | 卡片进入视口后轻微上浮（IntersectionObserver） |

### 4.3 Skills 模块（能力）

| 项 | 说明 |
|---|---|
| 职责 | 6 项宏观分析能力的视觉化列表（图表核读 / 利率路径 / 行业映射 / 汇率跨境 / 风险识别 / 结构化输出） |
| 关键 DOM | `#skills` `.skills__grid` `.skills__item` |
| 业务流 | 鼠标 hover → 左竖条金色高亮 + 文字微平移 |

### 4.4 Projects 模块（研报，**核心**）

| 项 | 说明 |
|---|---|
| 职责 | 12 篇宏观研报的卡片列表 + 分类筛选 + 富文本展开 + SVG 可视化 |
| 关键 DOM | `#projects` `.projects__filters` `.projects__list` `.project-card` `.project-card--rich` `.project-card__details` |
| 关键接口 | `renderReports(data)` / `renderChart(container, chartObj)` / `setupFilters()` |
| 数据契约 | `assets/data/reports.json` 每条结构见 §5 |
| 业务流 | (1) JS `fetch` JSON → (2) 渲染卡片骨架 → (3) 注入 `<details>` 富文本 → (4) �� `renderChart` 在容器内画 SVG → (5) 绑定分类筛选按钮 → (6) 用户点开卡片自动绘制图表 |
| 注意 | 加载 JSON 失败时显示回退文本（永不空白）；图表类型支持 `bar` 与 `line`，数据点格式 `[{label, value}]` 或 `[{x, y}]` |

### 4.5 Contact 模块（联系）

| 项 | 说明 |
|---|---|
| 职责 | 公开联系方式（GitHub 仓库 / GitHub Issue） |
| 关键 DOM | `#contact` `.contact-grid` `.contact-card` |
| 业务流 | 卡片 hover 右箭头平移 |

### 4.6 Ticker 模块（顶部滚动条）

| 项 | 说明 |
|---|---|
| 职责 | 11 个宏观指标的横向滚动（federal funds / 10Y / DXY / oil / gold / VIX 等） |
| 关键 DOM | `.ticker` `.ticker__track` `.ticker__item` |
| 业务流 | CSS `@keyframes` 自动滚动；hover 时 `animation-play-state: paused` |

### 4.7 Stats 模块（统计）

| 项 | 说明 |
|---|---|
| 职责 | 4 个核心数字（12 研报 / 6 主题 / 4 数据源 / 0 API Key） |
| 关键 DOM | `#stats` `.stats__item` `.stats__num` |
| 业务流 | IntersectionObserver 触发数字 0 → 目标值动画（rAF） |

### 4.8 Footer 模块（页脚）

| 项 | 说明 |
|---|---|
| 职责 | 4 列网格：品牌 / 站内导航 / 数据源说明 / 元信息 |
| 关键 DOM | `footer` `.footer__col` |

---

## 5. 数据设计（JSON 结构）

> 本项目无数据库。数据以单个 JSON 文件内嵌，结构如下。

### 5.1 顶层结构

文件：`site/assets/data/reports.json`

```json
{
  "version": "2026-07-24",
  "meta": { "total": 12, "categories": ["...", "..."] },
  "reports": [ /* Report[] 见 §5.2 */ ]
}
```

### 5.2 Report 对象

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | string | ✅ | 短横线风格，例 `fomc-2026-06` |
| `title` | string | ✅ | 卡片标题 |
| `category` | string | ✅ | 分类 chip；用作筛选 key |
| `date` | string (YYYY-MM-DD) | ✅ | 卡片显示 + Hero 「更新于」chip 计算 |
| `source` | string | ✅ | 例：`IMA 121 知识库 · 摘录（全文限知识库内查阅）` |
| `summary` | string | ✅ | 一句话摘要 |
| `original_text` | string[] | ✅ | 原文摘录分段；最少 1 段 |
| `core_viewpoints` | string[] | ✅ | 核心观点列表 |
| `logic_chain` | string[] | ✅ | 推理步骤列表；每项以「步骤 N ·」开头 |
| `chart` | object \| null | ✅ | 见 §5.3；可空 |
| `key_data` | object[] | ✅ | 见 §5.4；用于网格展示 |
| `conclusion` | string | ✅ | 卡片底部结论 |

### 5.3 chart 对象

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `type` | `"bar"` \| `"line"` | ✅ | 图表类型 |
| `title` | string | ✅ | 图表标题 |
| `unit` | string | ❌ | 单位后缀（例 `%`、`亿美元`） |
| `data` | `[{label, value}]` 或 `[{x, y}]` | ✅ | 数据点；bar 用前者，line 用后者 |
| `accent` | `"primary"` \| `"accent"` | ❌ | 主色 vs 强调色，默认 primary |

### 5.4 key_data 对象

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `label` | string | ✅ | 指标名 |
| `value` | string | ✅ | 显示值（已格式化） |
| `note` | string | ❌ | 备注（例：日期、来源） |

### 5.5 索引与查询策略

| 用途 | 实现方式 |
|---|---|
| 按分类筛选 | `Array.filter(r => currentCategory === 'all' \|\| r.category === currentCategory)` |
| 按日期排序 | `Array.sort((a, b) => b.date.localeCompare(a.date))` |
| 取最近日期 | `Math.max(...reports.map(r => r.date))`（YYYY-MM-DD 字符串可直接比较） |
| 全文检索 | 不内置；如需要可新增 `searchIndex` 字段或客户端 `String.includes` 扫描 |

---

## 6. 已知问题与待办事项

### 6.1 已记录问题

| # | 问题 | 状态 | 备注 |
|---|---|---|---|
| 1 | IMA 121 知识库 MCP 返回「你已不在该知识库」 | 已规避 | 12 篇研报均以「公开媒体摘录 + NeoData 行情」组合形式呈现，未复制原文 |
| 2 | 首次 GitHub Actions 部署失败（Pages 未启用） | 已解决 | 通过 GitHub API `POST /pages` 激活后重跑成功 |
| 3 | 本机 git credential manager 段错误 | 已规避 | 改用 `gh auth login` 的 OAuth device flow |
| 4 | TradingAgents Python 运行时需要 OPENAI_API_KEY | 主动放弃 | 仅引用公开 README 与 Apache-2.0 PNG 作案例，不安装 |
| 5 | 截图工具链依赖 Microsoft Edge 与 playwright-core | 已配置 | 见 §3.2；如需在其他机器上跑，需先安装 |

### 6.2 待办（按优先级）

| # | 待办 | 建议时机 |
|---|---|---|
| 1 | 增加「跳到主内容」链接以进一步满足 WCAG | 下一次迭代 |
| 2 | 增加暗色模式自动跟随 `prefers-color-scheme` | v5 |
| 3 | 增加「全部展开/折叠」批量按钮 | v5 |
| 4 | 增加 RSS feed 或 JSON feed 订阅 | 后续 |
| 5 | IMA 121 知识库若重新授权，可补全每篇研报的真实原文 | 用户授权后 |
| 6 | 接入更多数据源（公开 FRED / EIA API），让图表可定时刷新 | 待评估 |
| 7 | 单元测试 / 视觉回归（用 Playwright 的 `expect(page).toHaveScreenshot()`） | 课程结束后 |
| 8 | 国际化（i18n）：至少中英双语 | 后续 |

### 6.3 风险提示

- **卡片数量**：当前 12 篇。如果扩到 30+ 篇，需引入「分页 / 虚拟滚动」，否则移动端首屏滚动长度过大会影响 LCP。
- **图表尺寸**：SVG 按容器宽度自适应；如果 JSON 数据点超过 50 个，建议改用 Canvas 渲染。
- **第三方资源**：当前 `assets/images/` 中的 TradingAgents PNG 是从 GitHub `TauricResearch/TradingAgents` Apache-2.0 仓库拷贝；如上游变更许可或删除仓库，需替换或删除。
- **隐私扫描**：`grep -rE "API_KEY|api_key|secret|wechat|身份证|TOKEN|phone" site/` 当前无命中；提交前请重新运行一次。

---

## 7. 部署流程与注意事项

### 7.1 部署流程

```
本地修改 → git add → git commit → git push origin main
                                            │
                                            ▼
                                GitHub 接收 push
                                            │
                                            ▼
                .github/workflows/pages.yml 触发
                                            │
                                            ▼
                Checkout → Configure Pages → Upload site/ artifact
                                            │
                                            ▼
                          actions/deploy-pages@v4
                                            │
                                            ▼
                         https://<user>.github.io/<repo>/
```

### 7.2 关键操作

```bash
# 首次推送
git push -u origin main

# 日常推送
git add -A
git commit -m "feat(scope): brief summary"
git push origin main

# 手动触发部署（GitHub 网页）
# Actions → Deploy site to GitHub Pages → Run workflow
```

### 7.3 注意事项

| 场景 | 注意事项 |
|---|---|
| 大文件 | GitHub Pages 单文件上限 100 MB；本仓库最大单文件是截图 PNG（< 1.5 MB） |
| 路径 | Pages 工作流以 `site/` 为部署根；不要把仓库根直接 push，否则 `index.html` 会指向 404 |
| 缓存 | CDN 缓存通常 5 分钟内失效；调试时可加 `?v=<timestamp>` 绕过 |
| 自定义域名 | 在 `site/CNAME` 写一行域名；在仓库 Settings → Pages 设置 DNS |
| HTTPS | Pages 默认强制 HTTPS，无需额外配置 |
| 私有仓库 | 私有仓库的 Pages 仅付费版可用；本仓库是 Public |
| Actions 凭据 | 默认使用 GITHUB_TOKEN，无需自配 secret |
| 失败排查 | 查看 Actions 日志；常见错误：`site/` 不存在、Pages 未启用、并发任务占用 |

### 7.4 应急回滚

```bash
# 回滚到上一个稳定 commit
git revert HEAD
git push origin main     # 自动触发重新部署

# 或临时回滚到指定 commit
git reset --hard <commit-sha>
git push -f origin main  # 强制推送（注意：会重写历史，仅紧急情况使用）
```

---

## 8. 文件清单与用途

> 按模块层级组织。所有路径相对仓库根 `C:\Users\CASH\WorkBuddy\2026-07-24-14-28-05\`。

### 8.1 顶层

| 文件 | 用途 |
|---|---|
| `README.md` | 仓库根说明：站点链接、数据源、开发流程、提交清单 |
| `HANDOVER.md` | **本文件**：项目交接文档 |
| `.gitignore` | 排除 `.env` / `__pycache__` / `node_modules` / `.DS_Store` 等 |
| `.git/` | Git 本地历史（自动生成） |

### 8.2 自动化部署

| 文件 | 用途 |
|---|---|
| `.github/workflows/pages.yml` | GitHub Actions 工作流；push `main` 后将 `site/` 发布到 GitHub Pages |

### 8.3 站点源码（`site/`）

| 文件 | 用途 |
|---|---|
| `site/index.html` | 单页 HTML 骨架，含 5 大区块、ARIA、加载骨架、模板挂载点 |
| `site/README.md` | 站点子目录说明：部署、本地预览、目录结构 |
| `site/styles/main.css` | 设计系统：CSS 变量、媒体查询、暗色模式、动画、可访问性、打印样式 |
| `site/scripts/main.js` | 行为层：fetch JSON / 渲染卡片 / 渲染 SVG / 筛选 / tilt / parallax / reveal |
| `site/assets/data/reports.json` | **核心数据**：12 篇宏观研报的结构化版本 |
| `site/assets/images/favicon.svg` | 站点 favicon（深蓝 + 金色斜杠） |
| `site/assets/images/analyst.png` | TradingAgents 公开 PNG（Apache-2.0）— 多智能体示意 |
| `site/assets/images/researcher.png` | TradingAgents 公开 PNG（Apache-2.0） |
| `site/assets/images/risk.png` | TradingAgents 公开 PNG（Apache-2.0） |
| `site/assets/images/schema.png` | TradingAgents 公开 PNG（Apache-2.0）— 主框架图，About 卡片使用 |
| `site/assets/images/trader.png` | TradingAgents 公开 PNG（Apache-2.0） |

### 8.4 规范文档（`site/docs/`）

| 文件 | 用途 |
|---|---|
| `site/docs/PRD.md` | 产品需求：定位、目标用户、五区块内容地图、验收标准 |
| `site/docs/Design.md` | 设计说明：色彩 token、字体阶梯、间距、断点、可访问性策略 |
| `site/docs/Checklist.md` | 提交清单：12 项作业要求逐条核对 |
| `site/docs/Report.md` | 最终报告：项目决策过程、12 篇研报清单、commit 历史、发布证据、风险与回退 |
| `site/docs/screenshots/homepage-desktop.png` | v1 桌面整页证据 |
| `site/docs/screenshots/homepage-mobile.png` | v1 移动整页证据 |
| `site/docs/screenshots/project-card-expanded.png` | v1 单卡片展开证据 |
| `site/docs/screenshots/projects-section.png` | v1 Projects 段证据 |
| `site/docs/screenshots/homepage-desktop-v2.png` | v2 桌面整页（含 12 篇） |
| `site/docs/screenshots/homepage-mobile-v2.png` | v2 移动整页 |
| `site/docs/screenshots/project-card-rich-v2.png` | v2 单卡片含原文 + 图表 |
| `site/docs/screenshots/projects-section-v2.png` | v2 Projects 段 |
| `site/docs/screenshots/homepage-v3-desktop.png` | v3 视觉升级后的桌面整页 |
| `site/docs/screenshots/homepage-v3-mobile.png` | v3 视觉升级后的移动整页 |
| `site/docs/screenshots/about-v3.png` | v3 About 段 |
| `site/docs/screenshots/projects-v3.png` | v3 Projects 段 |
| `site/docs/screenshots/card-rich-v3.png` | v3 单卡片完整展开 |
| `site/docs/screenshots/homepage-v4-desktop.png` | v4 桌面整页 |
| `site/docs/screenshots/hero-v4.png` | v4 Hero 单屏 |
| `site/docs/screenshots/homepage-v4-mobile.png` | v4 移动整页 |
| `site/docs/screenshots/about-v4.png` | v4 About 段 |
| `site/docs/screenshots/stats-v4.png` | v4 Stats 段 |
| `site/docs/screenshots/skills-v4.png` | v4 Skills 段 |
| `site/docs/screenshots/projects-v4.png` | v4 Projects 段 |
| `site/docs/screenshots/card-rich-v4.png` | v4 单卡片完整展开 |
| `site/docs/screenshots/footer-v4.png` | v4 Footer |
| `site/docs/screenshots/pages-live-final.png` | 公网 Pages 整页抓取（验证用） |
| `site/docs/screenshots/github-actions-success.png` | GitHub Actions Run 成功页（验证用） |

### 8.5 开发脚本（仓库根，不入 commit）

| 文件 | 用途 | 是否入仓 |
|---|---|---|
| `scripts-take-screenshots.js` | v1 截图脚本（单浏览器 4 张） | 保留本地，`.gitignore` 排除 |
| `scripts-take-screenshots-v3.js` | v3 截图脚本（5 张双端） | 保留本地，`.gitignore` 排除 |
| `scripts-take-screenshots-v4.js` | v4 截图脚本（9 张） | 保留本地，`.gitignore` 排除 |

### 8.6 不入仓 / 外部缓存

| 路径 | 用途 |
|---|---|
| `~/WorkBuddy/_vendor-cache/TradingAgents-public/` | TradingAgents 完整克隆（仅本地参考，避免污染 Git 历史） |
| `C:\Users\CASH\.workbuddy\binaries\gh\2.96.0\` | GitHub CLI v2.96.0（部署阶段使用，不在仓库内） |
| `C:\Users\CASH\.workbuddy\binaries\node\workspace\node_modules\` | Playwright 截图依赖（全局，不在仓库内） |

---

## 附录 A · 接手人员 30 分钟上手清单

1. ☐ 阅读本 HANDOVER.md（5 分钟）
2. ☐ 浏览 `site/index.html` 了解 DOM 结构（3 分钟）
3. ☐ 浏览 `site/scripts/main.js` 了解渲染流程（5 分钟）
4. ☐ 浏览 `site/styles/main.css` 顶部 `:root` 了解设计 token（3 分钟）
5. ☐ 浏览 `site/assets/data/reports.json` 前 2 条记录了解数据契约（3 分钟）
6. ☐ 本地 `python -m http.server 8000 --directory site` 启动预览（2 分钟）
7. ☐ 修改任意文案或数据 → 浏览器 `Ctrl+R` 验证 → `git add -A && git commit -m "..." && git push`（5 分钟）
8. ☐ 验证 GitHub Actions 30 秒内自动重新部署 → 浏览器访问公网 URL（2 分钟）

完成以上 8 步即可进入正常开发节奏。