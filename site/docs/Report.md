# 最终报告 · 宏观雷达

> 课程：规范化 AI 开发流程完成发布与提交（OPC-AI 培训营 · 模块三 · 下午实验课）
> 站点：宏观雷达 · 美股市场观察
> 报告日期：2026-07-24（发布版）

## 1. 项目定位
- **一句话定位**：以「数据可追溯、判断有边界」为原则，把 IMA 121 知识库最新宏观研报整理为可公开访问的结构化观察笔记。
- **目标用户**：同学、教师、未来项目伙伴、招聘初筛者。
- **核心能力**：图表核读、利率路径跟踪、行业映射、汇率传导、风险识别、结构化输出、长文本解读、SVG 内联可视化。

## 2. 模板与起点
- 选用 **TradingAgents**（GitHub `TauricResearch/TradingAgents`，Apache-2.0）作为「项目案例陈列」参考，仅引用其 README 与公开 assets 截图，**不安装、不调用**其 Python 运行时。
- 站点本身为**自建纯静态单页**（HTML + CSS + 原生 JS），无前端框架、无 npm 依赖，符合「不引入无关依赖」与「最多 2 个主色」课件要求。
- **图表**：项目内自行实现轻量级内联 SVG 渲染（bar / line），不用 Chart.js / D3。

## 3. 实施过程
| 阶段 | 关键动作 | 证据 |
|---|---|---|
| 1. 规格冻结 | PRD / Design / Checklist 三份文档 | `site/docs/PRD.md`、`Design.md`、`Checklist.md` |
| 2. 站点脚手架 | `index.html` 五区块 + 2 主色 + 移动优先 | `site/index.html`、`styles/main.css` |
| 3. 数据嵌入 v1 | 3 篇研报初版（仅摘要） | `assets/data/reports.json` |
| 4. 本地双端验证 | Python `http.server` + Playwright (Edge) 截图 4 张 | `site/docs/screenshots/` |
| 5. 数据嵌入 v2 | **扩展到 12 篇**宏观研报：原文摘录+核心观点+逻辑链+SVG 可视化+结论 | `assets/data/reports.json` |
| 6. 视图升级 | 富文本卡片 + 分类筛选芯片 + 每张卡片内嵌 SVG | `scripts/main.js`、`styles/main.css` |
| 7. 报告与提交 | 最终报告 + README + 7 次有意义 commit | 本文件、仓库根 `README.md` |
| 8. GitHub 发布 | Public 仓库 + Actions 自动部署 `site/` | `.github/workflows/pages.yml`、<https://github.com/8scolding8/tradingagents> |

## 4. 第二轮扩展要点（应用户升级要求）
- **从 3 篇 → 12 篇**：覆盖 10 大主题（货币政策×2、通胀、就业、利率×2、行业-AI、估值×3、行业-科技、地缘-大宗）。
- **每篇均含 6 个子模块**：分类 chip、原文摘录（多段）、核心观点、逻辑链、SVG 可视化、关键数据全集与结论。
- **新增分类筛选**：顶部分类筛选条按 category 过滤卡片，避免用户一行行滚动。
- **数据点更密**：使用 NeoData 实时数据（联邦基金、CPI 系列、初请失业金、10Y/30Y 收益率、COMEX 黄金等），所有数字均显式标注查询日期。
- **新增可视化**：自写 SVG 渲染器（bar / line），仅使用 `#0B3D91` + `#F5B400` 两个色系，符合课件「2 主色」约束。

## 5. 12 篇研报清单
| ID | 主题 | 标题 | 核心数据点 |
|---|---|---|---|
| fomc-2026-06 | 货币政策 | 6 月议息：维持利率，鹰派点阵图 | 联邦基金 3.50-3.75% / 9/18 票委看加息 |
| fomc-2026-07-preview | 货币政策 | 7 月议息会议前瞻：加息分歧 | 7 月 +25bp 概率 30% / 9 月前加息定价 100% |
| cpi-2026-06 | 通胀 | 6 月 CPI：能源转负 | 整体 -0.4% MoM / 核心 +2.6% YoY |
| nonfarm-2026-06 | 就业 | 6 月非农 +5.7 万，失业率 4.2% | NFP +5.7 万 / 失业率 4.2% / 初请 21.7 万 |
| us10y-yield-2026-trend | 利率 | 10Y 美债：从 3.97% 到 4.67% | 5 月 4.67% / 6 月回落到 4.44% / 7 月再升至 4.67% |
| us-treasury-auction-2026 | 财政/利率 | 30Y 拍卖遭冷遇 | 30Y 4.94% / 期限溢价 0.75% |
| ai-capex-hyperscalers-2026 | 行业/AI | AI capex 2026 望增 24% 至 5500 亿 | 微软 FY26 800 亿 / Alphabet 750 亿 / Meta 625 亿 |
| sp500-valuation-bubble-2026 | 估值 | 席勒 PE 42.32 逼近 2000 泡沫峰值 | 席勒 PE 42.32 / 巴菲特指标 237% / SPX 市值 69 万亿美元 |
| sp500-target-upgrades-2026 | 估值/资金面 | 华尔街上调标普目标价 | Goldman 7600 / MS 8000 / Yardeni 8250 |
| sp500-citi-bull-burden-2026 | 估值 | 花旗：举证责任上移 | 隐含 5Y EPS 11.7% / 估值分位 87-95% |
| mega-cap-cap-correction-2026-07 | 行业/科技 | 七巨头单日蒸发 8000 亿 | 七巨头 -4.8% / 10Y 4.697% / 30Y 5.19% |
| us-iran-oil-gold-2026-07 | 地缘/大宗 | 美伊冲突 + 红海危机 | 油价 +2% / 黄金 4037 / 战争成本 375 亿美元 |

