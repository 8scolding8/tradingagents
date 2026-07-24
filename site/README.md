# 宏观雷达 · 站点

> 美股市场宏观分析个人主页。站点为纯静态单页（HTML + CSS + 原生 JS），可直接发布到 GitHub Pages。

## 区块

1. **Hero**：主题 + 一句话定位 + 2 枚 CTA
2. **About**：项目来源 / 数据来源 / 方法论
3. **Skills**：图表核读、利率路径、行业映射、汇率、风险、结构化输出
4. **Projects**：IMA 121 知识库最新宏观研报卡片（数据来自 `assets/data/reports.json`）
5. **Contact**：可公开渠道（GitHub 链接占位）

## 本地预览

```bash
cd site
python -m http.server 8000
# 浏览器打开 http://localhost:8000/
```

或使用 Node 简易服务器：

```bash
cd site
npx --yes http-server -p 8000
```

## 文件映射

| 文件 | 作用 |
|---|---|
| `index.html` | 页面结构 |
| `styles/main.css` | 视觉系统、2 主色、响应式 |
| `scripts/main.js` | 导航折叠 + 研报渲染 |
| `assets/data/reports.json` | 研报数据源（来自 IMA 121 摘录 + NeoData 行情补充） |
| `assets/images/*` | 站点图标 + TradingAgents 公开截图 |
| `docs/PRD.md` `docs/Design.md` `docs/Checklist.md` `docs/Report.md` | 课件要求的过程文档 |

## 部署

- GitHub Pages：Settings → Pages → Source: `main` / `/site`
- 自定义域名：在 `site/` 根目录增加 `CNAME` 文件

## 致谢

- 项目结构与多智能体思路参考 [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents)（Apache-2.0 License）
- 数据来源：IMA 121 知识库摘要 + NeoData 公开行情
- 仅作为个人学习项目，**不构成投资建议**
