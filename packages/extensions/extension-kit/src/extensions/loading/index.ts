import { Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import Wrapper from './Wrapper.vue';

export const Loading = Node.create({
  name: 'loading',
  inline: true,
  group: 'inline',
  atom: true,

  addAttributes() {
    return {
      text: {
        default: null,
      },
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(Wrapper);
  },
});
