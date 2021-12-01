import { createContext, ReactNode, useContext, useState } from 'react'
import u from 'updeep'
import { DEFAULT_COMPONENT_TREE } from '../../constants'
import { RapidElementNode } from '../../types'

const RapidEditorContext = createContext<{
  component: RapidElementNode
  update: (u: DeepPartial<RapidElementNode>) => void
}>({
  component: DEFAULT_COMPONENT_TREE,
  update() {},
})

export function RapidEditorProvider({
  children,
  component,
}: {
  children: ReactNode
  component: RapidElementNode
}) {
  const [_component, _setComponent] = useState(component)
  const update = (patch: DeepPartial<RapidElementNode>) =>
    _setComponent(u(patch, _component))

  return (
    <RapidEditorContext.Provider value={{ component: _component, update }}>
      {children}
    </RapidEditorContext.Provider>
  )
}

export function useRapidEditor() {
  return useContext(RapidEditorContext)
}
