/**
 * 第三方思维导图库的适配器契约（选型后实现此接口即可接入）。
 *
 * 示例候选库（需自行调研）：
 * - simple-mind-map (https://github.com/wanglin2/mind-map)
 * - jsMind
 * - markmap（更偏 markdown 大纲，不是传统脑图）
 */
export interface MindEditorAdapter {
  /** 库名称，用于调试 */
  readonly id: string

  /**
   * 返回要注册进 Tiptap 的扩展（至少包含一个 block node，name 建议 `mind`）
   */
  createExtensions(ctx: Record<string, unknown>): unknown[]

  /** 插入空思维导图；editor 为 Tiptap Editor 实例 */
  insertMind(editor: { chain: () => { focus: () => { run: () => boolean } } }, attrs?: Record<string, unknown>): void
}

export interface CreateMindPluginOptions {
  /** 传入适配器后才真正注册扩展与插入菜单；未传时 plugin 为空壳 */
  adapter?: MindEditorAdapter
}
