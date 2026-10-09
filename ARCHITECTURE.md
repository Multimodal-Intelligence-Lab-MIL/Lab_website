# MIL 学术网站架构文档

## 1. 架构目标

本项目为 Multimodal Intelligence Lab 提供一个长期可维护的学术网站基础，满足以下要求：

- 继续使用 GitHub 仓库保存源码和内容。
- 继续通过 GitHub Pages 发布，不维护传统服务器或数据库。
- `/admin/` 提供 News、Publication、People、Research 和站点信息的集中编辑入口。
- 图片上传后保存为 GitHub 静态文件。
- 每次后台保存对应一次可追踪的 Git commit。
- 论文支持大图、外部资源链接、BibTeX、默认封面和独立详情页。
- 数据、组件和页面模块解耦，方便后续增加功能或替换数据层。

## 2. 系统关系

```text
访客
  │
  ▼
GitHub Pages ───────────────► Astro 生成的静态 HTML/CSS/JS
                                      ▲
                                      │ GitHub Actions 构建
                                      │
管理员 ─► /admin/ ─► GitHub 网页编辑器 ─► GitHub repository
                                      │
                                      ├─ src/content/**/*.md
                                      ├─ src/data/site.json
                                      └─ public/uploads/**/*
```

GitHub 是唯一内容源。`/admin/` 不拥有独立数据库，而是把管理员引导到对应的 GitHub 文件编辑、创建和上传页面。Astro 在每次提交后读取这些文件并生成公开页面。

## 3. 技术组成

### Astro

- 静态站点生成器。
- 在构建阶段读取 Markdown/JSON。
- 生成 SEO 友好的静态页面和每篇论文的独立路径。
- 网站不需要 Node.js 服务器常驻运行。

### GitHub 编辑入口

- 管理页面路由位于 `src/pages/admin/`，样式与交互脚本位于 `public/admin/`。
- 使用写在静态脚本中的 `MIL / MIL` 作为轻量入口门禁。
- 构建时把当前内容注入 Admin，用于选择、回填和生成 Markdown。
- Admin 按内容类型提供新增、编辑、删除以及条件式图片管理步骤。
- 图片提交后可从公开 GitHub tree API 刷新列表，不需要等待网站重新部署。
- Admin 只准备和复制完整文件内容；最终粘贴与保存仍由 GitHub 编辑器和 `Commit changes` 完成。

### GitHub Actions 与 GitHub Pages

- `main` 分支发生 commit 后触发 `.github/workflows/deploy.yml`。
- 官方 Astro Action 安装依赖、验证 lockfile、构建并上传静态产物。
- GitHub Pages 发布构建结果。

## 4. 目录职责

```text
.
├─ .github/workflows/deploy.yml   自动构建与发布
├─ public/
│  ├─ admin/                      后台样式、门禁与编辑交互
│  ├─ assets/                     从旧站迁移的稳定素材
│  ├─ uploads/                    后台上传的新图片
│  └─ favicon.svg
├─ src/
│  ├─ components/                 复用展示组件
│  ├─ content/
│  │  ├─ news/                    一条新闻一个 Markdown
│  │  ├─ publications/            一篇论文一个 Markdown
│  │  ├─ people/                  一位成员一个 Markdown
│  │  └─ research/                一个研究方向一个 Markdown
│  ├─ data/site.json              Lab 名称、简介、联系信息
│  ├─ layouts/                    全站 HTML 骨架
│  ├─ lib/                        URL 等共享逻辑
│  ├─ pages/                      页面路由
│  ├─ styles/                     设计系统与响应式样式
│  └─ content.config.ts           内容字段与构建校验
├─ astro.config.mjs
├─ package.json
└─ pnpm-lock.yaml
```

`public/assets/` 用于已有、名称稳定的素材；`public/uploads/` 用于从后台入口跳转到 GitHub 后上传的新图片。两者最终都会原样复制进静态网站。

## 5. 内容模型

### News

- `title`
- `date`
- `category`
- `summary`
- Markdown 正文
- 可选图片、外部链接
- `featured`、`draft`

### Publication

- `title`
- `authors`
- `venue`
- `year`
- `category`
- `research`（必填）：所属研究方向的文件名（如 `ai-for-healthcare`）。构建时校验，指向不存在的方向会使构建失败；前台显示为可点击标签，跳转到 Research 页面对应方向。
- 可选封面、摘要、奖项说明、关键词
- DOI、Paper、PDF、arXiv、Project、Code、Dataset、Video
- 原始 BibTeX
- `featured`、`draft`

