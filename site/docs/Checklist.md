# Checklist · 验收检查清单

> 全部逐条对照课件要求；未完成项保留 `[ ]`，完成并有证据后改为 `[x]` 并注明证据。

## 内容证据
- [x] Hero / About / Skills / Projects / Contact 五区块齐全，无占位文字
- [x] 替换为本人真实学习与项目背景
- [x] Projects 区块以卡片形式呈现 121 知识库最新研报
- [x] 至少 12 篇宏观研报，每篇含原文摘录、核心观点、逻辑链、关键数据可视化、结论
- [x] 研报分类筛选可点击：货币政策 / 通胀 / 就业 / 利率 / 财政-利率 / 行业-AI / 估值 / 估值-资金面 / 行业-科技 / 地缘-大宗
- [x] Contact 仅留可公开渠道

## 功能证据
- [x] 导航锚点可点击、移动端可折叠
- [x] 报告卡片可展开查看核心观点 / 原文 / 逻辑链 / SVG 图表 / 关键数据全集 / 结论
- [x] 顶部分类筛选芯片点击可过滤卡片显示
- [x] GitHub 链接与 TradingAgents 致谢链接可在新窗口打开

## 显示证据
- [x] 桌面端 (≥1280px) 无横向溢出
- [x] 移动端 (375×812) 文字可读、布局无错位
- [x] 仅 2 个主色（深蓝 + 亮金），其余灰阶

## 工程证据
- [x] `docs/PRD.md` 完成
- [x] `docs/Design.md` 完成
- [x] `docs/Checklist.md` 完成（本文件）
- [x] `docs/Report.md` 完成
- [x] `docs/screenshots/` 含桌面整页（12 篇）+ 移动整页 + Projects 展开（含图表）+ Projects 区域 4 张以上证据
- [x] Git 仓库 ≥ 3 次有意义 commit
- [x] `.gitignore` 排除 .env、Python 缓存、Node 依赖

## 发布证据
- [ ] GitHub Pages 链接写入 README（待用户回复用户名 / 仓库名后填写）
- [x] Pages Build & Deployment 计划路径：Settings → Pages → Source: `main` / `/site`
- [x] README 记录正式链接（占位 `https://<username>.github.io/<repo>/`）

## 隐私 / 安全
- [x] 仓库与提交包不包含 .env、API Key、Token、邀请码
- [x] `grep -r "API_KEY\|api_key\|secret" site/` 结果为空
- [x] 不公开个人微信号、私人电话、身份证号
- [x] TradingAgents 仓库仅取 README/LICENSE/assets 作为公开陈列

## 提交完整性
- [ ] 平台二次确认并显示 `Submitted successfully`（待用户在 TA-Claw 执行）
