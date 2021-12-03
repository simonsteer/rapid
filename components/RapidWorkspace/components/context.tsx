import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import {
  NormalizedElementNode,
  NormalizedNode,
  RapidElementNode,
  RapidElementTag,
  RapidNode,
  RapidTextNode,
} from 'components/RapidWorkspace/types'
import u from 'updeep'
import { v4 as uuid } from 'uuid'
import omit from 'lodash.omit'
import { DEFAULT_COMPONENT_TREE } from 'components/RapidWorkspace/constants'

type RapidEditorTree = {
  root: Exclude<NormalizedNode, RapidTextNode>
  [id: string]: NormalizedNode
}

const RapidEditorContext = createContext<{
  component: RapidElementNode
  tree: RapidEditorTree
  update<R extends RapidNode>(nodeId: string, patch: DeepPartial<R>): void
  deleteNode(nodeId: string): void
  insertNode(nodeId: string, tag: RapidElementTag | 'text'): void
}>({
  update() {
    console.log('empty update fn')
  },
  insertNode() {},
  deleteNode() {},
  component: DEFAULT_COMPONENT_TREE,
  tree: { root: null as any },
})

export function RapidEditorProvider({
  children,
  component,
}: {
  children: ReactNode
  component: RapidElementNode
}) {
  const [tree, setTree] = useState<RapidEditorTree>(
    normalizeRapidElement(component, null)
  )

  const denormalized = useMemo(() => denormalizeRapidElement(tree), [tree])

  function update<R extends RapidNode>(nodeId: string, patch: DeepPartial<R>) {
    setTree(u({ [nodeId]: u(patch, tree[nodeId] as R) }, tree))
  }

  function deleteNode(nodeId: string) {
    const target = tree[nodeId]
    const parentId = target.parent === tree.root.id ? 'root' : target.parent!
    const targetParent = tree[parentId] as NormalizedElementNode

    if (!target || !targetParent) return

    setTree(
      u(
        {
          [parentId]: {
            data: {
              children: targetParent.data.children.filter(c => c !== nodeId),
            },
          },
        },
        omit(tree, [nodeId]) as RapidEditorTree
      )
    )
  }

  function insertNode(parentId: string, tag: RapidElementTag | 'text') {
    let normalized: NormalizedNode
    if (tag === 'text') {
      normalized = {
        id: uuid(),
        parent: parentId,
        type: 'text',
        data: { text: '' },
      }
    } else {
      normalized = {
        id: uuid(),
        parent: parentId,
        type: 'element',
        data: { tag, children: [], css: '', attrs: {} },
      }
    }

    setTree(
      u(
        {
          [normalized.id]: normalized,
          [parentId]: {
            data: {
              children: (
                tree[parentId] as NormalizedElementNode
              ).data.children.concat(normalized.id),
            },
          },
        },
        tree
      )
    )
  }

  return (
    <RapidEditorContext.Provider
      value={{
        component: denormalized,
        update,
        tree,
        insertNode,
        deleteNode,
      }}
    >
      {children}
    </RapidEditorContext.Provider>
  )
}

export function useRapidEditor() {
  const ctx = useContext(RapidEditorContext)
  return useMemo(() => ctx, [ctx])
}

export function useUpdateRapidNode() {
  return useRapidEditor().update
}

export function useRapidComponent() {
  return useRapidEditor().component
}

export function useDeleteRapidNode() {
  return useRapidEditor().deleteNode
}

export function useRapidTreeNode(id: string) {
  return useRapidEditor().tree[id]
}

function normalizeRapidElement(
  node: RapidElementNode,
  parent: RapidElementNode | null
): RapidEditorTree {
  const normalizedNode = u(
    {
      parent: parent && parent.id,
      data: { children: node.data.children.map(child => child.id) },
    },
    node as unknown as NormalizedElementNode
  )

  return node.data.children.reduce(
    (acc, child) => {
      switch (child.type) {
        case 'element':
          acc = u(normalizeRapidElement(child, node), acc)
          break
        case 'text':
          acc[child.id] = { ...child, parent: node.id }
          break
        default:
          break
      }
      return acc
    },
    {
      [parent === null ? 'root' : node.id]: normalizedNode,
    } as RapidEditorTree
  )
}

function denormalizeRapidElement(tree: RapidEditorTree): RapidElementNode {
  function denormalizeNode(
    id: string
  ): RapidElementNode | RapidTextNode | null {
    const target = tree[id]
    switch (target.type) {
      case 'element':
        return {
          ...target,
          data: {
            ...target.data,
            children: target.data.children.reduce((acc, childId) => {
              const denormalized = denormalizeNode(childId)
              if (denormalized !== null) {
                acc.push(denormalized)
              }
              return acc
            }, [] as RapidNode[]),
          },
        }
      case 'text':
        return target
      default:
        return null
    }
  }

  return {
    id: tree.root.id,
    type: 'element',
    data: {
      ...tree.root.data,
      children: tree.root.data.children.reduce((acc, childId) => {
        const denormalized = denormalizeNode(childId)
        if (denormalized !== null) {
          acc.push(denormalized)
        }
        return acc
      }, [] as RapidNode[]),
    },
  }
}
