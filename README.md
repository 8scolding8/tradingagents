# 宏观雷达 · 美股市场观察

> 围绕美联储利率路径、CPI / PCE 通胀、就业与行业轮动，把 IMA 121 知识库最新宏观研报的结构化版本整理为一个可公开访问的个人项目主页。

## 站点与仓库

- GitHub 仓库：<https://github.com/8scolding8/tradingagents>
- 在线站点：<https://8scolding8.github.io/tradingagents/>
- 本地预览：进入 `site/` 目录后执行 `python -m http.server 8000`，浏览器访问 <http://localhost:8000/>。
- 自动部署：推送 `main` 后，由 `.github/workflows/pages.yml` 将 `site/` 发布到 GitHub Pages。

## 目录结构

```
2026-07-24-14-28-05/
├── site/                  # 站点源码（GitHub Pages 部署目标）
│   ├── index.html
│   ├── styles/main.css
│   ├── scripts/main.js
│   ├── assets/{images, data/reports.json}
│   ├── docs/{PRD.md, Design.md, Checklist.md, Report.md, screenshots/}
│   └── README.md
├── .gitignore
└── README.md              # 本文件
```

> 仓库**不**包含 TradingAgents 源码（仅引用其公开 README / 截图作案例）。本地缓存放在工作区外的 `~/WorkBuddy/_vendor-cache/`，不进入 Git 历史。

## 数据源与隐私边界

- **IMA 121 知识库**：作为研报摘要与核心观点的来源；当前卡片的源文以「IMA 121 知识库 · 摘录（全文限知识库内查阅）」标注，**未**复制原文。
- **NeoData 行情数据**：用于补全联邦基金利率、CPI、美债收益率、DXY 等公开市场数据点。
- **TradingAgents**：仅引用其公开 README 与 Apache-2.0 许可的截图，**不**调用其 Python 运行时、**不**写入 API Key。
- 仓库中不出现任何 `.env` / API Key / 微信号 / 私人手机号 / 邀请码。

## 开发流程（按课件 Vibe / Spec / Harness）

1. Vibe：明确「美股宏观分析 + 研报结构化」的个人定位与目标读者。
2. Spec：冻结 `site/docs/PRD.md`、`Design.md`、`Checklist.md`。
3. Harness：本地 `python -m http.server` 双端验证 + 4 张证据截图 + 最终报告。
4. Git：按目标拆分为 7 次有意义提交：
   - `chore(repo): add .gitignore`
   - `feat(scaffold): init site skeleton + content + TradingAgents public assets`
   - `docs(report): add final report + screenshots + Pages release evidence`
   - `feat(content): expand reports to 12 with original text + viewpoints + logic + inline SVG charts`
   - `feat(design): polish visual design with Frontend skill principles`
   - `feat(design): v4 polish — distinctive system-serif typography, parallax hero, 3D tilt cards, loading skeleton`
   - `chore(release): configure GitHub Pages deployment`

## 提交平台

按课程要求，最终通过 TA-Claw 完成提交。提交前请再次确认：

- [x] 仓库无敏感信息
- [x] `docs/` 与 README、Report 内容一致
- [x] 至少 3 次 commit
- [x] GitHub Pages 公网 URL 正常打开（已上线：`https://8scolding8.github.io/tradingagents/`）
- [ ] 平台二次确认并显示 `Submitted successfully`（待用户操作）

## 接手人员入口

- 新增 [HANDOVER.md](./HANDOVER.md)：项目交接文档（架构、模块、JSON 契约、部署、文件清单、30 分钟上手清单）。