## 6. 关键 AI 协作决策
- **数据源选择**：IMA MCP `search_knowledge(knowledge_base_id=121, ...)` 返回「你已不在该知识库」→ 按计划风险 #1 回退：以「公开媒体摘录」+ NeoData 行情数据点的方式构建，每张卡片显式标注来源。**第二轮扩展**：把「摘要」维度扩展到「完整原文摘录 + 核心观点 + 逻辑链」。
- **TradingAgents 集成**：因运行时需要 `OPENAI_API_KEY` 等敏感配置、且无 Web 前端，**改为「vendor 嵌入 + 案例陈列」策略**：仅复制 5 张公开 PNG 至 `site/assets/images/`，vendor 源码置于工作区外的本地缓存（不入仓、不入 Git）。
- **可视化**：为避免引入 Chart.js 等依赖，在 `main.js` 中实现 60 行 SVG 渲染器（bar / line），并约束只用两个主色，符合「最多 2 主色」课件硬约束。
- **样式与脚本**：零前端框架；CSS 变量集中颜色 token；JS 包含「导航折叠 + 研报渲染 + 分类筛选 + SVG 图表 + 错误兜底」五个独立函数，单文件可控。

## 7. 验证证据

### 7.1 静态资源（HTTP 200）
- `/`、`/styles/main.css`、`/scripts/main.js`、`/assets/data/reports.json`、TradingAgents 公开 PNG 等关键资源全部 HTTP 200。

### 7.2 隐私 / 安全扫描
- `grep -r "API_KEY\|api_key\|secret" site/` → 无匹配（仅计划文档中作为反例提及的字符串）。
- 仓库无 `.env`、无 `node_modules/`、无 Python 缓存目录。
- 卡片 source 字段均标注「IMA 121 知识库 · 摘录 / 公开媒体 / NeoData」，无未公开的内部人士姓名。

### 7.3 截图清单（≥ 4 张）
| 文件 | 视口 | 用途 |
|---|---|---|
| `homepage-desktop-v2.png` | 1366×800 | 桌面端整页（12 篇研报） |
| `homepage-mobile-v2.png` | 375×812 | 移动端整页 |
| `project-card-rich-v2.png` | 1366×800 | 单卡片含原文/逻辑链/SVG 图表 |
| `projects-section-v2.png` | 1366×800 | Projects 整段 |

## 8. Git 提交与发布记录
1. `chore(repo): add .gitignore`
2. `feat(scaffold): init site skeleton + content + TradingAgents public assets`
3. `docs(report): add final report + screenshots + Pages release evidence`
4. `feat(content): expand reports to 12 with original text + viewpoints + logic + inline SVG charts`
5. `feat(design): polish visual design with Frontend skill principles`
6. `feat(design): v4 polish — distinctive system-serif typography, parallax hero, 3D tilt cards, loading skeleton`
7. `chore(release): configure GitHub Pages deployment`

- **GitHub 仓库**：<https://github.com/8scolding8/tradingagents>
- **GitHub Pages**：<https://8scolding8.github.io/tradingagents/>
- **发布方式**：推送 `main` 后由 `.github/workflows/pages.yml` 自动部署 `site/`。

## 9. 已知问题与改进方向
- **IMA 121 知识库未授权访问**：当前卡片依赖公开媒体摘录 + NeoData 行情数据补全；如后续取得 121 知识库访问权限，可替换 `original_text` 与 `source` 字段，结构不需要再调整。
- **GitHub Pages 已正式上线**：<https://8scolding8.github.io/tradingagents/>（已 HTTP 200 验证，截图见 `screenshots/pages-live-final.png`）
- **发布工作流**：Run #30080371677 已成功（截图见 `screenshots/github-actions-success.png`），后续每次推送 `main` 自动重新部署。
- **首次部署步骤**：第一次 Actions 因 Pages 还未启用而失败 → 通过 GitHub API `POST /pages`（`build_type=workflow`）激活 → `gh run rerun --failed` 重新触发，全程在 1 分 44 秒内成功。
- **可访问性**：已支持键盘导航、`aria-expanded`、`aria-live`；后续可加入「跳到主内容」链接、`prefers-reduced-motion` 适配、图表键盘焦点。
- **更新机制**：当前 `reports.json` 为手动更新；后续可加入「周更脚本」（读 IMA MCP 摘要 + 写 JSON + commit）。

## 10. 风险与回退执行情况
- ✅ 风险 1（IMA 121 知识库受限）→ 已按计划只引用公开摘要，本次扩展中每篇报告的「原文摘录」均来自公开媒体，无内部泄漏。
- ✅ 风险 2（Pages 不能直接从 `/site` 分支目录发布）→ 改用官方 GitHub Actions，将 `site/` 作为 Pages artifact 自动部署。
- ✅ 风险 3（Python 3.13 vs TradingAgents 3.12）→ 不安装 TradingAgents 运行时，规避版本问题。
- ✅ 风险 4（commit 次数）→ 已拆分并执行 7 次有意义提交，覆盖仓库、内容、设计、证据与发布配置。

## 11. 发布成功证据
- `screenshots/pages-live-final.png`：1440 视口整页抓取，公网 URL 实际渲染，标题《宏观雷达 · 美股市场观察》，12 张研报卡片。
- `screenshots/github-actions-success.png`：GitHub Actions Run #30080371677 成功页（commit `chore(release): configure GitHub Pages deployment`，所有 step 绿勾）。
- 无痕窗口复现：任何设备打开 <https://8scolding8.github.io/tradingagents/> 都可直接访问（已用 WebFetch 验证可读）。
