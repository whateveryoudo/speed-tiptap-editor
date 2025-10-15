#!/bin/bash
# ========================================
# 🛠️  Git 文件夹重命名脚本（仅本地，支持大小写修改）
# 功能: 安全地将文件夹从 MyFolder → myfolder，不自动推送
# 适合：你想手动控制推送时机
# ========================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}" >&2; }
info() { echo -e "${GREEN}📌 $1${NC}"; }

# 检查是否在 Git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  error "当前目录不是 Git 仓库"
  exit 1
fi

# 检查参数
if [ -z "$1" ] || [ -z "$2" ]; then
  echo -e "${RED}用法:${NC} $0 <旧文件夹名> <新文件夹名>"
  echo -e "${YELLOW}示例:${NC} $0 MyFolder myfolder"
  exit 1
fi

OLD="$1"
NEW="$2"
TEMP="temp_git_rename_$(date +%s)_$RANDOM"

# 检查旧文件夹是否存在
if [ ! -d "$OLD" ]; then
  error "文件夹 '$OLD' 不存在"
  exit 1
fi

# 检查新文件夹是否已存在
if [ -d "$NEW" ]; then
  error "目标文件夹 '$NEW' 已存在，请先删除或改名"
  exit 1
fi

# 检查是否有未提交的更改（可选提示）
if ! git diff-index --quiet HEAD --; then
  warn "当前有未提交的更改，重命名后会一起出现在暂存区"
  read -p "是否继续？(y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    error "操作已取消"
    exit 1
  fi
fi

log "开始重命名: '$OLD' → '$NEW'"

# 第一步：重命名到临时名
log "第一步：$OLD → $TEMP"
git mv "$OLD" "$TEMP"
if [ $? -ne 0 ]; then
  error "git mv 失败"
  exit 1
fi

git commit -m "chore: temp rename $OLD → $TEMP"
if [ $? -ne 0 ]; then
  error "提交失败"
  git reset --hard
  exit 1
fi

# 第二步：从临时名重命名为目标名
log "第二步：$TEMP → $NEW"
git mv "$TEMP" "$NEW"
if [ $? -ne 0 ]; then
  error "git mv 失败"
  exit 1
fi

git commit -m "chore: rename $TEMP → $NEW"
if [ $? -ne 0 ]; then
  error "提交失败"
  git reset --hard
  exit 1
fi

# ✅ 成功，但不推送
log "重命名成功！"
info "提交已完成，但未推送"
info "你现在可以在 Git 工具中查看变更"
info "或运行 'git log --oneline -2' 查看最近两次提交"
info "你可以随时手动推送：git push origin <branch>"

# 显示分支名
BRANCH=$(git branch --show-current)
info "当前分支: $BRANCH"