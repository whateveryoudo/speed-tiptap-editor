/*
 * @Author: ykx
 * @Date: 2022-11-22 18:42:46
 * @LastEditTime: 2022-11-29 19:01:28
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\enums\dict.ts
 */

export enum Tag {
  DOC_TITLE = 'doc-title',
  PARAGRAPH = 'p',
  CHECKBOX_ITEM = 'checkbox-item',
  MIND_MAP = 'mind',
}
export enum TagName {
  DOC_TITLE = 'DocTitle',
  PARAGRAPH = 'paragraph',
  CHECKBOX_ITEM = 'checkboxItem',
  MIND_MAP = 'mind',
}

export enum DefaultValue {
  DOC_TITLE = '新建文档',
}

export enum auth {
  creator = '超级管理员',
  admin = '管理员',
  member = '成员',
  noAccess = '无权限'
}

export declare enum AuthEnum {
  creator = 'creator',
  admin = 'admin',
  member = 'member',
  noAccess = 'noAccess'
}
export const EXTENSION_PRIORITY_LOWER = 75