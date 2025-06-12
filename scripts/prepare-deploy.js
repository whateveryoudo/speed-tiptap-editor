const fs = require('fs-extra');
const path = require('path');

async function prepareDeploy() {
  // 创建部署目录
  const deployDir = path.resolve(__dirname, '../dist-deploy');
  await fs.ensureDir(deployDir);

  // 复制文档到根目录
  await fs.copy(
    path.resolve(__dirname, '../docs/.vitepress/dist'),
    path.resolve(deployDir, 'docs')
  );

  // 复制示例到 example 目录
  await fs.copy(
    path.resolve(__dirname, '../dist-example'),
    path.resolve(deployDir, 'example')
  );

  // 创建根目录的 index.html 重定向到 docs
  const indexHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0;url=/docs/">
    <link rel="canonical" href="/docs/">
  </head>
  <body>
    <p>Redirecting to <a href="/docs/">documentation</a>...</p>
  </body>
</html>
  `.trim();

  await fs.writeFile(path.resolve(deployDir, 'index.html'), indexHtml);

  console.log('Deploy files prepared successfully!');
}

prepareDeploy().catch(console.error);