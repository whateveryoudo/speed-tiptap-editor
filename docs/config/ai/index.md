# AI 配置

Speed Tiptap Editor 支持集成 AI 助手功能，帮助用户智能处理文本内容。目前支持[豆包（火山引擎）大模型](https://www.volcengine.com/docs/82379/1099455)。

## 配置说明

### 基础配置

在 `SpeedTiptapEditor` 组件中添加 `ai` 配置项：

```vue
<template>
  <SpeedTiptapEditor 
    v-model:content="content" 
    v-model:title="title"
    v-bind="editorProps" 
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref('')
const title = ref('')

const editorProps = {
  ai: {
    doubao: {
      // 后端请求地址（不要将敏感参数如 API Key 暴露在前端）
      url: '//localhost:3005/ai/doubao/stream',
      
      // 请求头配置（可选）
      header: {
        'Authorization': `Bearer ${token}`,
        // 其他自定义请求头...
      },
      
      // 自定义请求参数（可按照实际接口接收参数结构定义）
      bodyParams: (action: string, content: string, customPrompt: string): Record<string, any> => {
        return {
          action,
          content,
          customPrompt,
        }
      }
    }
  }
}
</script>
```

## 配置项详解

### `ai.doubao`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `url` | `string` | 是 | 后端 AI 流式接口地址 |
| `header` | `Record<string, string>` | 否 | 请求头配置，常用于携带认证 token |
| `bodyParams` | `Function` | 否 | 自定义请求体参数的函数,默认为`{action: options.action,content: options.content,customPrompt: options.customPrompt}` |

### `bodyParams` 函数参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `action` | `AIAction` | AI 操作类型 |
| `content` | `string` | 编辑器中选择的文本内容 |
| `customPrompt` | `string` | 用户输入的自定义提示词（仅在 `custom` 操作时有值） |

## AI 操作类型

编辑器内置了以下 AI 操作类型：

| 操作类型 | 说明 | 中文标签 |
|---------|------|----------|
| `refactor` | 改进写作，优化文本表达 | 改进写作 |
| `check` | 检查拼写和语法错误 | 检查拼写和语法 |
| `simple` | 简化内容，让文本更简洁 | 简化内容 |
| `rich` | 丰富内容，让文本更详细 | 丰富内容 |
| `translate` | 翻译文本 | 翻译 |
| `summary` | 总结文本内容 | 总结 |
| `custom` | 自定义操作（用户自己输入提示词） | 处理 |

## 后端接口要求

### 请求格式

- **方法**: `POST`
- **Content-Type**: `application/json`
- **请求体(示例)**:
  ```json
  {
    "action": "refactor",
    "content": "需要处理的文本内容",
    "customPrompt": "用户自定义提示词（可选）"
  }
  ```

### 响应格式

后端接口需要返回 **Server-Sent Events (SSE)** 格式的流式响应：

- **Content-Type**: `text/event-stream`
- **数据格式**: 支持以下几种格式

#### OpenAI 格式（推荐）

```
data: {"choices":[{"delta":{"content":"生成的文本片段"}}]}

data: {"choices":[{"delta":{"content":""},"finish_reason":"stop"}]}
```

#### 简单格式

```
data: {"content":"生成的文本片段"}
```

#### 完成标记

```
data: [DONE]
```

### 错误处理

- **客户端错误** (4xx): 返回 HTTP 状态码 400-499
- **服务端错误** (5xx): 返回 HTTP 状态码 500+
- **错误事件**:
  ```
  event: FatalError
  data: 错误信息
  ```

## 完整示例

**相关后端示例可参照[speed-apis](https://github.com/whateveryoudo/speed-apis/blob/main/src/routes/ai/doubao.js)**


```vue
<template>
  <div class="editor-container">
    <SpeedTiptapEditor 
      v-model:content="content" 
      v-model:title="title"
      preset="knowledge"
      v-bind="knowledgeProps" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGlobalStore } from '@/store'

const content = ref('')
const title = ref('')
const globalStore = useGlobalStore()

const knowledgeProps = {
  upload: {
    uploadApis: {
      // ... 上传配置
    }
  },
  ai: {
    doubao: {
      // 对应后端请求地址
      url: '//localhost:3005/ai/doubao/stream',
      
      // 请求头配置
      header: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      
      // 自定义请求参数
      bodyParams: (action: string, content: string, customPrompt: string) => {
        // 可以在这里构建系统提示词或添加其他参数
        return {
          action,
          content,
          customPrompt
        }
      }
    }
  }
}
</script>
```

## 使用方式

配置完成后，用户可以在编辑器中：

1. 选中需要处理的文本
2. 点击工具栏中的 AI 助手按钮
3. 选择需要的操作类型（改进写作、检查语法等）或自定义输入提示词
4. 查看 AI 实时生成的结果
5. 可以取消正在进行的 AI 处理

## 注意事项

### 安全性

- ⚠️ **不要在前端暴露 API Key 等敏感信息**
- ✅ 将 API Key 配置在后端服务中
- ✅ 通过 `header` 配置传递认证 token

### 后端实现

- 后端需要实现 SSE 流式响应
- 建议使用后端代理调用大模型 API
- 需要处理用户认证和权限校验

### 自定义提示词

如果需要根据不同的 `action` 构建不同的系统提示词，可以在后端实现：

```javascript
// 后端示例（Node.js）
const systemPrompts = {
  refactor: '你是一个专业的写作助手，请帮助改进以下文本...',
  check: '你是一个语法检查专家，请检查以下文本的拼写和语法错误...',
  simple: '请将以下内容简化，保留核心要点...',
  rich: '请丰富以下内容，添加更多细节和例子...',
  translate: '请将以下内容翻译成英文/中文...',
  summary: '请总结以下内容的核心要点...',
  custom: '根据用户指令处理内容...'
}

// 根据 action 构建完整的提示词
const systemPrompt = systemPrompts[action]
const userPrompt = action === 'custom' ? customPrompt : content
```

## 扩展支持

目前编辑器已经为多大模型集成预留了接口，后续版本将支持：

- OpenAI GPT 系列
- 通义千问
- 文心一言
- 其他兼容 OpenAI API 格式的大模型

敬请期待！

## 相关资源

- [豆包大模型文档](https://www.volcengine.com/docs/82379)
- [Server-Sent Events 规范](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [@microsoft/fetch-event-source](https://github.com/Azure/fetch-event-source)

