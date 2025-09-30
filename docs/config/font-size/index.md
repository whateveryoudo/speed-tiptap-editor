# 字体大小配置（fontSize）

`SpeedTiptapEditor` 支持通过 `props.fontSize` 配置字号默认值与选项，工具栏与文本气泡菜单都会读取该配置。

## 类型

```ts
export interface CollaborationEditorProps {
  fontSize?: {
    default?: string;
    options?: { value: string; label: string }[];
  };
}
```

- default: 默认字号（如 `'14px'`）
- options: 下拉选项，value 为数字字符串（不含 px），label 展示时含 `px`

## 基础用法

```vue
<template>
  <SpeedTiptapEditor :fontSize="{ default: '14px' }" />
</template>
```

## 自定义默认值与选项

```vue
<template>
  <SpeedTiptapEditor :fontSize="fontSize" />
</template>

<script setup lang="ts">
const fontSize = {
  default: '16px',
  options: [
    { value: '12', label: '12px' },
    { value: '14', label: '14px' },
    { value: '16', label: '16px' },
    { value: '18', label: '18px' },
    { value: '20', label: '20px' },
  ],
}
</script>
```

## 关联
- 工具栏组件：`src/menus/fontSize.vue`
- 文本气泡菜单项键：`fontSize`
