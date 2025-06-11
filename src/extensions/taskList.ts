/*
 * @Author: ykx
 * @Date: 2022-11-30 19:31:40
 * @LastEditTime: 2022-11-30 19:32:42
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\taskList.ts
 */
import { TaskList as BuiltInTaskList } from '@tiptap/extension-task-list';
import { PARSE_HTML_PRIORITY_HIGHEST } from '@/enums/constants';

export const TaskList = BuiltInTaskList.extend({
  parseHTML() {
    return [
      {
        tag: 'ul.task-list',
        priority: PARSE_HTML_PRIORITY_HIGHEST,
      },
    ];
  },
});
