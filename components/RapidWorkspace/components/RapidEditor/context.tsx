import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import {
  NormalizedElementNode,
  NormalizedNode,
  RapidElementNode,
  RapidNode,
  RapidTextNode,
} from 'components/RapidWorkspace/types'
import u from 'updeep'
import { DEFAULT_COMPONENT_TREE } from 'components/RapidWorkspace/constants'

type RapidEditorTree = {
  root: Exclude<NormalizedNode, RapidTextNode>
  [id: string]: NormalizedNode
}

const RapidEditorContext = createContext<{
  component: RapidElementNode
  update<R extends RapidNode>(nodeId: string, patch: DeepPartial<R>): void
  tree: RapidEditorTree
}>({
  update() {
    console.log('empty update fn')
  },
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
    normalizeRapidElement(component, true)
  )

  const denormalized = useMemo(() => denormalizeRapidElement(tree), [tree])

  function update<R extends RapidNode>(nodeId: string, patch: DeepPartial<R>) {
    setTree(u({ [nodeId]: u(patch, tree[nodeId] as R) }, tree))
  }

  return (
    <RapidEditorContext.Provider
      value={{ component: denormalized, update, tree }}
    >
      {children}
    </RapidEditorContext.Provider>
  )
}

function useRapidEditor() {
  const ctx = useContext(RapidEditorContext)
  return useMemo(() => ctx, [ctx])
}

export function useUpdateRapidNode() {
  return useRapidEditor().update
}

export function useRapidComponent() {
  return useRapidEditor().component
}

export function useRapidTreeLeaf<Id extends string>(id: Id) {
  return useRapidEditor().tree[id] as Id extends 'root'
    ? NormalizedElementNode
    : NormalizedNode
}

function normalizeRapidElement(
  node: RapidElementNode,
  root = false
): RapidEditorTree {
  const normalizedNode = u(
    { data: { children: node.data.children.map(child => child.id) } },
    node as unknown as NormalizedElementNode
  )

  return node.data.children.reduce(
    (acc, child) => {
      switch (child.type) {
        case 'element':
          acc = u(normalizeRapidElement(child), acc)
          break
        case 'text':
          acc[child.id] = child
          break
        default:
          break
      }
      return acc
    },
    {
      [root ? 'root' : node.id]: normalizedNode,
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
