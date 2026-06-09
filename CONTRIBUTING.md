# 提交规范（Conventional Commits）

本项目使用 `semantic-release` 自动分析提交记录，决定：

- 是否发布新版本到 npm
- 发布什么版本（patch / minor / major）
- 自动生成 `changelog.md` 与 GitHub Release

## 提交格式

```text
<type>(<scope>): <subject>
```

- `type`：提交类型（必须）
- `scope`：影响范围（可选）
- `subject`：简短说明（必须）

示例：

```text
fix(upload): 修复空文件导致的报错
feat(preset): 支持 lite / knowledge 预设
docs(readme): 更新安装说明
```

## 哪些提交会触发发版

- `fix:` -> patch（如 `1.0.0 -> 1.0.1`）
- `feat:` -> minor（如 `1.0.0 -> 1.1.0`）
- `feat!:` 或正文含 `BREAKING CHANGE:` -> major（如 `1.0.0 -> 2.0.0`）

## 默认不触发发版的类型

- `docs:`
- `chore:`
- `style:`
- `refactor:`
- `test:`
- `ci:`
- `build:`

## 发版流程

1. 向 `main` 分支推送符合规范的 `feat` / `fix` / breaking change 提交
2. GitHub Actions `Release NPM` 工作流自动执行 `pnpm build:lib` 与 `semantic-release`
3. 成功后自动发布到 npm，并创建 GitHub Release / tag

也可在 Actions 页面手动触发 `workflow_dispatch`。

## 首次发版（v1.0.0）

`package.json` 基线版本为 `1.0.0`。仓库尚无 release tag 时：

- 使用 `feat!:` 或含 `BREAKING CHANGE` 的提交，可触发首个 **1.0.0** 发版
- 或先在 GitHub / 本地为当前 main 创建 `v1.0.0` tag，后续按常规 `feat` / `fix` 递增

## 仓库 Secrets 配置

在 GitHub 仓库 Settings -> Secrets and variables -> Actions 中配置：

| Secret | 说明 |
|--------|------|
| `NPM_TOKEN` | npm 自动化发布 token（Automation 类型） |

`GITHUB_TOKEN` 由 Actions 自动提供，用于创建 Release 与回写 changelog。

## FAQ

### 为什么 push 后没有发版？

检查提交类型是否是 `feat` / `fix` / breaking change。`docs`、`chore`、`ci` 通常不会发布新版本。

### 为什么 build 失败？

发版前会执行 `pnpm build:lib`，请确保本地构建通过后再推送。
