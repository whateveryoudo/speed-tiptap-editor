/*
 * @Author: ykx
 * @Date: 2022-11-09 09:27:33
 * @LastEditTime: 2022-11-17 15:44:39
 * @LastEditors: your name
 * @Description:
 * @FilePath: \think-main\packages\client\src\tiptap\core\extensions\link.ts
 */
import { markInputRule } from '@tiptap/core';
import { Link as BuiltInLink } from '@tiptap/extension-link';

const extractHrefFromMatch = (match) => {
  return { href: match.groups.href };
};

export const extractHrefFromMarkdownLink = (match) => {
  /**
   * Removes the last capture group from the match to satisfy
   * tiptap markInputRule expectation of having the content as
   * the last capture group in the match.
   *
   * https://github.com/ueberdosis/tiptap/blob/%40tiptap/core%402.0.0-beta.75/packages/core/src/inputRules/markInputRule.ts#L11
   */
  match.pop();
  return extractHrefFromMatch(match);
};

export const Link = BuiltInLink.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: false,
    };
  },

  addInputRules() {
    const markdownLinkSyntaxInputRuleRegExp = /(?:^|\s)\[([\w|\s|-|\u4e00-\u9fa5]+)\]\((?<href>.+?)\)$/gm;
    const urlSyntaxRegExp = /(?:^|\s)(?<href>(?:https?:\/\/|www\.)[\S]+)(?:\s|\n)$/gim;

    return [
      markInputRule({
        find: markdownLinkSyntaxInputRuleRegExp,
        type: this.type,
        getAttributes: extractHrefFromMarkdownLink,
      }),
      markInputRule({
        find: urlSyntaxRegExp,
        type: this.type,
        getAttributes: extractHrefFromMatch,
      }),
    ];
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      href: {
        default: null,
        parseHTML: (element) => element.getAttribute('href'),
      },
      title: {
        title: null,
        parseHTML: (element) => element.getAttribute('title'),
      },
    };
  },
}).configure({
  openOnClick: false,
  linkOnPaste: true,
  autolink: false,
});
