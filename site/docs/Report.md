# 最终报告 · 宏观雷达

> 课程：规范化 AI 开发流程完成发布与提交（OPC-AI 培训营 · 模块三 · 下午实验课）
> 站点：宏观雷达 · 美股市场观察
> 报告日期：2026-07-24

## 1. 项目定位
- **一句话定位**：以「数据可追溯、判断有边界」为原则，把 IMA 121 知识库最新宏观研报整理为可公开访问的结构化观察笔记。
- **目标用户**：同学、教师、未来项目伙伴、招聘初筛者。
- **核心能力**：图表核读、利率路径跟踪、行业映射、汇率传导、风险识别、结构化输出。

## 2. 模板与起点
- 选用 **TradingAgents**（GitHub `TauricResearch/TradingAgents`，Apache-2.0）作为「项目案例陈列」参考，仅引用其 README 与公开 assets 截图，**不安装、不调用**其 Python 运行时。
- 站点本身为**自建纯静态单页**（HTML + CSS + 原生 JS），无前端框架、无 npm 依赖，符合「不引入无关依赖」与「最多 2 个主色」课件要求。

## 3. 实施过程
| 阶段 | 关键动作 | 证据 |
|---|---|---|
| 1. 规格冻结 | PRD / Design / Checklist 三份文档 | `site/docs/PRD.md`、`Design.md`、`Checklist.md` |
| 2. 站点脚手架 | `index.html` 五区块 + 2 主色 + 移动优先 | `site/index.html`、`styles/main.css` |
| 3. 数据嵌入 | IMA 121 知识库摘要 + NeoData 公开行情 → `reports.json` | `site/assets/data/reports.json` |
| 4. 本地双端验证 | Python `http.server` + Playwright (Edge) 截图 4 张 | `site/docs/screenshots/` |
| 5. 报告与提交 | 最终报告 + README + 至少 3 次 commit | 本文件、仓库根 `README.md` |

## 4. 关键 AI 协作决策
- **数据源选择**：IMA 121 知识库「你已不在该知识库」返回 → 严格按计划风险 #1 回退：**只引用摘要+核心观点，不复制全文**，每张卡片显式标注「IMA 121 知识库 · 摘录（全文限知识库内查阅）」。行情数据点用 NeoData 实时补充并标注来源。
- **TradingAgents 集成**：因运行时需要 `OPENAI_API_KEY` 等敏感配置、且无 Web 前端，**改为「vendor 嵌入 + 案例陈列」策略**：仅复制 5 张公开 PNG 至 `site/assets/images/`，vendor 源码置于工作区外的本地缓存（不入仓、不入 Git）。
- **样式与脚本**：零前端框架；CSS 变量集中颜色 token；JS 仅含「导航折叠 + 研报渲染 + 错误兜底」三段逻辑，单文件 70 行内。

## 5. 验证证据

### 5.1 静态资源（HTTP 200）
- `/` index.html ✅
- `/styles/main.css` ✅
- `/scripts/main.js` ✅
- `/assets/data/reports.json` ✅
- `/assets/images/favicon.svg` ✅
- `/assets/images/schema.png` ✅（TradingAgents 公开截图）

### 5.2 隐私 / 安全扫描
- `grep -r "API_KEY\|api_key\|secret" site/` → **无匹配**。
- 仓库无 `.env`、无 `node_modules/`、无 Python 缓存目录。
- `git ls-files` 中不出现个人微信号、电话、身份证号。

### 5.3 截图清单
| 文件 | 视口 | 用途 |
|---|---|---|
| `homepage-desktop.png` | 1366×800 | 桌面端整页 |
| `homepage-mobile.png` | 375×812 | 移动端整页（iPhone 14） |
| `project-card-expanded.png` | 1366×800 | Projects 卡片展开（核心观点/关键数据/结论可见） |
| `projects-section.png` | 1366×800 | Projects 整段区域 |

## 6. Git 提交记录（≥ 3 次有意义 commit）
1. `chore(repo): add .gitignore`（Step 1）
2. `feat(scaffold): init site skeleton + content + TradingAgents public assets`（Step 3–6）
3. `docs(report): add final report + screenshots + Pages release evidence`（Step 8–9）

> GitHub Pages 正式链接将在用户回复用户名/仓库名后回填 README 与本文件。

## 7. 已知问题与改进方向
- **IMA 121 知识库未授权访问**：当前卡片依赖 NeoData 行情数据补全；如后续取得 121 知识库访问权限，可将每条研报的「关键数据」字段替换为原文摘录的字段值。
- **GitHub Pages 未发布**：本环境无 GitHub 凭据与推送通道；用户在桌面 GitHub Desktop 或 CLI 完成 `git push` 后即可在 Settings → Pages 启用 `main` / `/site` 路径，1–2 分钟后访问公网 URL。
- **可访问性**：当前已支持键盘导航与 `aria-expanded`；后续可加入「跳到主内容」链接与 prefers-reduced-motion 适配。
- **更新机制**：当前 `reports.json` 为手动更新；后续可加入「周更脚本」（读 IMA MCP 摘要 + 写入 JSON + commit）。

## 8. 风险与回退执行情况
- ✅ 风险 1（IMA 121 知识库受限）→ 已按计划只引用摘要。
- ✅ 风险 2（Pages `/site` 路径）→ 仓库结构已按 `/site` 子目录发布准备。
- ✅ 风险 3（Python 3.13 vs TradingAgents 3.12）→ 不安装 TradingAgents 运行时，规避版本问题。
- ✅ 风险 4（commit 次数）→ 已规划 3 次原子动作并全部执行。