未上传论文图片时，前台使用统一的 MIL 浅蓝默认封面。未知数据保持字段缺省，不生成虚假链接。

### Person

- `name`
- `category`
- 可选角色、简介、头像和个人链接
- `order`
- `current`、`draft`

没有头像时使用现有默认头像。

### Research

- 完整标题与短标题
- `summary`：一两句说明具体研究内容，显示在 Research 页面卡片和首页悬浮卡片中
- Markdown 详细说明（可选）
- 色彩标识和排序
- `featured`、`draft`

当前五个方向：Multimedia Understanding and Safety、AI for Healthcare、AI for Environment、Video and Scene Understanding、Trustworthy AI。首页和 Research 页面都直接读取该 collection，论文数量与列表按 `research` 字段自动汇总。后台新增论文时必须选择方向；选择 “Add new research area…” 会先保存正在填写的论文、切换到新建方向，完成后可返回并自动选中新方向（需先提交方向文件，再提交论文）。删除仍被论文使用的方向时后台会给出提示。

## 6. 保存与发布流程

1. 管理员使用 `MIL / MIL` 进入 `/admin/`。
2. 管理页展示构建时读取到的现有内容。
3. 管理员打开对应 GitHub 编辑器，修改 Markdown/JSON 或上传图片。
4. 点击 GitHub 的 `Commit changes`：
   - 内容写入 `src/content/`；
   - 图片写入 `public/uploads/`；
   - 生成一次 Git commit。
5. GitHub Actions 自动运行 Astro build。
6. 内容 schema 校验通过后发布 GitHub Pages。

如果某条内容缺少必填字段，Astro 构建会失败并阻止错误版本覆盖线上网站。管理员可以修改该条内容后再次提交。

## 7. BibTeX 工作流

Publication 表单首先接收完整 `bibtex`，在浏览器本地解析 title、authors、journal/booktitle、year、DOI、URL、arXiv、abstract 和 keywords，并推断内容分类。默认只填写空白或新建表单的默认字段；管理员可明确选择覆盖已有值。原始 BibTeX 会完整保留，用于前台复制和引用。

解析不调用第三方服务，也不需要额外凭据。批量导入、重复检测以及 Crossref 或 arXiv 联网补全仍可在后续作为独立模块增加，不改变现有内容模型。

## 8. 权限与安全边界

- 网站前端不包含 GitHub Client Secret 或写入 Token。
- `MIL / MIL` 写在公开静态脚本中，只是用户明确接受的入口区分，不构成安全认证。
- 只有拥有仓库写入权限的 GitHub 用户才能在 GitHub 编辑器中提交内容。
- `/admin/` 不直接调用 GitHub 写入 API，也不缓存 GitHub 凭据。
- 公开内容没有隐私保护能力，不应把内部文件、未公开个人信息或密钥放进仓库。

## 9. 路由

- `/` 首页
- `/people/` 成员
- `/publications/` 论文筛选与列表
- `/publications/<slug>/` 论文详情
- `/research/` 研究方向
- `/news/` 新闻归档
- `/join/` 加入课题组
- `/admin/` 内容管理

所有路由均在构建时生成目录式 `index.html`，适合 GitHub Pages 和自定义域名。

## 10. 视觉系统

- 白色与极浅蓝为主背景。
- 半透明浅蓝层用于导航、动态信号、卡片区分和功能控件。
- 深蓝用于正文和信息层级，不大面积铺满页面。
- 首屏动态网络表达视觉、语言、音频和信号的汇聚。
- 尊重 `prefers-reduced-motion`，在用户要求减少动画时停止动态效果。
- 主要正文不小于 16px，移动端重新排列而非横向压缩。

## 11. 可扩展点

当前内容访问统一通过 Astro Content Collections。未来可以在不重写展示组件的前提下扩展：

- 批量 BibTeX 导入与重复检测。
- Crossref、DOI 或 arXiv 元数据补全。
- Events、Projects、Datasets、Demos 等新 collection。
- 编辑审核分支或 Pull Request 工作流。
- 多管理员权限层。
- 搜索索引、RSS、站点地图和学术 SEO 元数据。
- 当内容量显著增长时，将 collection loader 替换为 Supabase/API。

## 12. 维护原则

- 不直接手写重复页面；新增内容优先通过 `/admin/` 或 `src/content/`。
- 不把大型 PDF、视频或数据集提交进仓库，改用稳定的外部链接。
- 上传图片前压缩，并为公开人物图片确认使用权限。
- 定期检查外部链接和离职成员状态。
- 修改字段结构时，同步更新 `src/content.config.ts` 与 `/admin/` 中的新内容模板。
