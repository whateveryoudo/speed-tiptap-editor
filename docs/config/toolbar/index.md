# 工具栏配置

Speed Tiptap Editor 提供了灵活的工具栏配置，支持多种场景和自定义选项。

## 基础配置

### 预设工具栏

编辑器内置了两种工具栏配置（由 `preset` 决定）：

#### lite 预设

可当做普通富文本使用

```javascript
const defaultToolbar = [
  "insert", // 插入菜单
  "|", // 分隔符
  "undo",
  "redo",
  "clearNodeAndMarks", // 撤销、重做、清除格式
  "|",
  "heading",
  "fontSize",
  "bold",
  "italic",
  "underline",
  "strike", // 标题、字体大小、文本格式
  "|",
  "textColor",
  "backgroundColor", // 文本颜色、背景颜色
  "|",
  "align", // 对齐方式
  "|",
  "bulletList",
  "orderedList",
  "taskList", // 列表
  "|",
  "indent", // 缩进
  "|",
  "emoji", // 表情
  "|",
  "blockquote",
  "horizontalRule", // 引用、分割线
];
```

#### knowledge 预设

更丰富的功能集(类似语雀)，适用于知识管理

```javascript
const knowledgeToolbar = [
  "insert",
  "|",
  "undo",
  "redo",
  "clearNodeAndMarks",
  "|",
  "heading",
  "fontSize",
  "|",
  "bold",
  "italic",
  "underline",
  "strike",
  "moreText", // 包含更多文本选项
  "|",
  "textColor",
  "backgroundColor",
  "|",
  "link", // 链接功能
  "|",
  "align",
  "|",
  "bulletList",
  "orderedList",
  "taskList",
  "|",
  "indent",
  "|",
  "emoji",
  "|",
  "blockquote",
  "horizontalRule",
  "|",
  "findAndReplace", // 查找替换
];
```

## 使用方式

### 1. 使用预设

```vue
<template>
  <!-- 简易富文本（默认 preset="lite"） -->
  <SpeedTiptapEditor v-model:content="content" />

  <!-- 知识库完整富文本 -->
  <SpeedTiptapEditor
    preset="knowledge"
    v-model:title="title"
    :json="contentJson"
  />
</template>
```

知识库场景下，会支持title输入

### 2. 自定义工具栏

此配置下，会覆盖场景配置

```vue
<template>
  <SpeedTiptapEditor :toolbarKeys="customToolbar" />
</template>

<script setup lang="ts">
const customToolbar = [
  "insert",
  "|",
  "undo",
  "redo",
  "|",
  "bold",
  "italic",
  "underline",
  "|",
  "textColor",
  "backgroundColor",
];
</script>
```

### 3. 排除特定功能

此配置下，是指排除当前场景下的部分key

```vue
<template>
  <SpeedTiptapEditor :excludeKeys="['emoji', 'findAndReplace']" />
</template>
```

## 工具栏组件说明

### 基础功能

- **insert**: 插入菜单（图片、表格、代码块等）
- **undo**: 撤销
- **redo**: 重做
- **clearNodeAndMarks**: 清除格式

### 文本格式

- **heading**: 标题
- **fontSize**: 字体大小
- **bold**: 粗体
- **italic**: 斜体
- **underline**: 下划线
- **strike**: 删除线
- **moreText**: 更多文本选项

### 颜色设置

- **textColor**: 文本颜色
- **backgroundColor**: 背景颜色

### 布局

- **align**: 对齐方式
- **indent**: 缩进

### 列表

- **bulletList**: 无序列表
- **orderedList**: 有序列表
- **taskList**: 任务列表

### 其他

- **link**: 链接
- **emoji**: 表情
- **blockquote**: 引用
- **horizontalRule**: 分割线
- **findAndReplace**: 查找替换

## 高级配置

### 插入菜单配置

```vue
<template>
  <SpeedTiptapEditor :insertMenuConfig="insertMenuConfig" />
</template>

<script setup lang="ts">
const insertMenuConfig = {
  includeKeys: ["common&table", "common&image"],
  excludeKeys: ["common&table"],
  insertItems: [
    {
      groupKey: "common",
      key: "codeBlock",
      name: "代码块",
      iconRender: () => <CodeOutlined />,
      action: (editor: Editor) => {
        editor.chain().focus().setCodeBlock().run();
      },
      order: 1,
    },
  ],
  insertGroups: [
    {
      groupKey: "data",
      name: "数据类",
      layout: "vertical",
      span: 24,
      order: 4,
      children: [
        {
          key: "chart",
          name: "图表",
          iconRender: () => <AreaChartOutlined />,
          action: (editor: Editor) => {
            editor.chain().focus().setChart().run();
          },
          order: 1,
        },
      ],
    },
  ],
};
</script>
```

### 内置group:

- `common`--通用; 子菜单：`image`--图片,`table`--表格,`file`--附件,`tag`--标签
- `programmer`--程序员专区; 子菜单：`codeBlock`--代码块
- `layout`--布局和样式; 子菜单：`callout`--高亮块

**includeKeys**: 包含的插入菜单（注意这里采用groupKey&key形式标识）<br/>
**excludeKeys**: 排除的插入菜单<br/>
**insertItems**: 自定义插入项,类型为`InsertMenuItemConfig[]`<br/>
**insertGroups**: 自定义插入组,类型为`InsertMenuGroupConfig[]`

### 单个菜单类型`InsertMenuItemConfig`

```ts
interface InsertMenuItemConfig {
  groupKey?: string; // 所属分组-如果是插入组可以不传入
  key: string; // 唯一标识
  name: string; // 显示名称
  size?: number; // 图标大小
  iconRender?: (opt?: any) => VNode; // 自定义图标渲染（vNode或者image）
  iconType?: string; // 此项仅在配置了iconfont下生效，为iconfont的type值，优先级低于iconRender
  imgModule?: any; // 传入图片模块，优先级高于iconType 低于iconRender
  action?: (editor: Editor) => void; // 自定义点击操作（需结合自定义扩展调用相关commad）
  order?: number; // 排序（指在当前group下的排序）
}
```

### 单个组类型`InsertMenuGroupConfig`

```ts
interface InsertMenuItemConfig {
  groupKey: string; // 唯一标识
  name: string; // 显示名称
  layout?: "horizontal" | "vertical"; // 布局方式,支持横向和纵向
  span?: 12 | 24; // 占比
  children?: InsertMenuItemConfig[]; // 子项
  order?: number; // 排序
}
```

## 注意事项

1. **优先级**: `toolbarKeys` 优先级高于 `excludeKeys`
2. **冲突处理**: 同时传入 `toolbarKeys` 和 `excludeKeys` 时，只会生效 `toolbarKeys`
3. **分隔符**: 使用 `|` 作为工具栏分隔符
4. 大多数场景下仅需配置 `preset`，能够满足大多数场景
