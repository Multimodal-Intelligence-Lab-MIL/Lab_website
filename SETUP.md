# 首次上线配置

这份目录可以直接作为一个新 GitHub 仓库的根目录。公开网站不依赖数据库；所有内容和图片都保存在该仓库中。

## 1. 创建并上传仓库

1. 在 GitHub 创建新仓库，例如 `mmi-lab-website`。
2. 将本目录中的全部文件上传到仓库根目录，不要再套一层文件夹。
3. 默认分支使用 `main`。
4. 确认 `.github/workflows/deploy.yml` 已包含在仓库中。

## 2. 后台仓库地址

`/admin/` 的 GitHub 编辑链接已配置为：

```text
https://github.com/Multimodal-Intelligence-Lab-MIL/Lab_website
```

编辑目标为 `main` 分支。新增内容、修改内容和上传图片最后都在 GitHub 网页中点击 `Commit changes`。如果以后复制到其他仓库，需要同步修改 `src/pages/admin/index.astro` 中的 `repositoryUrl`。

## 3. 启用 GitHub Pages

1. 打开仓库 `Settings → Pages`。
2. 在 `Build and deployment` 中将 Source 选择为 `GitHub Actions`。
3. 推送到 `main` 后，打开 `Actions` 查看 `Deploy to GitHub Pages`。
4. 第一次成功后，GitHub 会给出网站地址。

Astro 会在 GitHub Actions 中自动判断：

- 仓库名为 `<owner>.github.io` 时使用根路径 `/`。
- 普通项目仓库时使用 `/<repository>/`。

因此公开页面、图片和内部链接在两种地址下都可以工作。

## 4. 使用 `/admin/`

后台采用轻量前端门禁，不需要 OAuth 代理或额外服务器：

```text
用户名：MIL
密码：MIL
```

这组账号密码写在 `public/admin/admin.js` 中，只用于区分后台入口。真正的仓库写入仍由 GitHub 当前登录账号控制，因此日常使用前请先在浏览器登录一个拥有该仓库写权限的 GitHub 账号。

后台提供：

- News、Publication、People 和 Research 的新增、编辑与删除入口；
- 与内容 schema 对齐的字段表单和 Markdown 自动生成；
- Publication 与 People 对应图片目录的上传、删除和刷新入口；
- 已有内容的表单回填和图片路径选择；
- GitHub Actions 部署状态入口。

## 5. 自定义域名（可选）

如果使用自定义域名：

1. 在 GitHub Pages 中配置域名和 DNS。
2. 新建 `public/CNAME`，文件内容只有域名，例如 `mmi-lab.example.ac.uk`。
3. 在仓库 `Settings → Secrets and variables → Actions → Variables` 添加：
   - `SITE_URL`：完整域名，例如 `https://mmi-lab.example.ac.uk`
   - `BASE_PATH`：填写 `/`

普通 `github.io/仓库名/` 部署不需要创建这些 Variables。

## 6. 日常使用

1. 先在浏览器登录有仓库写权限的 GitHub 账号。
2. 访问 `/admin/`，使用 `MIL / MIL` 进入编辑入口。
3. 第一步选择内容类型以及新增、编辑或删除操作。
4. Publication 或 People 可以在第二步跳转 GitHub 上传、删除图片；提交图片后回到后台刷新图片列表。
5. Publication 在第三步先粘贴 BibTeX，点击 `Read BibTeX & fill fields` 自动填写可识别字段，再人工补充图片和其他链接。
6. 点击 `Copy complete file content`，复制成功后再点击 `Open GitHub editor`。
7. 在 GitHub 的文件编辑区域粘贴完整内容，不要粘贴到 commit message；最后点击 `Commit changes`。
8. GitHub Actions 自动重新构建并发布。

发布不是数据库实时更新，需要等待 GitHub Actions 构建完成。构建失败时，旧网站仍然保留，可在仓库 Actions 页面查看错误并修正对应内容。

## 图片建议

- 成员头像：纵向 4:5，建议不超过 1600 px。
- 论文封面：横向 4:3 或 16:10。
- 优先使用 WebP 或压缩后的 JPG/PNG。
- 单张建议控制在 1 MB 左右。
- PDF、视频和大型数据集建议填写外部链接，不直接放进仓库。
