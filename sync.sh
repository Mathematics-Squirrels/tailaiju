#!/bin/bash
# 泰来居 · 同步部署脚本
# 用法: ./sync.sh "改动说明"

cd "$(dirname "$0")"

MSG="${1:-更新页面}"

echo "📦 检测改动..."
git add -A
git diff --cached --quiet && echo "✅ 没有需要同步的改动" && exit 0

git commit -m "$MSG"
echo "✅ 已提交: $MSG"

# 如果有远程仓库，自动推送
REMOTE=$(git remote get-url origin 2>/dev/null)
if [ -n "$REMOTE" ]; then
    echo "🚀 推送到 $REMOTE ..."
    git push origin main
    echo "✅ 推送完成 — 线上将在几秒内自动更新"
else
    echo ""
    echo "⚠️  尚未配置远程仓库。首次使用请:"
    echo "   1. 在 GitHub 创建仓库 (如 yourname/tailaiju)"
    echo "   2. 运行: git remote add origin git@github.com:yourname/tailaiju.git"
    echo "   3. 运行: git push -u origin main"
    echo "   4. 在仓库 Settings → Pages 开启 GitHub Pages (Source: main, /root)"
    echo ""
    echo "   之后每次运行 ./sync.sh 即可一键同步"
fi
