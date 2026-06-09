import { computed, onUnmounted, shallowRef, unref, watch, type MaybeRef } from 'vue'
import * as Y from 'yjs'
import { HocuspocusProvider, type onAwarenessUpdateParameters } from '@hocuspocus/provider'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import type { Extensions } from '@tiptap/core'
import { getRandomColor } from '@st/helpers/color'

export interface CollaborationUser {
  id: string | number
  username: string
  nickname?: string
  avatar?: string
  color?: string
  [key: string]: any
}

export interface CollaborationConfig {
  documentId: string
  url: string
  token: string
  user: CollaborationUser
}

export interface UseCollaborationOptions {
  config: MaybeRef<CollaborationConfig | null | undefined>
  enabled?: MaybeRef<boolean>
  onCollaboratorsChange?: (users: CollaborationUser[]) => void
}

export function useCollaboration(options: UseCollaborationOptions) {
  const ydoc = shallowRef<Y.Doc | null>(null)
  const provider = shallowRef<HocuspocusProvider | null>(null)

  let currentDoc: Y.Doc | null = null
  let currentProvider: HocuspocusProvider | null = null

  const destroy = () => {
    currentProvider?.awareness?.setLocalState(null)
    currentProvider?.disconnect?.()
    currentProvider?.destroy?.()
    currentProvider = null
    provider.value = null

    if (currentDoc) {
      currentDoc.destroy()
      currentDoc = null
    }
    ydoc.value = null
  }

  const setup = () => {
    destroy()

    const cfg = unref(options.config)
    const isEnabled = unref(options.enabled) ?? true

    if (!isEnabled || !cfg?.documentId) {
      return
    }

    const doc = new Y.Doc()
    currentDoc = doc

    currentProvider = new HocuspocusProvider({
      name: cfg.documentId,
      url: cfg.url,
      token: cfg.token,
      document: doc,
      onSynced: () => {
        ydoc.value = doc
        provider.value = currentProvider
      },
      onAwarenessUpdate: (params: onAwarenessUpdateParameters) => {
        const users = params.states
          .map((s: any) => s.user)
          .filter((u: CollaborationUser | undefined): u is CollaborationUser => !!u)
        options.onCollaboratorsChange?.(users)
      },
    })
  }

  watch(
    () => [unref(options.config), unref(options.enabled)],
    setup,
    { immediate: true, deep: true },
  )

  onUnmounted(destroy)

  const isCollaborationActive = computed(() => !!ydoc.value && !!provider.value)

  const collaborationExtensions = computed<Extensions>(() => {
    const doc = ydoc.value
    const activeProvider = provider.value
    const cfg = unref(options.config)

    if (!doc) {
      return []
    }

    const extensions: Extensions = [
      Collaboration.configure({
        document: doc,
      }),
    ]

    if (activeProvider && cfg?.user) {
      extensions.push(
        CollaborationCaret.configure({
          provider: activeProvider,
          user: {
            id: cfg.user.id,
            avatar: cfg.user.avatar,
            name: cfg.user.nickname || cfg.user.username,
            color: cfg.user.color ?? getRandomColor(),
          },
        }),
      )
    }

    return extensions
  })

  const caretUser = computed(() => {
    const cfg = unref(options.config)
    if (!cfg?.user) return null
    return {
      id: cfg.user.id,
      avatar: cfg.user.avatar,
      name: cfg.user.nickname || cfg.user.username,
      color: cfg.user.color ?? getRandomColor(),
    }
  })

  return {
    ydoc,
    provider,
    caretUser,
    isCollaborationActive,
    collaborationExtensions,
    destroy,
  }
}

/** 根据外部传入的 ydoc / provider 构建协同扩展（供 Editor 组件使用） */
export function buildCollaborationExtensions(
  doc: Y.Doc | null | undefined,
  activeProvider: HocuspocusProvider | null | undefined,
  user?: CollaborationUser | null,
): Extensions {
  if (!doc) {
    return []
  }

  const extensions: Extensions = [
    Collaboration.configure({
      document: doc,
    }),
  ]

  if (activeProvider && user) {
    extensions.push(
      CollaborationCaret.configure({
        provider: activeProvider,
        user: {
          id: user.id,
          avatar: user.avatar,
          name: user.nickname || user.username,
          color: user.color ?? getRandomColor(),
        },
      }),
    )
  }

  return extensions
}
