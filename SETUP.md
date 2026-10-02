# 首次上线配置

这份目录可以直接作为一个新 GitHub 仓库的根目录。公开网站不依赖数据库；所有内容和图片都保存在该仓库中。

## 1. 创建并上传仓库

1. 在 GitHub 创建新仓库，例如 `mmi-lab-website`。
2. 将本目录中的全部文件上传到仓库根目录，不要再套一层文件夹。
3. 默认分支使用 `main`。
4. 确认 `.github/workflows/deploy.yml` 已包含在仓库中。

## 2. 后台仓库地址

`public/admin/config.yml` 已配置为：

```yaml
repo: Multimodal-Intelligence-Lab-MIL/Lab_website
```

`branch` 为 `main`。Decap CMS 的每次保存、上传、删除都会形成一次 Git commit。如果以后复制到其他仓库，再修改这里的仓库地址。

## 3. 启用 GitHub Pages

1. 打开仓库 `Settings → Pages`。
2. 在 `Build and deployment` 中将 Source 选择为 `GitHub Actions`。
3. 推送到 `main` 后，打开 `Actions` 查看 `Deploy to GitHub Pages`。
4. 第一次成功后，GitHub 会给出网站地址。

Astro 会在 GitHub Actions 中自动判断：

- 仓库名为 `<owner>.github.io` 时使用根路径 `/`。
- 普通项目仓库时使用 `/<repository>/`。

因此公开页面、图片和内部链接在两种地址下都可以工作。

## 4. 配置 `/admin/` 的 GitHub 登录

GitHub Pages 不能安全保存 GitHub Client Secret，因此 Decap CMS 的标准 GitHub 登录需要一个 OAuth 代理。代理只处理登录授权；内容仍保存在你的 GitHub 仓库。

建议按 Decap CMS 官方 GitHub backend 文档中的 **Using GitHub with an OAuth Proxy** 配置：

- https://decapcms.org/docs/github-backend/
- https://decapcms.org/docs/backends-overview/

配置步骤：

1. 在 GitHub `Settings → Developer settings → OAuth Apps` 创建 OAuth App。
2. Homepage URL 填公开网站地址。
3. Authorization callback URL 填 OAuth 代理文档要求的 `/callback` 地址。
4. 按所选 OAuth 代理的说明，将 GitHub Client ID、Client Secret 和网站域名保存为代理端 Secret，不要写进本仓库。
5. 将 `public/admin/config.yml` 中的 `base_url` 改成代理地址：

```yaml
base_url: https://your-oauth-proxy.example
auth_endpoint: auth
```

6. 把需要登录后台的 GitHub 用户添加为仓库 collaborator，并给予写入权限。
7. 重新推送后访问 `https://你的站点/admin/`，选择 GitHub 登录。

没有完成 OAuth 配置时，公开网站仍然正常工作，只是 `/admin/` 暂时不能登录。也可以直接在 GitHub 中编辑 `src/content/` 文件。

## 5. 自定义域名（可选）

如果使用自定义域名：

1. 在 GitHub Pages 中配置域名和 DNS。
2. 新建 `public/CNAME`，文件内容只有域名，例如 `mmi-lab.example.ac.uk`。
3. 在仓库 `Settings → Secrets and variables → Actions → Variables` 添加：
   - `SITE_URL`：完整域名，例如 `https://mmi-lab.example.ac.uk`
   - `BASE_PATH`：填写 `/`

普通 `github.io/仓库名/` 部署不需要创建这些 Variables。

## 6. 日常使用

1. 访问 `/admin/`。
2. 使用有写入权限的 GitHub 账号登录。
3. 新增或修改 News、Publication、People、Research 或 Site settings。
4. 点击保存。
5. Decap CMS 提交一次 Git commit。
6. GitHub Actions 自动重新构建并发布。

发布不是数据库实时更新，需要等待 GitHub Actions 构建完成。构建失败时，旧网站仍然保留，可在仓库 Actions 页面查看错误并修正对应内容。

## 图片建议

- 成员头像：纵向 4:5，建议不超过 1600 px。
- 论文封面：横向 4:3 或 16:10。
- 优先使用 WebP 或压缩后的 JPG/PNG。
- 单张建议控制在 1 MB 左右。
- PDF、视频和大型数据集建议填写外部链接，不直接放进仓库。
