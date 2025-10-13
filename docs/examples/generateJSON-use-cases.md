# generateJSON 使用场景详解

## 为什么需要 generateJSON？

`generateJSON` 的核心价值：**在没有编辑器实例的情况下，处理和转换内容**

## 实际使用场景

### 场景 1：服务器端内容处理 🖥️

**问题**：服务器上没有浏览器环境，无法创建编辑器实例

```typescript
// ❌ 服务器上无法这样做
const editor = new Editor({ ... })  // 报错：没有 DOM
editor.commands.insertContent(html)

// ✅ 使用 generateJSON（服务器端）
import { generateJSON } from '@tiptap/html'  // 使用虚拟 DOM

const json = generateJSON(htmlFromDatabase, extensions)
// 可以存储到数据库、发送给客户端等
```

**实际应用**：
- 内容迁移脚本
- 定时任务处理文档
- API 接口返回统一格式
- SSR（服务器端渲染）

### 场景 2：内容验证和过滤 ✅

**问题**：需要在插入前验证内容是否符合规范

```typescript
import { generateJSON } from '@tiptap/core'

// 用户粘贴了一段 HTML，需要检查是否包含危险内容
function validateAndCleanContent(html: string) {
  const json = generateJSON(html, extensions)
  
  // 检查是否包含不允许的节点
  const hasScript = JSON.stringify(json).includes('script')
  if (hasScript) {
    throw new Error('不允许包含脚本')
  }
  
  // 检查图片数量
  const imageCount = countImages(json)
  if (imageCount > 10) {
    throw new Error('图片数量超过限制')
  }
  
  return json
}

function countImages(node: any): number {
  let count = 0
  if (node.type === 'image') count++
  if (node.content) {
    node.content.forEach(child => {
      count += countImages(child)
    })
  }
  return count
}
```

### 场景 3：内容预处理和转换 🔄

**问题**：需要在插入前修改内容结构

```typescript
// 场景：自动给所有链接添加 target="_blank"
function processLinks(html: string) {
  const json = generateJSON(html, extensions)
  
  // 遍历并修改 JSON
  const processed = traverseAndModify(json, (node) => {
    if (node.type === 'link') {
      return {
        ...node,
        attrs: {
          ...node.attrs,
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      }
    }
    return node
  })
  
  return processed
}

// 场景：替换所有图片 URL（如 CDN 迁移）
function migrateImageUrls(html: string, oldCdn: string, newCdn: string) {
  const json = generateJSON(html, extensions)
  
  const migrated = traverseAndModify(json, (node) => {
    if (node.type === 'image' && node.attrs.src.includes(oldCdn)) {
      return {
        ...node,
        attrs: {
          ...node.attrs,
          src: node.attrs.src.replace(oldCdn, newCdn)
        }
      }
    }
    return node
  })
  
  return migrated
}
```

### 场景 4：内容分析和统计 📊

**问题**：需要分析文档内容而不渲染编辑器

```typescript
// 统计文档信息
function analyzeDocument(html: string) {
  const json = generateJSON(html, extensions)
  
  return {
    wordCount: countWords(json),
    imageCount: countNodes(json, 'image'),
    linkCount: countNodes(json, 'link'),
    headingCount: countNodes(json, 'heading'),
    codeBlockCount: countNodes(json, 'codeBlock'),
    tableCount: countNodes(json, 'table'),
    // 计算预计阅读时间
    estimatedReadTime: Math.ceil(countWords(json) / 200) + ' 分钟'
  }
}

// 内容审核
function moderateContent(html: string) {
  const json = generateJSON(html, extensions)
  
  const issues = []
  
  // 检查是否有外部链接
  const externalLinks = findExternalLinks(json)
  if (externalLinks.length > 0) {
    issues.push(`包含 ${externalLinks.length} 个外部链接，需要审核`)
  }
  
  // 检查图片来源
  const externalImages = findExternalImages(json)
  if (externalImages.length > 0) {
    issues.push(`包含 ${externalImages.length} 个外部图片`)
  }
  
  return { passed: issues.length === 0, issues }
}
```

### 场景 5：数据迁移和格式转换 🔄

**问题**：从其他编辑器迁移内容到 Tiptap

```typescript
// 从富文本 HTML 迁移到 Tiptap JSON 格式存储
async function migrateFromOldEditor() {
  const oldDocuments = await db.documents.find({ editor: 'old' })
  
  for (const doc of oldDocuments) {
    // 将旧编辑器的 HTML 转换为 Tiptap JSON
    const json = generateJSON(doc.html, tiptapExtensions)
    
    // 存储为 JSON 格式（更高效，更易于查询）
    await db.documents.update(doc.id, {
      content: json,
      editor: 'tiptap',
      migrated_at: new Date()
    })
  }
}

// 批量处理：清理所有文档中的空段落
async function cleanupEmptyParagraphs() {
  const documents = await db.documents.findAll()
  
  for (const doc of documents) {
    const json = generateJSON(doc.html, extensions)
    const cleaned = removeEmptyParagraphs(json)
    await db.documents.update(doc.id, { content: cleaned })
  }
}
```

### 场景 6：API 接口数据处理 🌐

**问题**：API 需要返回统一的内容格式

```typescript
// API 端点：接受 HTML，返回标准化的 JSON
app.post('/api/content/parse', (req, res) => {
  const { html } = req.body
  
  try {
    // 转换为 JSON 格式
    const json = generateJSON(html, extensions)
    
    // 提取元数据
    const metadata = {
      wordCount: countWords(json),
      firstParagraph: extractFirstParagraph(json),
      images: extractImages(json),
      links: extractLinks(json)
    }
    
    res.json({
      content: json,
      metadata,
      version: '1.0'
    })
  } catch (error) {
    res.status(400).json({ error: 'Invalid HTML' })
  }
})

// WebSocket 实时协作：格式化内容后再广播
websocket.on('content-update', (data) => {
  // 验证和标准化内容
  const json = generateJSON(data.html, extensions)
  
  // 广播给其他用户
  broadcast({
    type: 'content-update',
    content: json,
    user: data.userId
  })
})
```

### 场景 7：离线内容预处理 💾

**问题**：在用户离线时预处理内容

```typescript
// Service Worker 中处理离线保存的内容
self.addEventListener('sync', async (event) => {
  if (event.tag === 'sync-documents') {
    const pendingDocs = await getOfflineDocuments()
    
    for (const doc of pendingDocs) {
      // 在后台处理内容
      const json = generateJSON(doc.html, extensions)
      
      // 压缩和优化
      const optimized = optimizeJSON(json)
      
      // 上传到服务器
      await uploadToServer(optimized)
    }
  }
})
```

## 总结：何时使用 generateJSON

| 场景 | 使用 generateJSON | 直接用编辑器 |
|------|------------------|-------------|
| 在编辑器中插入内容 | ❌ | ✅ 直接 insertContent(html) |
| 服务器端处理 | ✅ | ❌ 没有 DOM |
| 内容验证/过滤 | ✅ | ⚠️ 可以但不必要 |
| 批量数据迁移 | ✅ | ❌ 性能差 |
| 内容分析统计 | ✅ | ❌ 不需要编辑器 |
| API 数据处理 | ✅ | ❌ 不需要编辑器 |
| 实时协作同步 | ✅ | ⚠️ 看情况 |

## 核心原则

**如果你有编辑器实例且只是要插入内容 → 直接用 HTML**
**如果你需要处理内容但没有/不需要编辑器 → 用 generateJSON**

