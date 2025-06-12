const fs = require('fs-extra');
const path = require('path');

async function prepareDeploy() {
  // 创建部署目录
  const deployDir = path.resolve(__dirname, '../dist-deploy');
  await fs.ensureDir(deployDir);

  // 复制文档到 docs 目录
  const docsDistDir = path.resolve(__dirname, '../docs/.vitepress/dist');
  const docsTargetDir = path.resolve(deployDir, 'docs');
  
  // 确保目标目录存在
  await fs.ensureDir(docsTargetDir);
  
  // 复制所有文件
  await fs.copy(docsDistDir, docsTargetDir, {
    filter: (src) => {
      // 排除 .git 目录
      return !src.includes('.git');
    }
  });

  // 复制示例到 example 目录
  await fs.copy(
    path.resolve(__dirname, '../example/dist-example'),
    path.resolve(deployDir, 'example')
  );

  // 创建根目录的 index.html 重定向到 docs
  const indexHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Speed Tiptap Editor</title>
    <script>
      // 获取当前路径
      const path = window.location.pathname;
      // 如果当前路径是根路径，重定向到 docs
      if (path === '/' || path === '/speed-tiptap-editor/' || path === '/speed-tiptap-editor/index.html') {
        window.location.href = '/speed-tiptap-editor/docs/';
      }
    </script>
  </head>
  <body>
    <p>If you are not redirected automatically, <a href="/speed-tiptap-editor/docs/">click here</a>.</p>
  </body>
</html>
  `.trim();

  await fs.writeFile(path.resolve(deployDir, 'index.html'), indexHtml);

  // 创建 example 目录的 index.html
  const exampleIndexHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Speed Tiptap Editor - Example</title>
    <script>
      // 获取当前路径
      const path = window.location.pathname;
      // 如果当前路径是 example 目录，重定向到 example/
      if (path === '/speed-tiptap-editor/example/' || path === '/speed-tiptap-editor/example') {
        window.location.href = '/speed-tiptap-editor/example/';
      }
    </script>
  </head>
  <body>
    <p>If you are not redirected automatically, <a href="/speed-tiptap-editor/example/">click here</a>.</p>
  </body>
</html>
  `.trim();

  await fs.writeFile(path.resolve(deployDir, 'example/index.html'), exampleIndexHtml);

  console.log('Deploy files prepared successfully!');
}

prepareDeploy().catch(console.error);