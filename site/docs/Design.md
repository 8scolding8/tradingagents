# Design · 宏观雷达

> 本文件把 PRD 翻译成页面结构、文件映射、视觉与响应式约束。

## 1. 视觉系统

| 维度 | 取值 | 说明 |
|---|---|---|
| 主色 | `--color-primary: #0B3D91`（深蓝） | 金融正统感；用于标题、链接、按钮描边 |
| 强调色 | `--color-accent: #F5B400`（亮金） | 仅用于主按钮与卡片左侧色条 |
| 背景 | `--color-bg: #FFFFFF` / `--color-bg-alt: #F4F7FB` | 主背景 + 区段底色 |
| 文字 | `--color-text: #1F2937` / `--color-text-soft: #4B5563` | 主文本 + 辅助文本 |
| 字体 | 系统字体栈 | 不引入网络字体 |
| 圆角 | `12px` | 卡片统一 |
| 阴影 | `--shadow` | 浅而柔和 |

> 颜色总数 ≤ 2（蓝 + 金），其余皆为灰阶与白底。

## 2. 信息架构
- 顶部固定 Nav：品牌 + 4 个锚点 + 移动端折叠按钮（≤ 1023px 显示）。
- Hero：eyebrow + 一句话定位 + 两枚 CTA。
- About：3 张卡片，分别说明「项目来源 / 数据来源 / 方法论」。
- Skills：能力清单（图表核读 / 利率路径 / 行业映射 / 汇率 / 风险 / 结构化输出）。
- Projects：卡片网格，JS 渲染 `assets/data/reports.json`。
- Contact：公开 GitHub 链接 + 反馈渠道。
- Footer：版权、数据来源、致谢。

## 3. 响应式断点
- ≤ 639px：单列、导航折叠为按钮。
- 640–1023px：双列网格，导航仍折叠。
- ≥ 1024px：三列网格，导航横排。

## 4. 文件映射
```
site/
├── index.html                → 页面区块
├── styles/main.css           → 颜色 / 字体 / 间距 / 媒体查询
├── scripts/main.js           → 折叠、研报渲染
├── assets/
│   ├── images/favicon.svg    → 站点标识
│   └── data/reports.json     → 121 知识库研报数据
└── docs/                     → PRD / Design / Checklist / Report / 截图
```

## 5. 无障碍与隐私
- `<nav>` 含 `aria-label`，按钮含 `aria-expanded` / `aria-controls`。
- 颜色对比 ≥ 4.5:1（深蓝 on 白、灰 on 白）。
- 不公开身份证号、住址、私人手机号、API Key、邀请码。
- 截图前清空 IDE 自动补全残留与浏览器个人资料。

## 6. 验证策略
- 桌面 1280×800 全页截图。
- 移动 375×812（iPhone 14）全页截图。
- 控制台 Network 无 404、无报错。
- 关键交互（导航折叠 / 卡片展开）目测可用。
